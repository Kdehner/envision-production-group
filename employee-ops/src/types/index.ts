// TypeScript type definitions
export interface User {
  id: string
  email: string
  name?: string
  role: string
  department?: string
}

export interface EquipmentInstance {
  id: number
  sku: string
  status: string
  // More types will be added
}
