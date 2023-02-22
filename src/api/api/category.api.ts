import { SuccessResponse } from './../../types/utils.type'
import { http } from '../http'
import { Category } from 'src/types/category.type'

const URL = 'categories'

export const categoryApi = {
  getCategories: () => {
    return http.get<SuccessResponse<Category[]>>(URL)
  }
}
