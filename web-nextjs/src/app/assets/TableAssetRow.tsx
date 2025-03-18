"use client";

import { Button, TableCell, TableRow } from "flowbite-react";
import Link from "next/link";

import { useAssetStore } from "@/zustand";
import { useShallow } from "zustand/react/shallow";

import { AssetShow } from "@/components/AssetShow";
import { Asset } from "@/models";

interface ITableAssetRowProps {
  asset: Asset;
  walletId: string;
}

export function TableAssetRow({ asset, walletId }: ITableAssetRowProps) {
  const assetFound = useAssetStore(
    useShallow((state) =>
      state.assets.find((asset) => asset.symbol === asset.symbol)
    )
  );

  const asset_ = assetFound || asset;

  return (
    <TableRow>
      <TableCell>
        <AssetShow asset={asset_} />
      </TableCell>
      <TableCell>R$ {asset_.price}</TableCell>
      <TableCell>
        <Button
          className="w-fit"
          color="light"
          as={Link}
          href={`/assets/${asset_.symbol}?wallet_id=${walletId}`}
        >
          Comprar/Vender
        </Button>
      </TableCell>
    </TableRow>
  );
}
