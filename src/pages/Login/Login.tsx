import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema, LoginType } from 'src/utils/rules'
import { useMutation } from '@tanstack/react-query'
import { authApi } from 'src/api/api/auth.api'
import Input from 'src/components/Input'
import { ErrorResponse } from 'src/types/utils.type'
import { isAxiosUnprocessableEntity } from 'src/utils/checkType.utils'
import { saveAccessTokenToLS } from 'src/utils/auth.utils'
import { useContext } from 'react'
import { Appcontext } from 'src/contexts/app.context'
import LoadingButton from 'src/components/LoadingButton'

export default function Login() {
  const navigate = useNavigate()
  const { setIsAuthenticated, setProfile } = useContext(Appcontext)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginType>({ resolver: yupResolver(loginSchema) })

  const loginAccountMutation = useMutation({
    mutationFn: (body: LoginType) => authApi.loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntity<ErrorResponse<LoginType>>(error)) {
          console.log(error)

          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof LoginType, {
                message: formError[key as keyof LoginType],
                type: 'server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orangeShopee'>
      <div className='container'>
        <div className='grid grid-cols-1 py-10 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form
              className='rounded bg-white p-10 shadow-sm'
              onSubmit={onSubmit}
              noValidate
            >
              <div className='text-2xl'>Đăng nhập</div>

              <Input
                register={register}
                name='email'
                placeholder='Email/Số điện thoại'
                type={'email'}
                className='mt-8'
                errorMessage={errors.email?.message}
              />
              <Input
                register={register}
                name='password'
                placeholder='Mật khẩu'
                type={'password'}
                className='mt-2'
                errorMessage={errors.password?.message}
                autoComplete='on'
              />
              <div className='mt-3'>
                <LoadingButton
                  type='submit'
                  isLoading={loginAccountMutation.isLoading}
                  disabled={loginAccountMutation.isLoading}
                  className='flex w-full items-center justify-center bg-orangeShopee py-3 px-2 uppercase text-white hover:bg-red-600'
                >
                  Đăng nhập
                </LoadingButton>
              </div>
              <div className='mt-8 flex justify-center'>
                <div className='mr-2 text-slate-400'>
                  Bạn chưa có tài khoản?
                </div>
                <Link to='/register' className='text-red-600'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
