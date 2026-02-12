import { api } from './axios'
import type { ProductCost, UpsertProductCostRequest } from '@/types'

export async function getProductCosts(): Promise<ProductCost[]> {
  const { data } = await api.get<ProductCost[]>('/product-costs')
  return data
}

export async function upsertProductCost(body: UpsertProductCostRequest): Promise<ProductCost> {
  const { data } = await api.put<ProductCost>('/product-costs', body)
  return data
}
