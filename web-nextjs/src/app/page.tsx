import { Wallet } from "@/models"
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

export async function getMyWallet(walletId: string): Promise<Wallet> {
  const response = await fetch(`http://localhost:3000/wallets/${walletId}`)
  return response.json()
}

export default async function MyWallet({
  searchParams
}: {
  searchParams: Promise<{ wallet_id: string }>
}) {
  const { wallet_id } = await searchParams
  const wallet = await getMyWallet(wallet_id)

  // Parei no 53:54

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
            {wallet.assets.map((asset) => {
              return (
                <TableRow key={asset._id}>
                  <TableCell>
                    <div>
                      <div>
                        <Image
                          alt={asset.asset.symbol}
                          src={asset.asset.image_url}
                          width={30}
                          height={30}
                        />
                      </div>

                      <div>
                        <span>{asset.asset.name}</span>
                        <span>{asset.asset.symbol}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>R$ {asset.asset.price}</TableCell>
                  <TableCell>{asset.shares}</TableCell>
                  <TableCell>
                    <Button color="light">Comprar/Vender</Button>
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
