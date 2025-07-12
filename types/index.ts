export interface User {
    id: string
    email: string
    name: string
    points: number
    isAdmin: boolean
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Item {
    id: string
    title: string
    description?: string
    category: string
    size: string
    condition: string
    brand?: string
    images: string[]
    pointValue: number
    status: string
    isApproved: boolean
    createdAt: Date
    updatedAt: Date
    userId: string
    user: User
  }
  
  export interface Swap {
    id: string
    status: string
    message?: string
    pointsUsed: number
    createdAt: Date
    updatedAt: Date
    requesterId: string
    requester: User
    ownerId: string
    owner: User
    itemId: string
    item: Item
  }