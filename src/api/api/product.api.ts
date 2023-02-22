import { SuccessResponse } from './../../types/utils.type'
import {
  Product,
  ProductList,
  ProductListConfig
} from './../../types/product.type'
import { http } from '../http'

const URL = 'products'
export const productApi = {
  getProduct: (params: ProductListConfig) => {
    return http.get<SuccessResponse<ProductList>>(URL, { params })
  },
  getProductDetail: (id: string) => {
    return http.get<SuccessResponse<Product>>(`${URL}/${id}`)
  }
}
