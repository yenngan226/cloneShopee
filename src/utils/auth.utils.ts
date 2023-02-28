import { User } from 'src/types/user.type'

export const LocalStorageEventTarget = new EventTarget()
export const saveAccessTokenToLS = (accessToken: string): void => {
  localStorage.setItem('access_token', accessToken)
}
export const saveRefreshTokenToLS = (refreshToken: string): void => {
  localStorage.setItem('refresh_token', refreshToken)
}
export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}
export const getAccessToken = (): string =>
  localStorage.getItem('access_token') || ''
export const getRefreshToken = (): string =>
  localStorage.getItem('refresh_token') || ''

export const saveProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
export const getProfile = () => {
  const profileString = localStorage.getItem('profile')
  return profileString ? JSON.parse(profileString) : null
}
