import { AssetPresenter } from './asset.presenter';
import { AssetDaily } from './entities/asset-daly.entity';
import { Asset } from './entities/asset.entity';

export class AssetDailyPresenter {
  constructor(private assetDaily: AssetDaily) {}

  toJSON() {
    return {
      _id: this.assetDaily._id,
      asset: new AssetPresenter(this.assetDaily.asset as Asset).toJSON(),
      date: this.assetDaily.date,
      price: this.assetDaily.price,
    };
  }
}
