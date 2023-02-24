import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { omit } from 'lodash'
import { Controller, useForm } from 'react-hook-form'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import InputNumber from 'src/components/InputNumber'
import LoadingButton from 'src/components/LoadingButton'
import path from 'src/constant/path'
import { Category } from 'src/types/category.type'
import { NoUndefinedField } from 'src/types/utils.type'
import schema, { Schema } from 'src/utils/rules'
import { QueryConfig } from '../../ProductList'
import RatingStar from '../RatingStar'

type Props = {
  categories: Category[]
  queryConfig: QueryConfig
}
type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>

const priceSchema = schema.pick(['price_max', 'price_min'])
export default function AsideFilter({ categories, queryConfig }: Props) {
  const navigate = useNavigate()
  const { category, price_max, price_min } = queryConfig
  const priceDefaultValue = {
    price_min: price_min,
    price_max: price_max
  }
  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: priceDefaultValue,
    resolver: yupResolver(priceSchema)
  })

  const onSubmit = handleSubmit(
    (data) => {
      navigate({
        pathname: path.home,
        search: createSearchParams({
          ...queryConfig,
          price_max: data.price_max,
          price_min: data.price_min
        }).toString()
      })
    },
    (err) => {
      err.price_max?.ref?.focus
    }
  )
  const handleClearFilter = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(queryConfig, [
          'price_min',
          'price_max',
          'category',
          'rating_filter'
        ])
      ).toString()
    })
    setValue('price_max', '', { shouldDirty: true })
    setValue('price_min', '', { shouldDirty: true })
  }
  return (
    <div className='py-4'>
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold', {
          'text-orangeShopee': !category
        })}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='{1.5}'
          stroke='currentColor'
          className='mr-2 h-6 w-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
          />
        </svg>
        Tất cả danh mục
      </Link>
      <div className='my-4 h-[1px] bg-gray-400'></div>
      <ul>
        {categories.map((categoryItem, index) => {
          const isActive = category === categoryItem._id
          return (
            <li className='py-2 pl-2 ' key={index}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={classNames(' relative flex items-center ', {
                  'font-semibold text-orangeShopee': isActive
                })}
              >
                {isActive && (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    className='absolute left-[-15px] h-3 w-3 fill-orangeShopee'
                  >
                    <path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' />
                  </svg>
                )}
                {categoryItem.name}
              </Link>
            </li>
          )
        })}
      </ul>
      <Link to={path.home} className='mt-6 flex items-center  font-bold'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='mr-2 h-5 w-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z'
          />
        </svg>
        BỘ LỌC TÌM KIẾM
      </Link>
      <div className='my-4 h-[1px] bg-gray-400'></div>
      <div className='py-2 pl-2'>
        <div>Khoảng giá</div>
        <form action='' className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-center justify-between'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    {...field}
                    type='text'
                    className='w-10 grow'
                    name='from'
                    classNameInput='px-1 w-full text-sm outline-none border border-gray-300 focus:border-gray-500'
                    placeholder='đ Từ'
                    onChange={(e) => {
                      field.onChange(e)
                      trigger('price_max')
                    }}
                    classNameError='hidden'
                  />
                )
              }}
            />

            <div className='mx-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    {...field}
                    type='text'
                    className='w-10 grow'
                    name='to'
                    classNameInput='px-1 w-full text-sm outline-none border border-gray-300 focus:border-gray-500'
                    placeholder='đ Đến'
                    onChange={(e) => {
                      field.onChange(e)
                      trigger('price_min')
                    }}
                    //truyền thêm ref để có những method như focus,...

                    classNameError='hidden'
                  />
                )
              }}
            />
          </div>
          {/* Cơ chế của react hook form là chỉ set lại error chỗ nào có onchange thôi */}
          <div className='mb-1 min-h-[1.25rem] text-sm text-red-600'>
            {errors.price_min?.message}
          </div>
          <LoadingButton className='w-full rounded-md bg-orangeShopee p-2 uppercase text-white transition duration-200 hover:bg-orange-700'>
            Áp dụng
          </LoadingButton>
        </form>
      </div>
      <div className='my-4 h-[1px] bg-gray-400'></div>
      <div className='text-sm'>Đánh giá</div>
      <RatingStar queryConfig={queryConfig} />
      <LoadingButton
        onClick={handleClearFilter}
        className='w-full rounded-md bg-orangeShopee p-2 uppercase text-white transition duration-200 hover:bg-orange-700'
      >
        Xóa tất cả
      </LoadingButton>
    </div>
  )
}

// Rule Validate
// -Nếu có price_min và price_max thì price_max phải >= price_min
// -Hoặc chỉ có 1 trong 2
