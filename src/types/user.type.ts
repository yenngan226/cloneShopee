type Role = 'User' | 'Admin'
export type User = {
  _id: string
  roles?: Role[]
  email: string
  name?: string
  date_of_birth?: string //iso 8601
  avatar?: string
  address?: string
  phone?: string
  createdAt: string
  updatedAt: string
}
