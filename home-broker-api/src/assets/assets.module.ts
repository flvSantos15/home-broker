import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetsDailiesController } from './asset-dailies.controller';
import { AssetDailiesService } from './asset-dailies.service';
import { AssetsController } from './assets.controller';
import { AssetsGateway } from './assets.gateway';
import { AssetsService } from './assets.service';
import { AssetDaily, AssetDailySchema } from './entities/asset-daly.entity';
import { Asset, AssetSchema } from './entities/asset.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Asset.name, schema: AssetSchema },
      { name: AssetDaily.name, schema: AssetDailySchema },
    ]),
  ],
  controllers: [AssetsController, AssetsDailiesController],
  providers: [AssetsService, AssetsGateway, AssetDailiesService],
  exports: [AssetsService],
})
export class AssetsModule {}
