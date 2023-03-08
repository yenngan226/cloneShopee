import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext
} from 'react-hook-form'
import { toast } from 'react-toastify'
import { userApi } from 'src/api/api/user.api'
import DateSelect from 'src/components/DateSelect'
import Input from 'src/components/Input'
import InputFile from 'src/components/InputFile'
import InputNumber from 'src/components/InputNumber'
import LoadingButton from 'src/components/LoadingButton'
import { config } from 'src/constant/config'
import { Appcontext } from 'src/contexts/app.context'
import { User } from 'src/types/user.type'
import { ErrorResponse } from 'src/types/utils.type'
import { saveProfileToLS } from 'src/utils/auth.utils'
import { isAxiosUnprocessableEntity } from 'src/utils/checkType.utils'
import { getAvatarUrl } from 'src/utils/formatNumber.utils'
import { userSchema, UserSchema } from 'src/utils/rules'

type FormData = Pick<
  UserSchema,
  'name' | 'avatar' | 'date_of_birth' | 'address' | 'phone'
>
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth: string
}
const profileSchema = userSchema.pick([
  'name',
  'avatar',
  'date_of_birth',
  'address',
  'phone'
])
function Infor() {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<FormData>()
  return (
    <>
      <div className='mt-6 flex flex-wrap items-start'>
        <div className='w-[25%] truncate pt-3 text-right capitalize md:w-[20%]'>
          Tên
        </div>
        <div className='w-[75%] pl-5  md:w-[80%]'>
          <Input
            register={register}
            name='name'
            placeholder='Tên'
            errorMessage={errors.name?.message}
            classNameInput='w-full rounded-md border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
          />
        </div>
      </div>
      <div className=' flex flex-wrap items-start'>
        <div className='w-[25%] truncate pt-3 text-right capitalize md:w-[20%]'>
          Số điện thoại
        </div>
        <div className='w-[75%] pl-5 md:w-[80%]'>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => {
              return (
                <InputNumber
                  {...field}
                  name='phone'
                  placeholder='Số điện thoại'
                  errorMessage={errors.phone?.message}
                  classNameInput='w-full rounded-md border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
                  onChange={field.onChange}
                />
              )
            }}
          />
        </div>
      </div>
      <div className=' flex flex-wrap items-start'>
        <div className='w-[25%] truncate pt-3 text-right capitalize md:w-[20%]'>
          Địa chỉ
        </div>
        <div className='w-[75%] pl-5 md:w-[80%]'>
          <Input
            register={register}
            name='address'
            placeholder='Địa chỉ'
            errorMessage={errors.address?.message}
            classNameInput='w-full rounded-md border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
          />
        </div>
      </div>
    </>
  )
}
export default function Profile() {
  const { setProfile } = useContext(Appcontext)
  const [avatarFile, setAvatarFile] = useState<File>()
  const userDefaulValue = {
    name: '',
    avatar: '',
    date_of_birth: new Date(1990, 0, 1),
    address: '',
    phone: ''
  }
  const methods = useForm<FormData>({
    defaultValues: userDefaulValue,
    resolver: yupResolver(profileSchema)
  })
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    getValues,
    formState: { errors }
  } = methods
  const previewURL = useMemo(
    () => (avatarFile ? URL.createObjectURL(avatarFile) : ''),
    [avatarFile]
  )
  const formValues = getValues()
  const { data: userData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getUser
  })
  const updateProfileMutaion = useMutation({
    mutationFn: userApi.updateProfile
  })
  const profile = userData?.data.data
  const uploadAvatarMutation = useMutation(userApi.uploadAvatar)
  useEffect(() => {
    if (profile) {
      // setValue('name', profile.name)
      // setValue('phone', profile.phone)
      // setValue('address', profile.address)
      // setValue('avatar', profile.avatar)
      // setValue(
      //   'date_of_birth',
      //   profile.date_of_birth
      //     ? new Date(profile.date_of_birth)
      //     : new Date(1990, 0, 1)
      // )
      for (const key in formValues) {
        if (key !== 'date_of_birth') {
          setValue(
            key as keyof FormData,
            profile[key as keyof Omit<User, 'email' | '_id' | 'roles'>]
          )
        } else if (key === 'date_of_birth') {
          setValue(
            'date_of_birth',
            profile.date_of_birth
              ? new Date(profile.date_of_birth as string)
              : new Date(1990, 0, 1)
          )
        }
      }
    }
  }, [profile, setValue])
  const onSubmit = handleSubmit(async (data) => {
    const DOB = data?.date_of_birth
    const localISOTime =
      DOB &&
      new Date(DOB.getTime() - DOB.getTimezoneOffset() * 60000).toISOString()
    try {
      let avatarName = ''
      if (avatarFile) {
        const form = new FormData()
        form.append('image', avatarFile)
        const res = await uploadAvatarMutation.mutateAsync(form)
        avatarName = res.data.data
        setValue('avatar', avatarName)
      }
      const res = await updateProfileMutaion.mutateAsync({
        ...data,
        date_of_birth: localISOTime
      })
      setProfile(res.data.data)
      refetch()
      toast.success(res.data.message)
      saveProfileToLS(res.data.data)
    } catch (error) {
      if (isAxiosUnprocessableEntity<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'server'
            })
          })
        }
      }
    }
  })
  const handleChangeInputFile = (file: File) => {
    setAvatarFile(file)
  }
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
      <FormProvider {...methods}>
        <form
          className='mt-8 flex flex-col-reverse md:flex-row md:items-start'
          onSubmit={onSubmit}
        >
          <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
            <div className='flex flex-wrap items-start'>
              <div className='w-[25%]  truncate pt-3 text-right capitalize md:w-[20%]'>
                Email
              </div>
              <div className='w-[75%] pl-5 md:w-[80%]'>
                <div className='pt-3 text-gray-700'>{profile?.email}</div>
              </div>
            </div>
            <Infor />
            <div className=' flex flex-wrap items-start'>
              <div className='w-[25%] truncate pt-3 text-right capitalize md:w-[20%]'>
                Ngày sinh
              </div>
              <div className='w-[75%] pl-5 md:w-[80%]'>
                <Controller
                  control={control}
                  name='date_of_birth'
                  render={({ field }) => {
                    return (
                      <DateSelect
                        value={field.value}
                        errorMessage={errors.date_of_birth?.message}
                        onChange={field.onChange}
                      />
                    )
                  }}
                />

                <LoadingButton className='mt-3 flex h-8 items-center rounded-sm bg-orangeShopee px-3 text-center text-white hover:bg-orangeShopee/80'>
                  Cập nhật
                </LoadingButton>
              </div>
            </div>
          </div>
          <div className='mr:border-l-gray-200 flex justify-center md:w-72 md:border-l'>
            <div className='flex flex-col items-center'>
              <div className='my-5 h-24 w-24'>
                <img
                  src={previewURL ? previewURL : getAvatarUrl(profile?.avatar)}
                  alt=''
                  className='h-full w-full rounded-full object-cover'
                />
              </div>
              <InputFile onChangeInputFile={handleChangeInputFile} />
              <div className='mt-3 text-gray-400'>
                <div className=''>Kích thước file tối đa 1MB</div>
                <div className=''>Định dạng file: .JPEG,.PNG</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
