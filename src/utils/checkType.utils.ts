import axios, { AxiosError } from 'axios'
import { HttpStatusCode } from 'src/constant/httpStatusCode.enum'
import { ErrorResponse } from 'src/types/utils.type'

export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  return axios.isAxiosError(error)
}

export const isAxiosUnprocessableEntity = <UnprocessableEntityError>(
  error: unknown
): error is AxiosError<UnprocessableEntityError> => {
  return (
    isAxiosError(error) &&
    error.response?.status === HttpStatusCode.UnprocessableEntity
  )
}
export const isAxiosUnauthorized = <UnauthorizedError>(
  error: unknown
): error is AxiosError<UnauthorizedError> => {
  return (
    isAxiosError(error) &&
    error.response?.status === HttpStatusCode.Unauthorized
  )
}
export const isAxiosExpiredToken = <UnauthorizedError>(
  error: unknown
): error is AxiosError<UnauthorizedError> => {
  return (
    isAxiosUnauthorized<ErrorResponse<{ name: string; message: string }>>(
      error
    ) && error.response?.data?.data?.name === 'EXPIRED_TOKEN'
  )
}
