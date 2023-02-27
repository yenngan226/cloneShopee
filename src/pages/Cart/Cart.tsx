import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import purchaseApi from 'src/api/api/purchase.api'
import LoadingButton from 'src/components/LoadingButton'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constant/path'
import { purchasesStatus } from 'src/constant/purchase'
import { Purchase } from 'src/types/purchase.type'
import {
  currencyExchange,
  formatNumberToSocialType,
  generateURL
} from 'src/utils/formatNumber.utils'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { toast } from 'react-toastify'
import { Appcontext } from 'src/contexts/app.context'
import noPurchaseImg from '../../assets/img/nopurchase.png'

export default function Cart() {
  const location = useLocation()
  const { extendedPurchases, setExtendedPurchases } = useContext(Appcontext)
  const purchaseIdFromLocation = (
    location.state as { purchaseId: string } | null
  )?.purchaseId

  const isAllChecked = useMemo(() => {
    return extendedPurchases.length > 0
      ? extendedPurchases.every((purchases) => {
          return purchases.checked === true
        })
      : false
  }, [extendedPurchases])
  const checkedPurchases = useMemo(() => {
    return extendedPurchases.filter((purchase) => purchase.checked)
  }, [extendedPurchases])
  const checkedPurchasesCount = checkedPurchases.length
  const totalCheckedPurchaseAmount = useMemo(() => {
    return checkedPurchases.reduce((result, curr) => {
      return result + curr.buy_count * curr.price
    }, 0)
  }, [checkedPurchases])
  const totalCheckedPurchaseDiscountAmount = useMemo(() => {
    return checkedPurchases.reduce((result, curr) => {
      return result + curr.buy_count * (curr.price_before_discount - curr.price)
    }, 0)
  }, [checkedPurchases])

  //React Query
  const { data: purchasesInCart, refetch: refetchCart } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () =>
      purchaseApi.getPurchasesList({ status: purchasesStatus.inCart })
  })
  const purchasesInCartProducts = purchasesInCart?.data.data

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetchCart()
    }
  })

  const buyProductMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetchCart()
      toast.success(data.data.message, {
        position: 'top-right',
        autoClose: 1000
      })
    }
  })
  const deleteProductMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetchCart()
    }
  })

  //UseEffect
  useEffect(() => {
    purchasesInCartProducts &&
      setExtendedPurchases((prev) => {
        const extendedPurchasesObject = keyBy(prev, '_id')
        return purchasesInCartProducts?.map((purchase) => {
          const isChoosenPurchaseFromLocation =
            purchaseIdFromLocation === purchase._id
          return (
            {
              ...purchase,
              disable: false,
              checked:
                isChoosenPurchaseFromLocation ||
                Boolean(extendedPurchasesObject[purchase._id]?.checked)
            } || []
          )
        })
      })
  }, [purchasesInCartProducts, purchaseIdFromLocation])

  // F5 lại sẽ xóa state trong location
  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  //Function
  const handleCheck =
    (purchaseIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].checked = e.target.checked
        })
      )
    }

  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => {
        return { ...purchase, checked: !isAllChecked }
      })
    )
  }
  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }
  const handleQuantity = (
    purchaseIndex: number,
    value: number,
    enable: boolean
  ) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disable = true
        })
      )
      updatePurchaseMutation.mutate({
        product_id: purchase.product._id,
        buy_count: value
      })
    }
  }
  const handleDelete = (purchaseId: string) => () => {
    deleteProductMutation.mutate([purchaseId])
  }
  const handleDeleteMultiplePurchase = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    deleteProductMutation.mutate(purchaseIds)
  }
  const handleBuyProducts = () => {
    if (checkedPurchases.length > 0) {
      const data = checkedPurchases.map((purchase) => {
        return {
          product_id: purchase.product._id,
          buy_count: purchase.buy_count
        }
      })
      buyProductMutation.mutate(data)
    }
  }
  return (
    <div className='bg-gray-100 py-8 md:py-16'>
      <div className='px-3 md:container'>
        {extendedPurchases.length > 0 ? (
          <>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6 '>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 cursor-pointer accent-orangeShopee'
                          checked={isAllChecked}
                          onChange={handleCheckAll}
                        />
                      </div>
                      <div className='flex-grow text-black'>Sản phẩm</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5'>
                      <div className='col-span-2 text-center'>Đơn giá</div>
                      <div className='col-span-1 text-center'>Số lượng</div>
                      <div className='col-span-1 text-center'>Số tiền</div>
                      <div className='col-span-1 text-center'>Thao tác</div>
                    </div>
                  </div>
                </div>
                <div className='my-4 rounded-sm bg-white'>
                  {extendedPurchases?.map((purchase, index) => {
                    return (
                      <div
                        key={index}
                        className='grid grid-cols-12 items-center rounded-sm border-b-2 border-gray-100 bg-white py-5 px-9 text-sm capitalize  shadow'
                      >
                        <div className='col-span-6 '>
                          <div className='flex items-center'>
                            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                              <input
                                type='checkbox'
                                className='h-5 w-5 cursor-pointer accent-orangeShopee'
                                checked={purchase.checked}
                                onChange={handleCheck(index)}
                              />
                            </div>
                            <div className='flex items-center'>
                              <Link
                                to={`${path.home}${generateURL(
                                  purchase.product.name,
                                  purchase.product._id
                                )}`}
                                className='h-20 w-20 flex-shrink-0 '
                                title={purchase.product.name}
                              >
                                <img
                                  className='h-full w-full object-cover'
                                  src={purchase.product.image}
                                  alt={purchase.product.name}
                                />
                              </Link>
                              <div className='flex-grow px-2 pt-1 pb-2'>
                                <Link
                                  to={`${path.home}${generateURL(
                                    purchase.product.name,
                                    purchase.product._id
                                  )}`}
                                  className='line-clamp-2'
                                >
                                  {purchase.product.name}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-span-6'>
                          <div className='grid grid-cols-5'>
                            <div className='col-span-2 flex items-center justify-center'>
                              <span className='mr-1 text-xs lowercase text-gray-500 line-through'>{`đ${currencyExchange(
                                purchase.price_before_discount
                              )}`}</span>
                              <span className='lowercase'>{`đ${currencyExchange(
                                purchase.price
                              )}`}</span>
                            </div>
                            <div className='col-span-1 text-center'>
                              <QuantityController
                                classNameWrapper='flex items-center'
                                max={purchase.product.quantity}
                                value={purchase.buy_count}
                                onIncrease={(value) => {
                                  handleQuantity(
                                    index,
                                    value,
                                    value <= purchase.product.quantity
                                  )
                                }}
                                onDecrease={(value) => {
                                  handleQuantity(index, value, value >= 1)
                                }}
                                disabled={purchase.disable}
                                onFocusOut={(value) => {
                                  handleQuantity(
                                    index,
                                    value,
                                    value >= 1 &&
                                      value <= purchase.product.quantity &&
                                      value !==
                                        (purchasesInCartProducts as Purchase[])[
                                          index
                                        ].buy_count
                                  )
                                }}
                                onType={handleTypeQuantity(index)}
                              />
                            </div>
                            <div className='col-span-1 flex items-center justify-center lowercase text-orangeShopee'>
                              {`đ${currencyExchange(
                                purchase.buy_count * purchase.price
                              )}`}
                            </div>
                            <div className='col-span-1 flex items-center justify-center'>
                              <button
                                className='hover:text-orangeShopee'
                                onClick={handleDelete(purchase._id)}
                              >
                                Xoá
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className='sticky bottom-0 z-10 my-4 items-center rounded-sm bg-white py-5 pl-9 pr-5 sm:flex'>
              <div className='flex flex-shrink-0 items-center justify-start pr-3 md:justify-center'>
                <input
                  type='checkbox'
                  name=''
                  id=''
                  className='h-5 w-5 accent-orangeShopee'
                  checked={isAllChecked}
                  onChange={handleCheckAll}
                />
                <button
                  className='mx-1 hover:text-orangeShopee lg:mx-3'
                  onClick={handleCheckAll}
                >
                  {`Chọn tất cả(${extendedPurchases.length})`}
                </button>
                <button
                  className='mx-3 hover:text-orangeShopee'
                  onClick={handleDeleteMultiplePurchase}
                >
                  Xóa
                </button>
              </div>
              <div className='ml-auto mt-3 flex items-center justify-between md:mt-0'>
                <div>
                  <div className='flex items-center justify-between sm:justify-end'>
                    <div className='w-full items-center md:flex'>
                      <div>{`Tổng thanh toán`}</div>
                      <div>{`(${checkedPurchasesCount} Sản phẩm)`}</div>
                    </div>
                    <div className='ml-2 text-2xl text-orange-500'>{`đ${currencyExchange(
                      totalCheckedPurchaseAmount
                    )}`}</div>
                  </div>
                  <div className='flex items-center justify-end text-sm'>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='ml-2 text-orange-500'>{`đ${formatNumberToSocialType(
                      totalCheckedPurchaseDiscountAmount
                    )}`}</div>
                  </div>
                </div>
              </div>
              <LoadingButton
                onClick={handleBuyProducts}
                className='w-30 ml-auto mt-3 flex h-12 items-center justify-center bg-orangeShopee p-3 uppercase text-white hover:bg-red-600 md:mt-0 md:ml-3'
                disabled={buyProductMutation.isLoading}
              >
                Mua hàng
              </LoadingButton>
            </div>
          </>
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <img
              src={noPurchaseImg}
              alt=''
              className='h-[12rem] w-[12rem] object-cover'
            />
            <div className='mt-2 text-gray-500'>Giỏ hàng của bạn còn trống</div>
            <Link
              to={path.home}
              className='mt-5 rounded-sm bg-orangeShopee py-2 px-3 uppercase text-white hover:bg-orangeShopee/80'
            >
              Mua hàng
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
