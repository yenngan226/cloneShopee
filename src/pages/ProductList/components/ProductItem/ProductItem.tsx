import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import path from 'src/constant/path'
import ProductRating from 'src/pages/ProductRating'
import { Product } from 'src/types/product.type'
import {
  currencyExchange,
  formatNumberToSocialType,
  generateURL
} from 'src/utils/formatNumber.utils'

type Props = {
  product: Product
}

export default function ProductItem({ product }: Props) {
  const { t } = useTranslation(['product'])
  return (
    <Link to={`${path.home}${generateURL(product.name, product._id)}`}>
      <div className='hover:shadown-md overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.1rem]'>
        <div className='relative w-full pt-[100%]'>
          <img
            src={product.image}
            alt=''
            className='absolute top-0 left-0 h-full w-full object-cover'
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='min-h-[2rem] text-xs line-clamp-2'>
            {product.name}
          </div>
          <div className='mt-3 flex items-center'>
            <div className='flex max-w-[50%] items-center truncate text-gray-500 line-through'>
              <div className='text-sm'>đ</div>
              <div className='text-xs'>
                {currencyExchange(product.price_before_discount)}
              </div>
            </div>
            <div className='ml-1 flex items-center truncate text-orange-500'>
              <div className='text-sm'>đ</div>
              <div className='text-sm'>{currencyExchange(product.price)}</div>
            </div>
          </div>
          <div className='mt-3 flex min-h-[1rem] items-center justify-end'>
            <div className='flex items-center '>
              <ProductRating rating={product.rating} />
              <div className='ml-2 text-xs'>
                <span>{formatNumberToSocialType(product.sold)}</span>
                <span className='ml-1'>{t('product:sold')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
