import { SuccessResponse } from './../../types/utils.type'
import { http } from '../http'
import { User } from 'src/types/user.type'

interface BodyUpdateProfile
  extends Omit<User, '_id' | 'role' | 'updatedAt' | 'createdAt' | 'email'> {
  password?: string
  new_password?: string
}
const URL = 'user'
export const userApi = {
  getUser: () => {
    return http.get<SuccessResponse<User>>('me')
  },
  updateProfile: (body: BodyUpdateProfile) => {
    return http.put<SuccessResponse<User>>(`${URL}`, body)
  },
  uploadAvatar: (body: FormData) => {
    return http.post<SuccessResponse<string>>(`${URL}/upload-avatar`, body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}
