import { User } from 'src/types/user.type'

export const saveAccessTokenToLS = (accessToken: string): void => {
  localStorage.setItem('access_token', accessToken)
}
export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
}
export const getAccessToken = (): string =>
  localStorage.getItem('access_token') || ''

export const saveProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
export const getProfile = () => {
  const profileString = localStorage.getItem('profile')
  return profileString ? JSON.parse(profileString) : null
}
