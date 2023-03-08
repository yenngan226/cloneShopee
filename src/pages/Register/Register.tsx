import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import omit from 'lodash/omit'
import { schema, Schema } from 'src/utils/rules'
import { useMutation } from '@tanstack/react-query'
import { authApi } from 'src/api/api/auth.api'
import { isAxiosUnprocessableEntity } from 'src/utils/checkType.utils'
import { ErrorResponse } from 'src/types/utils.type'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { Appcontext } from 'src/contexts/app.context'
import LoadingButton from 'src/components/LoadingButton'
import path from 'src/constant/path'
import { useTranslation } from 'react-i18next'

type RegisterType = Omit<Schema, 'price_max' | 'price_min'>
export default function Register() {
  const { t } = useTranslation(['header'])
  const navigate = useNavigate()
  const { setIsAuthenticated, setProfile } = useContext(Appcontext)
  const RegisterSchema = schema.pick(['confirm_password', 'email', 'password'])
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    watch
  } = useForm<RegisterType>({
    resolver: yupResolver(RegisterSchema)
  })
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<RegisterType, 'confirm_password'>) =>
      authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])

    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        toast.success(data.data.message)
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (
          isAxiosUnprocessableEntity<
            ErrorResponse<Omit<RegisterType, 'confirm_password'>>
          >(error)
        ) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<RegisterType, 'confirm_password'>, {
                message:
                  formError[
                    key as keyof Omit<RegisterType, 'confirm_password'>
                  ],
                type: 'server'
              })
            })
          }
        }
      }
    })
  })
  //xem value mỗi lần nhập
  const valueWatch = watch()
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
              <div className='text-2xl'>{t('header:register')}</div>
              <Input
                register={register}
                name='email'
                placeholder={t('header:user')}
                type={'email'}
                className='mt-8'
                errorMessage={errors.email?.message}
              />
              <Input
                register={register}
                name='password'
                placeholder={t('header:password')}
                type={'password'}
                className='mt-2'
                errorMessage={errors.password?.message}
                autoComplete='on'
              />
              <Input
                register={register}
                name='confirm_password'
                placeholder={t('header:confirm')}
                type={'password'}
                className='mt-2'
                errorMessage={errors.confirm_password?.message}
                autoComplete='on'
              />
              <div className='mt-3'>
                <LoadingButton
                  type='submit'
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                  className='flex w-full items-center justify-center bg-orangeShopee py-3 px-2 uppercase text-white hover:bg-red-600'
                >
                  {t('header:register')}
                </LoadingButton>
              </div>
              <div className='mt-8 flex justify-center'>
                <div className='mr-2 text-slate-400'>
                  {t('header:haveAccount')}
                </div>
                <Link to={path.login} className='text-red-600'>
                  {t('header:login')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
