import { SuccessResponse } from './../../types/utils.type'
import { http } from '../http'
import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'

const URL = 'purchases'

const purchaseApi = {
  addToCart: (body: { product_id: string; buy_count: number }) => {
    return http.post<SuccessResponse<Purchase>>(`${URL}/add-to-cart`, body)
  },
  getPurchasesList: (params: { status: PurchaseListStatus }) => {
    return http.get<SuccessResponse<Purchase[]>>(`${URL}`, { params })
  }
}

export default purchaseApi
