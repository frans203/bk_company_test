import { api } from './axios'
import type { DashboardResponse } from '@/types'

export async function getDashboard(startDate?: string, endDate?: string): Promise<DashboardResponse> {
  const params: Record<string, string> = {}
  if (startDate) params.startDate = startDate
  if (endDate) params.endDate = endDate
  const { data } = await api.get<DashboardResponse>('/dashboard', { params })
  return data
}
