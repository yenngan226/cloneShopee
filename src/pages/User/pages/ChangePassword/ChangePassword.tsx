import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { userApi } from 'src/api/api/user.api'
import Input from 'src/components/Input'
import LoadingButton from 'src/components/LoadingButton'
import { ErrorResponse } from 'src/types/utils.type'
import { isAxiosUnprocessableEntity } from 'src/utils/checkType.utils'
import { userSchema, UserSchema } from 'src/utils/rules'

type FormData = Pick<
  UserSchema,
  'password' | 'new_password' | 'confirm_password'
>
const passwordSchema = userSchema.pick([
  'password',
  'new_password',
  'confirm_password'
])
export default function ChangePassword() {
  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    reset
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(passwordSchema)
  })
  const updateProfileMutaion = useMutation(userApi.updateProfile)
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutaion.mutateAsync(
        omit(data, ['confirm_password'])
      )
      toast.success(res.data.message)
      reset()
    } catch (error) {
      if (isAxiosUnprocessableEntity<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof Omit<FormData, 'confirm_password'>, {
              message:
                formError[key as keyof Omit<FormData, 'confirm_password'>],
              type: 'server'
            })
          })
        }
      }
    }
  })
  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='capitialize text-lg font-medium text-gray-900'>
          Hồ sơ của tôi
        </h1>
        <div className='mt-1 text-sm text-gray-700'>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
      </div>

      <form className='mt-8 max-w-2xl' onSubmit={onSubmit} noValidate>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='mt-6 flex flex-wrap items-start '>
            <div className='w-[25%] truncate pt-1 text-right capitalize md:w-[20%]'>
              Mật khẩu hiện tại
            </div>
            <div className='w-[75%] pl-5  md:w-[80%]'>
              <Input
                type='password'
                register={register}
                name='password'
                placeholder='Mật khẩu hiện tại'
                errorMessage={errors.password?.message}
                classNameInput='w-full rounded-md border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
              />
            </div>
          </div>
          <div className='mt-3 flex flex-wrap items-start '>
            <div className='w-[25%] truncate pt-1 text-right capitalize md:w-[20%]'>
              Mật khẩu mới
            </div>
            <div className='w-[75%] pl-5  md:w-[80%]'>
              <Input
                type='password'
                register={register}
                name='new_password'
                placeholder='Mật khẩu mới'
                errorMessage={errors.new_password?.message}
                classNameInput='w-full rounded-md border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
              />
            </div>
          </div>
          <div className='mt-3 flex flex-wrap items-start '>
            <div className='w-[25%] truncate pt-1 text-right capitalize md:w-[20%]'>
              Nhập lại mật khẩu
            </div>
            <div className='w-[75%] pl-5  md:w-[80%]'>
              <Input
                type='password'
                register={register}
                name='confirm_password'
                placeholder='Nhập lại mật khẩu'
                errorMessage={errors.confirm_password?.message}
                classNameInput='w-full rounded-md border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
              />
            </div>
          </div>
          <div className=' flex flex-wrap items-start '>
            <LoadingButton className='mt-3 flex h-8 items-center rounded-sm bg-orangeShopee px-3 text-center text-white hover:bg-orangeShopee/80'>
              Cập nhật
            </LoadingButton>
          </div>
        </div>
      </form>
    </div>
  )
}
