import { AxiosError } from 'axios'
import { isAxiosError, isAxiosUnprocessableEntity } from './../checkType.utils'
import { describe, it, expect } from 'vitest'
import { HttpStatusCode } from 'src/constant/httpStatusCode.enum'

//describe dùng để mô tả tập hợp các ngữ cảnh hoặc 1 đơn vị cần test: function hoặc component
describe('isAxiosError', () => {
  //it để ghi chú trường hợp cần test
  it('isAxiosError trả về boolean', () => {
    //expect dùng để mong đợi giá trị trả về
    expect(isAxiosError(new Error())).toBe(false)
    expect(isAxiosError(new AxiosError())).toBe(true)
  })
})

describe('isAxiosUnprocessableEntity', () => {
  it('isAxiosUnprocessableEntity return boolean', () => {
    expect(isAxiosUnprocessableEntity(new Error())).toBe(false)
    expect(
      isAxiosUnprocessableEntity(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.InternalServerError,
          data: null
        } as any)
      )
    ).toBe(false)
    expect(
      isAxiosUnprocessableEntity(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.UnprocessableEntity,
          data: null
        } as any)
      )
    ).toBe(true)
  })
})
