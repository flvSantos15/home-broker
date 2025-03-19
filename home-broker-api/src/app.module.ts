import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetsModule } from './assets/assets.module';
import { OrdersModule } from './orders/orders.module';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:root@localhost:27017/nest?authSource=admin&directConnection=true',
    ),
    AssetsModule,
    WalletsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
