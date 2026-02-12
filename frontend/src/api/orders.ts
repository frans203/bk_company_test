import { api } from './axios'
import type { Order } from '@/types'

export async function getOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/orders')
  return data
}
