import { WalletList } from "@/components/WalletList"
import { getMyWallet } from "@/queries/queries"
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow
} from "flowbite-react"
import Image from "next/image"
import Link from "next/link"

export default async function MyWallet({
  searchParams
}: {
  searchParams: Promise<{ wallet_id: string }>
}) {
  const { wallet_id } = await searchParams

  if (!wallet_id) {
    return <WalletList />
  }

  const wallet = await getMyWallet(wallet_id)

  if (!wallet) {
    return <WalletList />
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
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex space-x-1">
                      <div className="content-center">
                        {/* {asset.asset.image_url} */}
                        <Image
                          alt={asset.asset.symbol}
                          src={asset.asset.image_url}
                          width={30}
                          height={30}
                        />
                      </div>

                      <div className="flex flex-col text-sm">
                        <span>{asset.asset.name}</span>
                        <span>{asset.asset.symbol}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>R$ {asset.asset.price}</TableCell>
                  <TableCell>{asset.shares}</TableCell>
                  <TableCell>
                    <Button
                      color="light"
                      as={Link}
                      href={`/assets/${asset.asset.symbol}?wallet_id=${wallet_id}`}
                    >
                      Comprar/Vender
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
