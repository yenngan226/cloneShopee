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
  },
  buyProducts: (params: { product_id: string; buy_count: number }[]) => {
    return http.post<SuccessResponse<Purchase[]>>(`${URL}/buy-products`, params)
  },
  updatePurchase: (params: { product_id: string; buy_count: number }) => {
    return http.put<SuccessResponse<Purchase>>(`${URL}/update-purchase`, params)
  },
  deletePurchase: (purchaseIds: string[]) => {
    return http.delete<SuccessResponse<{ deleted_count: number }>>(`${URL}`, {
      data: purchaseIds
    })
  }
}

export default purchaseApi
