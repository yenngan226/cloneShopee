import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'

import { useMutation } from '@tanstack/react-query'
import { authApi } from 'src/api/api/auth.api'
import Input from 'src/components/Input'
import { ErrorResponse } from 'src/types/utils.type'
import { isAxiosUnprocessableEntity } from 'src/utils/checkType.utils'

import { useContext } from 'react'
import { Appcontext } from 'src/contexts/app.context'
import LoadingButton from 'src/components/LoadingButton'
import schema, { Schema } from 'src/utils/rules'
import { useTranslation } from 'react-i18next'

type LoginType = Pick<Schema, 'email' | 'password'>
export default function Login() {
  const { t } = useTranslation(['header'])
  const navigate = useNavigate()
  const { setIsAuthenticated, setProfile } = useContext(Appcontext)
  const loginSchema = schema.pick(['email', 'password'])
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginType>({
    resolver: yupResolver(loginSchema)
  })

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
              className='rounded bg-white p-6 shadow-sm md:p-10'
              onSubmit={onSubmit}
              noValidate
            >
              <div className='text-2xl'>{t('header:login')}</div>

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
                  {t('header:login')}
                </LoadingButton>
              </div>
              <div className='mt-8 flex justify-center'>
                <div className='mr-2 text-slate-400'>
                  {t('header:noAccount')}
                </div>
                <Link to='/register' className='text-red-600'>
                  {t('header:register')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
