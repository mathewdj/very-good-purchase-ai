import { apiClient } from './client'
import type { Page, Purchase } from './types'

export interface PurchaseRequest {
  date: string
  description: string
  amount: string
  purchaseTypeId: number
}

export const getPurchases = (page = 0, size = 20) =>
  apiClient.get<Page<Purchase>>('/api/purchases', { params: { page, size } }).then((r) => r.data)

export const createPurchase = (data: PurchaseRequest) =>
  apiClient.post<Purchase>('/api/purchases', data).then((r) => r.data)

export const updatePurchase = (id: number, data: PurchaseRequest) =>
  apiClient.put<Purchase>(`/api/purchases/${id}`, data).then((r) => r.data)

export const deletePurchase = (id: number) =>
  apiClient.delete(`/api/purchases/${id}`)
