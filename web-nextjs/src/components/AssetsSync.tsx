"use client";

import { Asset } from "@/models";
import { socket } from "@/socke-io";
import { useAssetStore } from "@/zustand";
import { useEffect } from "react";

interface IAssetSyncProps {
  assetsSymbols: string[];
}

export function AssetsSync({ assetsSymbols }: IAssetSyncProps) {
  const changeAsset = useAssetStore((state) => state.changeAsset);

  useEffect(() => {
    socket.connect();

    socket.emit("joinAssets", { symbols: assetsSymbols });
    socket.on("assets/price-changed", (asset: Asset) => {
      changeAsset(asset);
    });

    return () => {
      socket.emit("leaveAssets", { symbols: assetsSymbols });
      socket.off("assets/price-changed");
    };
  }, [assetsSymbols, changeAsset]);

  return null;
}
