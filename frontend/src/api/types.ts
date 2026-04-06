export interface PurchaseType {
  id: number
  name: string
}

export interface Purchase {
  id: number
  date: string
  description: string
  amount: string
  purchaseType: PurchaseType
}

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}
