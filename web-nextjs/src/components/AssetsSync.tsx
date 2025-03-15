"use client";

import { Asset } from "@/models";
import { socket } from "@/socke-io";
import { useEffect } from "react";

interface IAssetSyncProps {
  assetsSymbols: string[];
}

export function AssetsSync({ assetsSymbols }: IAssetSyncProps) {
  useEffect(() => {
    socket.connect();

    socket.emit("joinAssets", { symbols: assetsSymbols });
    socket.on("assets/price-changed", (asset: Asset) => {
      console.log(asset);
    });

    return () => {
      socket.emit("leaveAssets", { symbols: assetsSymbols });
      socket.off("assets/price-changed");
    };
  }, [assetsSymbols]);

  return null;
}
