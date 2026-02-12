import { useState, Fragment } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getOrders } from '@/api/orders'
import { format } from 'date-fns'
import { formatBRL } from '@/lib/format'
import { ChevronDown, ChevronRight } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

export function OrdersSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  })

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Pedidos Recentes</h2>
        <p className="text-sm text-muted-foreground">Ultimos pedidos recebidos via webhook</p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum pedido encontrado
                </TableCell>
              </TableRow>
            )}
            {orders?.map((order) => (
              <Fragment key={order.id}>
                <TableRow
                  className="cursor-pointer"
                  onClick={() => toggleExpand(order.id)}
                >
                  <TableCell className="w-8 pr-0">
                    {expandedId === order.id
                      ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </TableCell>
                  <TableCell className="font-mono">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{format(new Date(order.createdAt), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="text-right font-medium">{formatBRL(order.totalAmount)}</TableCell>
                </TableRow>
                {expandedId === order.id && (
                  <TableRow>
                    <TableCell />
                    <TableCell colSpan={4} className="bg-muted/30">
                      <div className="py-2">
                        <p className="text-xs text-muted-foreground mb-1">
                          {order.customerEmail}
                        </p>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-xs text-muted-foreground">
                              <th className="text-left font-medium py-1">Produto</th>
                              <th className="text-left font-medium py-1">SKU</th>
                              <th className="text-right font-medium py-1">Qtd</th>
                              <th className="text-right font-medium py-1">Unit.</th>
                              <th className="text-right font-medium py-1">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, idx) => (
                              <tr key={idx}>
                                <td className="py-1">{item.productName}</td>
                                <td className="py-1 font-mono text-xs">{item.productSku}</td>
                                <td className="text-right py-1">{item.quantity}</td>
                                <td className="text-right py-1">{formatBRL(item.unitPrice)}</td>
                                <td className="text-right py-1">{formatBRL(item.subtotal)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  )
}
