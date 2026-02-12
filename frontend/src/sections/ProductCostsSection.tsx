import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProducts } from '@/api/products'
import { getProductCosts, upsertProductCost } from '@/api/product-costs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatBRL } from '@/lib/format'
import { Pencil, Check, X } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

export function ProductCostsSection() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const { data: costs } = useQuery({
    queryKey: ['product-costs'],
    queryFn: getProductCosts,
  })

  const mutation = useMutation({
    mutationFn: upsertProductCost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-costs'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setEditingId(null)
    },
  })

  const costMap = new Map(costs?.map((c) => [c.productId, c.cost]))

  function startEditing(productId: string) {
    const currentCost = costMap.get(productId)
    setEditValue(currentCost?.toString() ?? '')
    setEditingId(productId)
  }

  function handleSave(productId: string) {
    const cost = parseFloat(editValue)
    if (isNaN(cost) || cost < 0) return
    mutation.mutate({ productId, cost })
  }

  function handleCancel() {
    setEditingId(null)
    setEditValue('')
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Custos de Produto</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead className="text-right">Custo</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                Nenhum produto cadastrado
              </TableCell>
            </TableRow>
          )}
          {products?.map((product) => {
            const currentCost = costMap.get(product.id)
            const isEditing = editingId === product.id

            return (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-32 ml-auto text-right"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave(product.id)
                        if (e.key === 'Escape') handleCancel()
                      }}
                    />
                  ) : (
                    <span>{currentCost != null ? formatBRL(currentCost) : '—'}</span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSave(product.id)}
                        disabled={mutation.isPending}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(product.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </section>
  )
}
