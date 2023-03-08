import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { createSearchParams, Link } from 'react-router-dom'
import purchaseApi from 'src/api/api/purchase.api'
import path from 'src/constant/path'
import { purchasesStatus } from 'src/constant/purchase'
import useQueryString from 'src/hooks/useQueryString'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { currencyExchange, generateURL } from 'src/utils/formatNumber.utils'

export default function PurchasesHistory() {
  const { t } = useTranslation(['product', 'header'])
  const queryParams: { status?: string } = useQueryString()
  const status = Number(queryParams.status) || purchasesStatus.all
  const purchaseQuery = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => {
      return purchaseApi.getPurchasesList({
        status: status as PurchaseListStatus
      })
    }
  })
  const purchaseList = purchaseQuery.data?.data.data
  console.log(purchaseList)
  const tabList = [
    { name: 'Tất cả', status: purchasesStatus.all },
    { name: 'Chờ xác nhận', status: purchasesStatus.waitForConfirmation },
    { name: 'Chờ thanh toán', status: purchasesStatus.waitForBuying },
    { name: 'Đang giao', status: purchasesStatus.inProgress },
    { name: 'Hoàn thành', status: purchasesStatus.delivered },
    { name: 'Đã hủy', status: purchasesStatus.cancelled }
  ]

  return (
    <div className='overflow-x-auto'>
      <div className='min-w-[800px]'>
        <div className='sticky top-0 flex bg-white'>
          {tabList.map((tab) => {
            const name = `${tab.name}`
            return (
              <Link
                className={classNames(
                  'flex-grow cursor-pointer border-b-2 py-3 text-center',
                  {
                    'border-b-orangeShopee text-orangeShopee':
                      status === tab.status,
                    'text-gray-500': status !== tab.status
                  }
                )}
                key={tab.status}
                to={{
                  pathname: path.purchasesHistory,
                  search: createSearchParams({
                    status: String(tab.status)
                  }).toString()
                }}
              >
                {t(name as any)}
              </Link>
            )
          })}
        </div>
        <div className=''>
          {purchaseList &&
            purchaseList.map((purchase) => {
              return (
                <Link
                  to={`/${generateURL(
                    purchase.product.name,
                    purchase.product._id
                  )}`}
                  key={purchase._id}
                  className='mt-3 flex cursor-pointer bg-white py-6 px-6 hover:shadow-md'
                >
                  <div className='h-16 w-16 flex-shrink-0'>
                    <img
                      className='h-full w-full object-cover'
                      src={purchase.product.image}
                      alt={purchase.product.name}
                    />
                  </div>
                  <div className='ml-6 flex-grow overflow-hidden'>
                    <div className='truncate'>{purchase.product.name}</div>
                    <div className=''>{`x${purchase.buy_count}`}</div>
                  </div>
                  <div className='ml-6 flex flex-shrink-0 flex-col items-end justify-between'>
                    <div className=''>
                      <span className='mr-1 text-xs lowercase text-gray-500 line-through'>{`đ${currencyExchange(
                        purchase.price_before_discount
                      )}`}</span>
                      <span className='lowercase'>{`đ${currencyExchange(
                        purchase.price
                      )}`}</span>
                    </div>
                    <div className='text-xl text-orangeShopee'>{`${t(
                      'product:total'
                    )}: ${currencyExchange(
                      purchase.price * purchase.buy_count
                    )}đ`}</div>
                  </div>
                </Link>
              )
            })}
          {!purchaseList ||
            (purchaseList.length === 0 && (
              <div className='bg-white py-20 text-center'>
                {t('product:noPurchase')}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
