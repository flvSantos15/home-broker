"use client";

import { Asset, Order, OrderType } from "@/models";
import { socket } from "@/socke-io";
import { Button, Label, TextInput } from "flowbite-react";
import { FormEvent } from "react";
import { toast } from "react-toastify";

interface IOrderFormProps {
  asset: Asset;
  walletId: string;
  type: OrderType;
}

export function OrderForm({ asset, walletId, type }: IOrderFormProps) {
  const color = type === OrderType.BUY ? "text-bule-700" : "text-red-700";
  const translatedType = type === OrderType.BUY ? "compra" : "venda";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    socket.connect();
    const newOrder: Order = await socket.emitWithAck("orders/create", data);
    toast(
      `Ordem ${translatedType} de ${newOrder.shares} ações de  ${asset.symbol} criada com sucesso!`,
      { type: "success", position: "top-right" }
    );
  }

  return (
    <form onSubmit={onSubmit}>
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
  );
}
