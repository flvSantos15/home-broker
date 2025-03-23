"use client";

import { Asset } from "@/models";
import { useAssetStore } from "@/zustand";
import { useShallow } from "zustand/shallow";

interface AssetPriceProps {
  asset: Asset;
}

export function AssetPrice({ asset }: AssetPriceProps) {
  const assetFetched = useAssetStore(
    useShallow((state) =>
      state.assets.find((asset) => asset.symbol === asset.symbol)
    )
  );

  const price = assetFetched ? assetFetched.price : asset.price;

  return <div className="ml-2 font-bold text-2xl">R$ {price}</div>;
}
