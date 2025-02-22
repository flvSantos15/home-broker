import { Asset, OrderType } from "@/models"
import { Button, Label, TextInput } from "flowbite-react"

interface IOrderFormProps {
  asset: Asset
  walletId: string
  type: OrderType
}

// Parei em 1:38:08

export function OrderForm({ asset, walletId, type }: IOrderFormProps) {
  const color = type === OrderType.BUY ? "text-bule-700" : "text-red-700"
  const translatedType = type === OrderType.BUY ? "compra" : "venda"

  return (
    <form>
      <input type="hidden" name="assetId" defaultValue={asset._id} />
      <input type="hidden" name="walleId" defaultValue={walletId} />
      <input type="hidden" name="type" defaultValue={type} />

      <div>
        <div className="mb-2">
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
      <br />
      <div>
        <div className="mb-2">
          <Label htmlFor="price" value="Preço R$" className={color}></Label>
        </div>

        <TextInput
          id="price"
          type="number"
          name="price"
          placeholder="Quantidade"
          required
          min={1}
          step={1}
          defaultValue={1}
          color={type === OrderType.BUY ? "info" : "failure"}
        />
      </div>
      <br />
      <Button type="submit" color={type === OrderType.BUY ? "blue" : "failure"}>
        Confirmar {translatedType}
      </Button>
    </form>
  )
}
