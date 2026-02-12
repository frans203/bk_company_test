import { DashboardSection } from '@/sections/DashboardSection'
import { OrdersSection } from '@/sections/OrdersSection'
import { ProductCostsSection } from '@/sections/ProductCostsSection'
import { ProductsSection } from '@/sections/ProductsSection'

function App() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background px-6 py-4">
        <h1 className="text-2xl font-bold">BK Company</h1>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 flex flex-col gap-10">
        <DashboardSection />
        <OrdersSection />
        <ProductsSection />
        <ProductCostsSection />
      </main>
    </div>
  )
}

export default App
