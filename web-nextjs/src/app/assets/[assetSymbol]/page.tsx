import { AssetShow } from "@/components/AssetShow";
import { AssetsSync } from "@/components/AssetsSync";
import { OrderForm } from "@/components/OrderForm";
import { TabsItem } from "@/components/Tabs";
import { OrderType } from "@/models";
import { getAsset, getAssetDailies } from "@/queries/queries";
import { Card, Tabs } from "flowbite-react";
import { Time } from "lightweight-charts";
import { AssetChartComponent } from "./AssetChartComponent";
import { AssetPrice } from "./AssetPrice";

export default async function AssetDasboard({
  params,
  searchParams,
}: {
  params: Promise<{ assetSymbol: string }>;
  searchParams: Promise<{ wallet_id: string }>;
}) {
  const { assetSymbol } = await params;
  const { wallet_id } = await searchParams;

  const asset = await getAsset(assetSymbol);
  const assetDailies = await getAssetDailies(assetSymbol);
  const chartData = assetDailies.map((daily) => ({
    time: (Date.parse(daily.date) / 1000) as Time,
    value: daily.price,
  }));

  return (
    <div className="flex flex-col space-y-5 flex-grow">
      <div className="flex flex-col space-y-2">
        <AssetShow asset={asset} />

        <AssetPrice asset={asset} />
      </div>

      <div className="grid grid-cols-5 flex-grow gap-2">
        <div className="col-span-2">
          <Card>
            <Tabs>
              <TabsItem
                active
                title={<div className="text-blue-700">Comprar</div>}
              >
                <OrderForm
                  asset={asset}
                  type={OrderType.BUY}
                  walletId={wallet_id}
                />
              </TabsItem>
              <TabsItem title={<div className="text-red-700">Venda</div>}>
                <OrderForm
                  asset={asset}
                  type={OrderType.SELL}
                  walletId={wallet_id}
                />
              </TabsItem>
            </Tabs>
          </Card>
        </div>

        <div className="col-span-3 flex flex-grow">
          <AssetChartComponent asset={asset} data={chartData} />
        </div>
      </div>
      <AssetsSync assetsSymbols={[asset.symbol]} />
    </div>
  );
}
