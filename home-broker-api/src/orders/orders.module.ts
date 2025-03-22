import * as kafkaLib from '@confluentinc/kafka-javascript';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AssetDaily,
  AssetDailySchema,
} from 'src/assets/entities/asset-daly.entity';
import { Asset, AssetSchema } from 'src/assets/entities/asset.entity';
import {
  WalletAsset,
  WalletAssetSchema,
} from 'src/wallets/entities/wallet-asset.entity';
import { Wallet, WalletSchema } from 'src/wallets/entities/wallet.entity';
import { Order, OrderSchema } from './entities/order.entity';
import { Trade, TradeSchema } from './entities/trade.entity';
import { OrderConsumer } from './order.consumer';
import { OrdersController } from './orders.controller';
import { OrdersGateway } from './orders.gateway';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Trade.name, schema: TradeSchema },
      { name: Asset.name, schema: AssetSchema },
      { name: AssetDaily.name, schema: AssetDailySchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: WalletAsset.name, schema: WalletAssetSchema },
    ]),
  ],
  controllers: [OrdersController, OrderConsumer],
  providers: [
    OrdersService,
    OrdersGateway,
    {
      provide: kafkaLib.KafkaJS.Kafka,
      useFactory() {
        return new kafkaLib.KafkaJS.Kafka({
          'bootstrap.servers': 'localhost:9094',
        });
      },
    },
  ],
})
export class OrdersModule {}
