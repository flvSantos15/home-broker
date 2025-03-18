"use client";

import { Button, TableCell, TableRow } from "flowbite-react";
import Link from "next/link";

import { useAssetStore } from "@/zustand";
import { useShallow } from "zustand/react/shallow";

import { AssetShow } from "@/components/AssetShow";
import { WalletAsset } from "@/models";

interface ITableWalletAssetRowProps {
  walletAsset: WalletAsset;
  walletId: string;
}

export function TableWalletAssetRow({
  walletAsset,
  walletId,
}: ITableWalletAssetRowProps) {
  const assetFound = useAssetStore(
    useShallow((state) =>
      state.assets.find((asset) => asset.symbol === walletAsset.asset.symbol)
    )
  );

  const asset = assetFound || walletAsset.asset;

  return (
    <TableRow>
      <TableCell>
        <AssetShow asset={asset} />
      </TableCell>
      <TableCell>R$ {asset.price}</TableCell>
      <TableCell>{walletAsset.shares}</TableCell>
      <TableCell>
        <Button
          className="w-fit"
          color="light"
          as={Link}
          href={`/assets/${asset.symbol}?wallet_id=${walletId}`}
        >
          Comprar/Vender
        </Button>
      </TableCell>
    </TableRow>
  );
}
