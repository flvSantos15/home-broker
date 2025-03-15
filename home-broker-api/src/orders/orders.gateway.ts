import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { OrderType } from './entities/order.entity';
import { OrdersService } from './orders.service';

type PayloadProps = {
  assetId: string;
  walletId: string;
  type: OrderType;
  shares: number;
  price: number;
};

@WebSocketGateway({ cors: true })
export class OrdersGateway {
  constructor(private ordersService: OrdersService) {}

  @SubscribeMessage('orders/create')
  async handleMessage(client: any, payload: PayloadProps) {
    const order = await this.ordersService.create({
      assetId: payload.assetId,
      walletId: payload.walletId,
      type: payload.type,
      shares: payload.shares,
      price: payload.price,
    });
    return order;
  }
}
