import { AssetShow } from "@/components/AssetShow"
import { OrderForm } from "@/components/OrderForm"
import { TabsItem } from "@/components/Tabs"
import { Asset, OrderType } from "@/models"
import { Card, Tabs } from "flowbite-react"
import { AssetChartComponent } from "./AssetChartComponent"

export async function getAsset(symbol: string): Promise<Asset> {
  const response = await fetch(`http://localhost:3000/assets/${symbol}`)
  return response.json()
}

export default async function AssetDasboard({
  params,
  searchParams
}: {
  params: Promise<{ assetSymbol: string }>
  searchParams: Promise<{ wallet_id: string }>
}) {
  const { assetSymbol } = await params
  const { wallet_id } = await searchParams

  const asset = await getAsset(assetSymbol)

  return (
    <div className="flex flex-col space-y-5 flex-grow">
      <div className="flex flex-col space-y-2">
        <AssetShow asset={asset} />

        <div className="ml-1 font-semibold text-2xl">R$ {asset.price}</div>
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
          <AssetChartComponent asset={asset} />
        </div>
      </div>
    </div>
  )
}
