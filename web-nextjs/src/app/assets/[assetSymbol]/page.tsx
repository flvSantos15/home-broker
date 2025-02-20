import { AssetShow } from "@/components/AssetShow"
import { Asset } from "@/models"

export async function getAsset(symbol: string): Promise<Asset> {
  const response = await fetch(`http://localhost:3000/assets/${symbol}`)
  return response.json()
}

// Parei em 1:23:05

export default async function AssetDasboard({
  params
}: {
  params: Promise<{ assetSymbol: string }>
}) {
  const { assetSymbol } = await params

  const asset = await getAsset(assetSymbol)

  return (
    <div className="flex flex-col space-y-5 flex-grow">
      <div className="flex flex-col space-y-2">
        <AssetShow asset={asset} />

        <div className="ml-1 font-semibold text-2xl">R$ {asset.price}</div>
      </div>
    </div>
  )
}
