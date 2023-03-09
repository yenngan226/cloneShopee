import { beforeEach, describe, expect, it } from 'vitest'
import {
  saveAccessTokenToLS,
  saveRefreshTokenToLS,
  getAccessToken,
  getProfile,
  clearLS,
  getRefreshToken,
  saveProfileToLS
} from '../auth.utils'
import { User } from 'src/types/user.type'

const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjM0NmUzNmQ3YzYyMDM0MDg1MWZhYyIsImVtYWlsIjoieWVubmdhbkBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIzLTAzLTA5VDAyOjU1OjM4LjA3OFoiLCJpYXQiOjE2NzgzMzA1MzgsImV4cCI6MTY3ODMzNDEzOH0.22FJf__KXEjkL4UN7jXhk4TTD2p1eKxqlakXUCA4oKk'
const refresh_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjM0NmUzNmQ3YzYyMDM0MDg1MWZhYyIsImVtYWlsIjoieWVubmdhbkBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIzLTAzLTA5VDAyOjU1OjM4LjA3OFoiLCJpYXQiOjE2NzgzMzA1MzgsImV4cCI6MTY3OTEzMDUzOH0.sQgUGSoKcVmV4iNHDR2ankbwsbaURHWVHdzPDgZMTRQ'
const profile = {
  _id: '63f346e36d7c620340851fac',
  roles: ['User'],
  email: 'yenngan@gmail.com',
  createdAt: '2023-02-20T10:09:39.062Z',
  updatedAt: '2023-03-08T05:50:02.329Z',
  __v: 0,
  date_of_birth: '1990-01-01T14:00:00.000Z'
}
beforeEach(() => {
  console.log('abc')

  localStorage.clear()
})

describe('saveAccessTokenToLS', () => {
  it('access token will be set to LS ', () => {
    saveAccessTokenToLS(access_token)
    expect(getAccessToken()).toBe(access_token)
  })
})

describe('saveRefreshTokenToLS', () => {
  it('refreshtoken will be set to LS', () => {
    saveRefreshTokenToLS(refresh_token)
    expect(localStorage.getItem('refresh_token')).toBe(refresh_token)
  })
})

describe('saveProfileToLS', () => {
  it('Save profile to LS', () => {
    saveProfileToLS(profile as User)
    expect(getProfile()).toEqual(profile)
  })
})
describe('clearLS', () => {
  it('clear LS', () => {
    saveAccessTokenToLS(access_token)
    saveProfileToLS(profile as User)
    saveRefreshTokenToLS(refresh_token)
    clearLS()
    expect(getProfile()).toEqual(null)
    expect(getAccessToken()).toBe('')
    expect(getRefreshToken()).toBe('')
  })
})
