import { Asset, OrderType } from "@/models"
import { Label, TextInput } from "flowbite-react"

interface IOrderFormProps {
  asset: Asset
  walletId: string
  type: OrderType
}

// Parei em 1:38:08

export function OrderForm({ asset, walletId, type }: IOrderFormProps) {
  const color = type === OrderType.BUY ? "text-bule-700" : "text-red-700"
  const translatedType = type === OrderType.BUY ? "comprar" : "vender"

  return (
    <form>
      <input type="hidden" name="assetId" defaultValue={asset._id} />
      <input type="hidden" name="walleId" defaultValue={walletId} />
      <input type="hidden" name="type" defaultValue={type} />

      <div>
        <div>
          <Label htmlFor="shares" value="Quantidade" className={color}></Label>
        </div>

        <TextInput
          id="shares"
          type="number"
          name="shares"
          placeholder="Quantidade"
          required
          min={1}
          step={1}
          defaultValue={1}
          color={type === OrderType.BUY ? "info" : "failure"}
        />
      </div>
    </form>
  )
}
