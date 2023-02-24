export type Product = {
  _id: string
  images: string[]
  price: number
  rating: number
  price_before_discount: number
  quantity: number
  sold: number
  view: number
  name: string
  category: {
    _id: string
    name: string
  }
  image: string
  createdAt: string
  updatedAt: string
  description: string
}

export type ProductList = {
  products: Product[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}

export type ProductListConfig = {
  page?: number | string
  limit?: number | string
  sort_by?: 'createdAt' | 'sold' | 'view' | 'price'
  order?: 'asc' | 'desc'
  exclude?: string
  rating_filter?: number | string
  price_max?: number | string
  price_min?: number | string
  name?: string
  category?: string
}

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}
