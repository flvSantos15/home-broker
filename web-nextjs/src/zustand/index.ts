import { Asset } from "@/models";
import { create } from "zustand";

export type AssetStore = {
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  changeAsset: (asset: Asset) => void;
  removeAsset: (asset: Asset) => void;
};

export const useAssetStore = create<AssetStore>((set) => ({
  assets: [],

  addAsset: (asset: Asset) =>
    set((state) => ({ assets: [...state.assets, asset] })),

  changeAsset: (asset: Asset) =>
    set((state) => {
      const assetIndex = state.assets.findIndex(
        (a) => a.symbol === asset.symbol
      );

      if (assetIndex === -1) {
        return { assets: [...state.assets, asset] };
      }

      const newAssets = [...state.assets];
      newAssets[assetIndex] = asset;

      return { assets: newAssets };
    }),

  removeAsset: (asset: Asset) =>
    set((state) => ({
      assets: state.assets.filter((a) => a.symbol !== asset.symbol),
    })),
}));
