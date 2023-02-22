import * as yup from 'yup'
import { RegisterOptions, UseFormGetValues } from 'react-hook-form'

type Rules = {
  [key in 'email' | 'password' | 'confirm_password']: RegisterOptions
}

export const getRules = (getValues?: UseFormGetValues<any>): Rules => {
  return {
    email: {
      required: {
        value: true,
        message: 'Vui lòng nhập email'
      },
      pattern: {
        value: /^\S+@\S+\.\S+$/,
        message: 'Email không đúng định dạng'
      },
      maxLength: {
        value: 160,
        message: 'Độ dài từ 5-160 kí tự'
      },
      minLength: {
        value: 5,
        message: 'Độ dài từ 5-160 kí tự'
      }
    },
    password: {
      required: {
        value: true,
        message: 'Vui lòng nhập password'
      },
      maxLength: {
        value: 160,
        message: 'Độ dài từ 6-160 kí tự'
      },
      minLength: {
        value: 6,
        message: 'Độ dài từ 6-160 kí tự'
      }
    },
    confirm_password: {
      validate:
        typeof getValues === 'function'
          ? (value) => value === getValues('password') || 'Mật khẩu không khớp'
          : undefined,
      required: {
        value: true,
        message: ' Vui lòng nhập lại password'
      },
      maxLength: {
        value: 160,
        message: 'Độ dài từ 6-160 kí tự'
      },
      minLength: {
        value: 6,
        message: 'Độ dài từ 6-160 kí tự'
      }
    }
  }
}

export const authChema = yup.object({
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5-160 kí tự')
    .max(160, 'Độ dài từ 5-160 kí tự'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .min(6, 'Độ dài từ 6-160 kí tự')
    .max(160, 'Độ dài từ 6-160 kí tự'),
  confirm_password: yup
    .string()
    .required('Vui lòng nhập lại mật khẩu')
    .min(6, 'Độ dài từ 6-160 kí tự')
    .max(160, 'Độ dài từ 6-160 kí tự')
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp')
})
export const loginSchema = authChema.omit(['confirm_password'])

export type RegisterType = yup.InferType<typeof authChema>
export type LoginType = yup.InferType<typeof loginSchema>
