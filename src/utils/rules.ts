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
function getPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_max !== '' || price_min !== ''
}
const validateConfirmPW = (refString: string) => {
  return yup
    .string()
    .required('Vui lòng nhập lại mật khẩu')
    .min(6, 'Độ dài từ 6-160 kí tự')
    .max(160, 'Độ dài từ 6-160 kí tự')
    .oneOf([yup.ref(refString)], 'Mật khẩu không khớp')
}
export const schema = yup.object({
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
  confirm_password: validateConfirmPW('password'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: getPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: getPriceMinMax
  }),
  name: yup.string().required('Bắt buộc nhập').trim()
})
export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 ký tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  password: schema.fields['password'] as yup.StringSchema<
    string | undefined,
    yup.AnyObject,
    undefined,
    ''
  >,
  new_password: (
    schema.fields['password'] as yup.StringSchema<
      string | undefined,
      yup.AnyObject,
      undefined,
      ''
    >
  ).notOneOf([yup.ref('password')], 'Không được sử dụng lại mật khẩu cũ'),
  confirm_password: validateConfirmPW('new_password')
})
export type UserSchema = yup.InferType<typeof userSchema>
export type Schema = yup.InferType<typeof schema>
