import classNames from 'classnames'
import omit from 'lodash/omit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'

import path from 'src/constant/path'
import { sortBy, order as orderConstant } from 'src/constant/products'
import { ProductListConfig, QueryConfig } from 'src/types/product.type'

type Props = {
  queryConfig: QueryConfig
  pageSize: number
}
export default function SortProductList({ queryConfig, pageSize }: Props) {
  const { t } = useTranslation(['home'])
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const page = Number(queryConfig.page)
  const navigate = useNavigate()

  const isActiveSortBy = (
    sortByValue: Exclude<ProductListConfig['sort_by'], undefined>
  ) => {
    return sort_by === sortByValue
  }

  const handleSort = (
    sortByValue: Exclude<ProductListConfig['sort_by'], undefined>
  ) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }
  const handlePriceOrder = (
    orderValue: Exclude<ProductListConfig['order'], undefined>
  ) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }
  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-col flex-wrap items-end justify-between gap-2 lg:flex-row'>
        <div className='flex flex-wrap items-center gap-2'>
          <div className=''>{t('home:sort.sortBy')}</div>
          <button
            className={classNames('h-8 rounded-sm  px-4 text-sm capitalize', {
              'bg-orangeShopee text-white hover:bg-orangeShopee/80':
                isActiveSortBy(sortBy.view),
              'text-back bg-white hover:bg-white/80': !isActiveSortBy(
                sortBy.view
              )
            })}
            onClick={() => {
              handleSort(sortBy.view)
            }}
          >
            {t('home:sort.popular')}
          </button>
          <button
            className={classNames('h-8 rounded-sm  px-4 text-sm capitalize', {
              'bg-orangeShopee text-white hover:bg-orangeShopee/80':
                isActiveSortBy(sortBy.createdAt),
              'text-back bg-white hover:bg-white/80': !isActiveSortBy(
                sortBy.createdAt
              )
            })}
            onClick={() => {
              handleSort(sortBy.createdAt)
            }}
          >
            {t('home:sort.latest')}
          </button>
          <button
            className={classNames('h-8 rounded-sm  px-4 text-sm capitalize', {
              'bg-orangeShopee text-white hover:bg-orangeShopee/80':
                isActiveSortBy(sortBy.sold),
              'text-back bg-white hover:bg-white/80': !isActiveSortBy(
                sortBy.sold
              )
            })}
            onClick={() => {
              handleSort(sortBy.sold)
            }}
          >
            {t('home:sort.sold')}
          </button>
          <select
            name='cars'
            id='cars'
            className={classNames(
              'h-8 cursor-pointer px-2 capitalize outline-none',
              {
                'bg-orangeShopee text-white hover:bg-orangeShopee/80':
                  isActiveSortBy(sortBy.price),
                'text-back bg-white hover:bg-white/80': !isActiveSortBy(
                  sortBy.price
                )
              }
            )}
            value={order || ''}
            onChange={(e) => handlePriceOrder(e.target.value as 'desc' | 'asc')}
          >
            <option value='' disabled hidden>
              {t('home:sort.price')}
            </option>
            <option value={orderConstant.asc} className='bg-white text-black'>
              {t('home:sort.lowToHigh')}
            </option>
            <option value={orderConstant.desc} className='bg-white text-black'>
              {t('home:sort.highToLow')}
            </option>
          </select>
        </div>
        <div className='flex items-center'>
          <div className=''>
            <span className='text-orangeShopee'>{page}</span>
            <span className=''>/{pageSize}</span>
          </div>
          <div className='ml-2'>
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  page: (page - 1).toString()
                }).toString()
              }}
            >
              <button
                className={classNames(
                  'h-8 rounded-tl-sm rounded-bl-sm  px-2 shadow-sm hover:bg-slate-100',
                  {
                    'pointer-events-none cursor-not-allowed': page === 1,
                    'cursor-pointer bg-white': page !== 1
                  }
                )}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='h-4 w-4'
                >
                  <path
                    fillRule='evenodd'
                    d='M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </Link>
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  page: (page + 1).toString()
                }).toString()
              }}
            >
              <button
                className={classNames(
                  'h-8 rounded-tl-sm rounded-bl-sm  px-2 shadow-sm hover:bg-slate-100',
                  {
                    'pointer-events-none cursor-not-allowed': page === pageSize,
                    'cursor-pointer bg-white': page !== pageSize
                  }
                )}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='h-4 w-4'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
