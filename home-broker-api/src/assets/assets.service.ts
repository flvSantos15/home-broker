/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { CreateAssetDto } from './dto/create-asset.dto';
import { Asset } from './entities/asset.entity';

@Injectable()
export class AssetsService {
  constructor(@InjectModel(Asset.name) private assetSchema: Model<Asset>) {}

  create(createAssetDto: CreateAssetDto) {
    return this.assetSchema.create(createAssetDto);
  }

  findAll() {
    return this.assetSchema.find();
  }

  findOne(symbol: string) {
    return this.assetSchema.findOne({ symbol });
  }

  subscribeNewPriceChangeEvents(): Observable<Asset> {
    return new Observable((observer) => {
      this.assetSchema
        .watch(
          [
            {
              $match: {
                $or: [
                  { operationType: 'update' },
                  { operationType: 'replace' },
                ],
              },
            },
          ],
          {
            fullDocument: 'updateLookup',
            fullDocumentBeforeChange: 'whenAvailable',
          },
        )
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .on('change', async (data) => {
          if (
            data?.fullDocument?.price === data?.fullDocumentBeforeChange?.price
          ) {
            return;
          }

          const asset = await this.assetSchema.findById(data?.fullDocument._id);
          observer.next(asset!);
        });
    });
  }
}
