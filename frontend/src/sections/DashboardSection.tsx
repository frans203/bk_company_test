import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '@/api/dashboard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { formatBRL } from '@/lib/format'

export function DashboardSection() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [appliedStart, setAppliedStart] = useState<string | undefined>()
  const [appliedEnd, setAppliedEnd] = useState<string | undefined>()

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', appliedStart, appliedEnd],
    queryFn: () => getDashboard(appliedStart, appliedEnd),
  })

  function handleFilter() {
    setAppliedStart(startDate || undefined)
    setAppliedEnd(endDate || undefined)
  }

  const cards = [
    { title: 'Lucro', value: data?.profit },
    { title: 'Faturamento', value: data?.totalRevenue },
    { title: 'Custo Total', value: data?.totalCost },
    { title: 'Total de Pedidos', value: data?.orderCount, isCurrency: false },
  ]

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Visao geral da sua loja</p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="startDate">Data Inicial</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="endDate">Data Final</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Button onClick={handleFilter}>Filtrar</Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Card key={card.title}>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground font-normal">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {card.isCurrency === false
                    ? (card.value ?? 0).toLocaleString('pt-BR')
                    : formatBRL(card.value ?? 0)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
