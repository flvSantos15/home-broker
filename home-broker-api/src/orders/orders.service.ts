import * as kafkaLib from '@confluentinc/kafka-javascript';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AssetDaily } from 'src/assets/entities/asset-daly.entity';
import { Asset, AssetDocument } from 'src/assets/entities/asset.entity';
import { WalletAsset } from 'src/wallets/entities/wallet-asset.entity';
import { Wallet, WalletDocument } from 'src/wallets/entities/wallet.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateTradeDto } from './dto/create-tarde.dto';
import {
  Order,
  OrderAssetDocument,
  OrderStatus,
  OrderType,
} from './entities/order.entity';
import { Trade } from './entities/trade.entity';

@Injectable()
export class OrdersService implements OnModuleInit {
  private kafkaProducer: kafkaLib.KafkaJS.Producer;

  constructor(
    @InjectModel(Order.name)
    private orderSchema: Model<Order>,
    @InjectConnection() private connection: mongoose.Connection,
    @InjectModel(Asset.name) private assetSchema: Model<Asset>,
    @InjectModel(AssetDaily.name) private assetDailySchema: Model<AssetDaily>,
    @InjectModel(WalletAsset.name)
    private walletAssetSchema: Model<WalletAsset>,
    @InjectModel(Wallet.name) private walletSchema: Model<Wallet>,
    @InjectModel(Trade.name) private tradeSchema: Model<Wallet>,
    private kafkaInst: kafkaLib.KafkaJS.Kafka,
  ) {}

  async onModuleInit() {
    this.kafkaProducer = this.kafkaInst.producer();
    await this.kafkaProducer.connect();
  }

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.orderSchema.create({
      wallet: createOrderDto.walletId,
      asset: createOrderDto.assetId,
      shares: createOrderDto.shares,
      partial: createOrderDto.shares,
      price: createOrderDto.price,
      type: createOrderDto.type,
      status: OrderStatus.PENDING,
    });

    await this.kafkaProducer.send({
      topic: 'input',
      messages: [
        {
          key: order._id,
          value: JSON.stringify({
            order_id: order._id,
            investor_id: order.wallet,
            asset_id: order.asset,
            shares: order.shares,
            price: order.price,
            order_type: order.type,
          }),
        },
      ],
    });
    return order;
  }

  findAll(filter: { walletId: string }) {
    return this.orderSchema
      .find({ wallet: filter.walletId })
      .populate('asset') as Promise<(Order & { asset: Asset })[]>;
    //.populate(['asset', 'trade']);
  }

  findOne(id: string) {
    return this.orderSchema.findById(id);
  }

  async createTrade(dto: CreateTradeDto) {
    const session = await this.connection.startSession();
    await session.startTransaction();
    try {
      const order = (await this.orderSchema
        .findById(dto.orderId)
        .session(session)) as OrderAssetDocument & { trades: string[] };

      if (!order) {
        throw new Error('Order not found');
      }

      const tradeDocs = await this.tradeSchema.create(
        [
          {
            broker_trade_id: dto.brokerTradeId,
            related_investor_id: dto.relatedInvestorId,
            shares: dto.shares,
            price: dto.price,
            order: order._id,
          },
        ],
        { session },
      );
      const trade = tradeDocs[0];

      order.partial -= dto.shares;
      order.status = dto.status;
      order.trades.push(trade._id);
      await order.save({ session });

      if (dto.status === OrderStatus.CLOSED && order.type === OrderType.BUY) {
        const asset = (await this.assetSchema
          .findById(order.asset)
          .session(session)) as AssetDocument;

        if (asset.updatedAt < dto.date) {
          asset.price = dto.price;
          await asset.save({ session });
        }

        const assetDaily = await this.assetDailySchema
          .findOne({
            asset: order.asset,
            date: dto.date,
          })
          .session(session);

        if (!assetDaily) {
          await this.assetDailySchema.create(
            [
              {
                asset: order.asset,
                date: dto.date,
                price: dto.price,
              },
            ],
            { session },
          );
        }
      }

      if (dto.status === OrderStatus.CLOSED) {
        const walletAsset = await this.walletAssetSchema
          .findOne({
            wallet: order.wallet,
            asset: order.asset,
          })
          .session(session);

        if (!walletAsset && order.type === OrderType.SELL) {
          throw new Error('Asset not found in wallet');
        }

        if (walletAsset) {
          //@TODO - verificar se o saldo é suficiente
          walletAsset.shares +=
            order.type === OrderType.BUY ? dto.shares : -dto.shares;
          await walletAsset.save({ session });
        } else {
          const walletAssetDocs = await this.walletAssetSchema.create(
            [
              {
                wallet: order.wallet,
                asset: order.asset,
                shares: dto.shares,
              },
            ],
            { session },
          );
          const walletAsset = walletAssetDocs[0];
          const wallet = (await this.walletSchema.findById(
            order.wallet,
          )) as WalletDocument & { assets: string[] };
          wallet.assets.push(walletAsset._id);
          await wallet.save({ session });
        }
      }

      await session.commitTransaction();
      return order;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }
}
