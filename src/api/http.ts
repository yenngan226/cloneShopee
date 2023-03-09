import { isAxiosUnprocessableEntity } from 'src/utils/checkType.utils'
import {
  isAxiosExpiredToken,
  isAxiosUnauthorized
} from './../utils/checkType.utils'
import { authConstant } from './../constant/auth'
import axios, { AxiosError, AxiosInstance } from 'axios'

import { HttpStatusCode } from 'src/constant/httpStatusCode.enum'
import { toast } from 'react-toastify'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type'
import {
  clearLS,
  saveAccessTokenToLS,
  getAccessToken,
  saveProfileToLS,
  saveRefreshTokenToLS,
  getRefreshToken
} from 'src/utils/auth.utils'
import { ErrorResponse } from 'src/types/utils.type'
import { config } from 'src/constant/config'

// Ví dụ có 2 api bị hết token và gọi lại refresh token, theo bên dưới thì chỉ gọi 1 lần api refresh token.
// Nhưng với trường hợp như sau nó sẽ gọi 2 lần api refresh token
// API 1 gọi từ giây thứ 1-3
// API 2 gọi từ giây thứ 2-5
// Tới giây thứ 3 api 1 trả về lỗi sẽ gọi api refresh token từ giây 3 đến giây 4. Sau đó gọi lại API 1 thêm lần nữa từ giây 4 đến 6.
// Đến giây thứ 4, api refresh token đã chạy xong và this.refreshTokenRequest đã chạy tới finally và reset về null rồi.
// API 2 tới giây thứ 5 mới bắt đầu gọi api refresh token, khi này this.refreshTokenRequest là null nên sẽ gọi api refresh token thêm 1 lần nữa
class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    ;(this.accessToken = getAccessToken()),
      (this.refreshToken = getRefreshToken()),
      (this.refreshTokenRequest = null),
      (this.instance = axios.create({
        baseURL: config.baseURL,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'expire-access-token': 3600,
          'expire-refresh-token': 800000
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
          if (url === authConstant.login || url === authConstant.register) {
            const res = response.data as AuthResponse
            this.accessToken = res.data.access_token
            this.refreshToken = res.data.refresh_token
            saveAccessTokenToLS(this.accessToken)
            saveRefreshTokenToLS(this.refreshToken)
            saveProfileToLS(res.data.user)
          } else if (url === authConstant.logout) {
            this.accessToken = ''
            this.refreshToken = ''
            clearLS()
          }

          return response
        },
        (error: AxiosError) => {
          if (
            ![
              HttpStatusCode.Unauthorized,
              HttpStatusCode.UnprocessableEntity
            ].includes(error.response?.status as number)
          ) {
            const errorData: any | undefined = error.response?.data
            const message = errorData.message || error.message
            toast.error(message)
          }
          //Lỗi 401 có nhiều trường hợp:
          // -Token không đúng
          // -K truyền token
          // -Token hết hạn
          if (
            isAxiosUnauthorized<
              ErrorResponse<{ name: string; message: string }>
            >(error)
          ) {
            const config = error.response?.config
            const url = config?.url
            //trường hợp Token hết hạn(là access token) và request đó không phải là của request refresh token
            //thì mới tiến hành refresh token
            if (
              isAxiosExpiredToken(error) &&
              url !== authConstant.refreshToken
            ) {
              this.refreshTokenRequest = this.refreshTokenRequest
                ? this.refreshTokenRequest
                : this.handleRefreshToken().finally(() => {
                    //fix chỗ gọi api 2 lần
                    setTimeout(() => {
                      this.refreshTokenRequest = null
                    }, 10000)
                  })

              return this.refreshTokenRequest.then((access_token) => {
                if (config?.headers) {
                  //Chạy lại request cũ vừa bị lỗi thêm 1 lần nữa với config có access_token moi
                  return this.instance({
                    ...config,
                    headers: { ...config.headers, authentication: access_token }
                  })
                }
              })
            }
            //token không đúng, k truyền token, token hết hạn gọi refresh token bị fail
            //xóa local storage và toast
            clearLS()
            this.accessToken = ''
            this.refreshToken = ''
            toast.error(
              error.response?.data.data?.message || error.response?.data.message
            )
          }
          return Promise.reject(error)
        }
      )
  }
  private handleRefreshToken = () => {
    return this.instance
      .post<RefreshTokenResponse>(authConstant.refreshToken, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        this.accessToken = access_token
        saveAccessTokenToLS(access_token)
        return access_token
      })
      .catch((error) => {
        clearLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}
export const http = new Http().instance
export default Http
