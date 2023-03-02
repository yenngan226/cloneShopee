import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { productApi } from 'src/api/api/product.api'
import purchaseApi from 'src/api/api/purchase.api'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constant/path'
import { purchasesStatus } from 'src/constant/purchase'
import { Product, ProductListConfig } from 'src/types/product.type'
import {
  currencyExchange,
  formatNumberToSocialType,
  getIdFromURL,
  rateSale
} from 'src/utils/formatNumber.utils'
import ProductItem from '../ProductList/components/ProductItem'
import ProductRating from '../ProductRating'
import { useTranslation } from 'react-i18next'

export default function ProductDetail() {
  const navigate = useNavigate()
  const { nameID } = useParams()
  const queryClient = useQueryClient()
  const { t } = useTranslation(['product', 'header'])
  const id = getIdFromURL(nameID as string)
  const [currentIndexImg, setCurrentIndexImg] = useState<number[]>([0, 5])
  const [activeImg, setActiveImg] = useState<string>('')
  const [buyCount, setBuyCount] = useState<number>(1)

  const activeImgRef = useRef<HTMLImageElement>(null)

  const productDetailQuery = useQuery({
    queryKey: ['product', id],
    queryFn: () => {
      return productApi.getProductDetail(id as string)
    },
    onError: () => {
      navigate({
        pathname: '/1/notFound'
      })
    }
  })
  const productData = productDetailQuery.data?.data.data

  const addToCartMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }) =>
      purchaseApi.addToCart(body),
    onSuccess: (data) => {
      console.log(123456)

      queryClient.invalidateQueries({
        queryKey: ['purchases', { status: purchasesStatus.inCart }]
      })
      toast.success(data.data.message, {
        autoClose: 1000
      })
    },
    onError: (error) => {
      navigate({
        pathname: path.login
      })
    }
  })

  const queryConfig: ProductListConfig = {
    page: '1',
    category: productData?.category._id
  }
  const { data: sameCateProduct } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProduct(queryConfig)
    },
    enabled: productData ? true : false,
    staleTime: 20000
  })

  useEffect(() => {
    if (productData && productData.images.length !== 0) {
      setActiveImg(productData.images[0])
    }
  }, [productData])

  const currentImages = useMemo(() => {
    return productData ? productData?.images.slice(...currentIndexImg) : []
  }, [productData, currentIndexImg])
  const handleMouseEnterImg = (img: string) => {
    setActiveImg(img)
  }
  const handleNext = () => {
    if (currentIndexImg[1] < (productData as Product).images.length) {
      setCurrentIndexImg((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }
  const handlePrev = () => {
    if (currentIndexImg[0] > 0) {
      setCurrentIndexImg((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }
  const addToCart = () => {
    addToCartMutation.mutate({
      buy_count: buyCount,
      product_id: productData?._id as string
    })
  }
  const handleBuyNow = async () => {
    const res = await addToCartMutation.mutateAsync({
      buy_count: buyCount,
      product_id: productData?._id as string
    })
    const purchase = res.data.data
    navigate(path.cart, { state: { purchaseId: purchase._id } })
  }
  const handleZoom = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const img = activeImgRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = img
    // Trường hợp xử lý được bubble event
    const { offsetX, offsetY } = e.nativeEvent
    // Trường hợp không xử lý được bubble event
    // const offsetX = e.pageX -(rect.x + window.scrollX)
    // const offsetY = e.pageY -(rect.y + window.scrollY)
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    img.style.width = naturalWidth + 'px'
    img.style.height = naturalHeight + 'px'
    img.style.maxWidth = 'unset'
    img.style.top = top + 'px'
    img.style.left = left + 'px'
  }
  const handleRemoveZoom = () => {
    ;(activeImgRef.current as HTMLImageElement).removeAttribute('style')
  }
  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }
  if (!productData) return null

  return (
    <div className='bg-gray-200 py-4 md:px-6'>
      <div className='bg-white px-3 md:container'>
        <div className='grid-cols-12  gap-9 py-10 md:grid'>
          <div className='col-span-12 w-[360px] md:col-span-5 md:w-full'>
            <div
              className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
              onMouseMove={handleZoom}
              onMouseLeave={handleRemoveZoom}
            >
              <img
                src={activeImg}
                alt=''
                className='pointer-events-none absolute top-0 left-0 h-full w-full object-cover'
                ref={activeImgRef}
              />
            </div>
            <div className='relative mt-4 grid grid-cols-5 gap-1'>
              <button className='absolute left-0 top-1/2 z-10 h-8 w-5 -translate-y-1/2 bg-black/20 text-white'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                  onClick={handlePrev}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 19.5L8.25 12l7.5-7.5'
                  />
                </svg>
              </button>
              {currentImages.map((image, index) => {
                const isActive = image === activeImg
                return (
                  <div
                    className='relative w-full pt-[100%] shadow'
                    key={image}
                    onMouseEnter={() => {
                      handleMouseEnterImg(image)
                    }}
                  >
                    <img
                      src={image}
                      alt=''
                      className='absolute top-0 left-0 h-full w-full cursor-pointer object-cover'
                    />
                    {isActive && (
                      <div className='absolute inset-0 cursor-pointer border-2 border-orange-600'></div>
                    )}
                  </div>
                )
              })}
              <button className='absolute right-0 top-1/2 z-10 h-8 w-5 -translate-y-1/2 bg-black/20 text-white'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                  onClick={handleNext}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M8.25 4.5l7.5 7.5-7.5 7.5'
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className='md:col-span-7'>
            <h1 className='mt-2 text-xl font-medium uppercase line-clamp-2 md:mt-0'>
              {productData.name}
            </h1>
            <div className='mt-6 flex items-center'>
              <div className='flex items-center'>
                <span className='mr-1 border-b border-b-orange-500 text-orange-500'>
                  {productData.rating}
                </span>
                <ProductRating
                  rating={productData.rating}
                  activeClassName='h-3 w-3 fill-orange-600'
                />
              </div>
              <div className='mx-2 border-l border-l-slate-300 px-2'>
                <span className='mr-1'>
                  {formatNumberToSocialType(productData.sold)}
                </span>
                <span className='text-xs'>{t('product:sold')}</span>
              </div>
            </div>
            <div className='mt-6 flex items-center bg-gray-200 p-4'>
              <div className='flex items-center text-gray-500 line-through'>
                <span className='mr-1 self-start text-xs'>đ</span>
                <span>
                  {currencyExchange(productData.price_before_discount)}
                </span>
              </div>
              <div className='ml-3 flex items-center text-2xl font-medium text-orangeShopee'>
                <span className='mr-1 text-sm'>đ</span>
                <span>{currencyExchange(productData.price)}</span>
              </div>
              <div className='ml-3 bg-orange-500 px-1 text-xs font-semibold uppercase text-white'>
                {rateSale(productData.price_before_discount, productData.price)}
                <span className='ml-1 uppercase'>{t('product:off')}</span>
              </div>
            </div>
            <div className='mt-6 flex items-center'>
              <span className='capitialize flex-shrink-0 text-gray-500'>
                {t('product:quantity')}
              </span>
              <QuantityController
                onType={handleBuyCount}
                onIncrease={handleBuyCount}
                onDecrease={handleBuyCount}
                value={buyCount}
                max={productData.quantity}
              />
              <div className='ml-4 text-sm text-gray-600 md:ml-6'>
                <span>{`${productData.quantity} `}</span>
                <span>{t('product:available')}</span>
              </div>
            </div>
            <div className='mt-6 flex items-center' aria-hidden='true'>
              <button
                onClick={addToCart}
                className='flex h-12 items-center justify-center rounded-sm border border-orange-700 bg-orange-500/10 px-4 text-lg capitalize text-orange-600 transition duration-150 hover:bg-orange-300/10'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                  />
                </svg>

                <span className='ml-2'>{t('header:addToCart')}</span>
              </button>
              <button
                onClick={handleBuyNow}
                className='ml-4 flex h-12 items-center justify-center rounded-sm bg-orange-500 px-4 capitalize text-white outline-none transition duration-150 hover:bg-orange-600/90'
              >
                {t('product:buyNow')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-4 '>
        <div className='bg-white py-4 px-2 md:container'>
          <div className='mt-2 rounded bg-gray-50 p-2 text-lg uppercase text-slate-700'>
            {t('product:describe')}
          </div>
          <div className='mt-4 mb-4 p-2 text-sm leading-loose'>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(productData.description)
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <div className='bg-white px-2 py-4 md:container'>
          <div className='mt-2 rounded bg-gray-50 p-2 text-lg uppercase text-slate-700'>
            {t('product:sameCate')}
          </div>
          {sameCateProduct && (
            <div className='mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7'>
              {sameCateProduct.data.data.products.map((product, index) => {
                return (
                  <div key={index} className='col-span-1'>
                    <ProductItem product={product} />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
