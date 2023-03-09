import { saveAccessTokenToLS, saveRefreshTokenToLS } from './../auth.utils'
import { HttpStatusCode } from 'src/constant/httpStatusCode.enum'
import { beforeEach, describe, expect, it } from 'vitest'
import Http from 'src/api/http'

const access_token1s =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjRhMGY2NmQ3YzYyMDM0MDg1MjEwZiIsImVtYWlsIjoibnR5bkBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIzLTAzLTA5VDA1OjM3OjI4LjMzOVoiLCJpYXQiOjE2NzgzNDAyNDgsImV4cCI6MTY3ODM0MDI0OX0.mLLfNLw07QGndd2k-vNvSfs6qgsXb_tHCiH_crSpJsc'
const refresh_token10year =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjRhMGY2NmQ3YzYyMDM0MDg1MjEwZiIsImVtYWlsIjoibnR5bkBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIzLTAzLTA5VDA1OjM3OjI4LjMzOVoiLCJpYXQiOjE2NzgzNDAyNDgsImV4cCI6MTk5MzcwMDI0OH0.UkI-hSlxCmM3yAZrXXRw362S-GlBOS-UpDPwC42h63I'

describe('http axios', () => {
  let http = new Http().instance
  beforeEach(() => {
    localStorage.clear()
    http = new Http().instance
  })
  it('call general api', async () => {
    const res = await http.get('products')
    expect(res.status).toBe(HttpStatusCode.Ok)
  }),
    it('call auth api', async () => {
      await http.post('login', {
        email: 'ntyn@gmail.com',
        password: '123456'
      })
      const res = await http.get('me')

      expect(res.status).toBe(HttpStatusCode.Ok)
    }),
    it('refresh token', async () => {
      saveAccessTokenToLS(access_token1s)
      saveRefreshTokenToLS(refresh_token10year)
      const httpNew = new Http().instance
      const res = await httpNew.get('me')
      console.log(res)
      expect(res.status).toBe(HttpStatusCode.Ok)
    })
})
