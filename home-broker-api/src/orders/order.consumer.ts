import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderStatus, OrderType } from './entities/order.entity';

export type TradeKafkaMessage = {
  order_id: string;
  invertor_id: string;
  asset_id: string;
  order_type: OrderType;
  status: OrderStatus.OPEN | OrderStatus.CLOSED;
  partial: number;
  shares: number;
  transactions: {
    transaction_id: string;
    buyer_id: string;
    seller_id: string;
    asset_id: string;
    shares: number;
    price: number;
  }[];
};

@Controller()
export class OrderConsumer {
  @EventPattern('output')
  handleTrade(@Payload() message: TradeKafkaMessage) {
    console.log(message);
  }
}
