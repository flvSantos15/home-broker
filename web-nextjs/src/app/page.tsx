import { AssetsSync } from "@/components/AssetsSync";
import { WalletList } from "@/components/WalletList";
import { getMyWallet } from "@/queries/queries";
import { Table, TableBody, TableHead, TableHeadCell } from "flowbite-react";
import { TableWalletAssetRow } from "./TableWalletAssetRow";

export default async function MyWallet({
  searchParams,
}: {
  searchParams: Promise<{ wallet_id: string }>;
}) {
  const { wallet_id } = await searchParams;

  if (!wallet_id) {
    return <WalletList />;
  }

  const wallet = await getMyWallet(wallet_id);

  if (!wallet) {
    return <WalletList />;
  }

  return (
    <div className="flex flex-col space-y-5 flex-grow">
      <article className="format">
        <h1>Minha cateira</h1>
      </article>

      <div className="overflow-x-auto w-full">
        <Table className="w-full max-w-full table-fixed">
          <TableHead>
            <TableHeadCell>Ativo</TableHeadCell>
            <TableHeadCell>Cotação</TableHeadCell>
            <TableHeadCell>Quantidade</TableHeadCell>
            <TableHeadCell>Comprar/Vender</TableHeadCell>
          </TableHead>
          <TableBody>
            {wallet?.assets?.map((asset, index) => {
              return (
                <TableWalletAssetRow
                  key={index}
                  walletAsset={asset}
                  walletId={wallet_id}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AssetsSync
        assetsSymbols={wallet.assets.map((asset) => asset.asset.symbol)}
      />
    </div>
  );
}
