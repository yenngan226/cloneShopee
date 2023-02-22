import { AuthResponse } from 'src/types/auth.type'
import { http } from '../http'

export const authApi = {
  registerAccount: (body: { email: string; password: string }) => {
    return http.post<AuthResponse>('/register', body)
  },
  loginAccount: (body: { email: string; password: string }) => {
    return http.post<AuthResponse>('/login', body)
  },
  logout: () => {
    return http.post<AuthResponse>('/logout')
  }
}
