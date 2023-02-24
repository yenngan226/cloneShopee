import axios, { AxiosError, AxiosInstance } from 'axios'

import { HttpStatusCode } from 'src/constant/httpStatusCode.enum'
import { toast } from 'react-toastify'
import { AuthResponse } from 'src/types/auth.type'
import {
  clearLS,
  saveAccessTokenToLS,
  getAccessToken,
  saveProfileToLS
} from 'src/utils/auth.utils'
import path from 'src/constant/path'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    ;(this.accessToken = getAccessToken()),
      (this.instance = axios.create({
        baseURL: 'https://api-ecom.duthanhduoc.com/',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      })),
      this.instance.interceptors.request.use(
        (config) => {
          if (this.accessToken && config.headers) {
            config.headers.authorization = this.accessToken
            return config
          }
          return config
        },
        (error) => Promise.reject(error)
      ),
      this.instance.interceptors.response.use(
        (response) => {
          const { url } = response.config
          if (url === path.login || url === path.register) {
            const res = response.data as AuthResponse
            this.accessToken = res.data.access_token
            saveAccessTokenToLS(this.accessToken)
            saveProfileToLS(res.data.user)
          } else if (url === '/logout') {
            this.accessToken = ''
            clearLS()
          }

          return response
        },
        (error: AxiosError) => {
          if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
            const errorData: any | undefined = error.response?.data
            const message = errorData.message || error.message
            toast.error(message)
          }
          return Promise.reject(error)
        }
      )
  }
}
export const http = new Http().instance
