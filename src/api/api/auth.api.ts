import { authConstant } from 'src/constant/auth'
import { AuthResponse } from 'src/types/auth.type'
import { http } from '../http'

export const authApi = {
  registerAccount: (body: { email: string; password: string }) => {
    return http.post<AuthResponse>(authConstant.register, body)
  },
  loginAccount: (body: { email: string; password: string }) => {
    return http.post<AuthResponse>(authConstant.login, body)
  },
  logout: () => {
    return http.post<AuthResponse>(authConstant.logout)
  },
  refreshToken: () => {
    return http.post<AuthResponse>(authConstant.refreshToken)
  }
}
