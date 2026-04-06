import { apiClient } from './client'
import type { PurchaseType } from './types'

export const getPurchaseTypes = () =>
  apiClient.get<PurchaseType[]>('/api/purchase-types').then((r) => r.data)

export const createPurchaseType = (name: string) =>
  apiClient.post<PurchaseType>('/api/purchase-types', { name }).then((r) => r.data)

export const updatePurchaseType = (id: number, name: string) =>
  apiClient.put<PurchaseType>(`/api/purchase-types/${id}`, { name }).then((r) => r.data)

export const deletePurchaseType = (id: number) =>
  apiClient.delete(`/api/purchase-types/${id}`)
