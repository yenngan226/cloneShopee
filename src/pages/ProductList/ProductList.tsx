import { useQuery } from '@tanstack/react-query'
import { omitBy, isUndefined } from 'lodash'
import { categoryApi } from 'src/api/api/category.api'
import { productApi } from 'src/api/api/product.api'
import useQueryString from 'src/hooks/useQueryString'
import { ProductListConfig } from 'src/types/product.type'
import Pagination from '../Pagination'
import AsideFilter from './components/AsideFilter'
import ProductItem from './components/ProductItem'
import SortProductList from './components/SortProductList'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryParams: QueryConfig = useQueryString()

  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit,
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
      category: queryParams.category
    },
    isUndefined
  )

  const productQuery = useQuery({
    queryKey: ['product', queryParams],
    queryFn: () => {
      return productApi.getProduct(queryConfig as ProductListConfig)
    },
    keepPreviousData: true
  })
  const categoryQuery = useQuery({
    queryKey: ['category'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        {productQuery.data && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter
                categories={categoryQuery.data?.data.data || []}
                queryConfig={queryConfig}
              />
            </div>
            <div className='col-span-9'>
              <SortProductList
                queryConfig={queryConfig}
                pageSize={productQuery.data.data.data.pagination.page_size}
              />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productQuery.data.data.data.products.map((product, index) => {
                  return (
                    <div key={index} className='col-span-1'>
                      <ProductItem product={product} />
                    </div>
                  )
                })}
              </div>
              <Pagination
                queryConfig={queryConfig}
                pageSize={productQuery.data.data.data.pagination.page_size}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
