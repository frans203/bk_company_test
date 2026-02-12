export interface Product {
  id: string
  name: string
  sku: string
  price: number
}

export interface CreateProductRequest {
  name: string
  sku: string
  price: number
}

export interface UpdateProductRequest {
  name?: string
  sku?: string
  price?: number
}

export interface OrderItem {
  productSku: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  totalAmount: number
  createdAt: string
}

export interface ProductCost {
  id: string
  productId: string
  cost: number
}

export interface UpsertProductCostRequest {
  productId: string
  cost: number
}

export interface DashboardResponse {
  orderCount: number
  totalRevenue: number
  totalCost: number
  profit: number
}
