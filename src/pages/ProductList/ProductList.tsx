import { useQuery } from '@tanstack/react-query'
import { categoryApi } from 'src/api/api/category.api'
import { productApi } from 'src/api/api/product.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/types/product.type'
import Pagination from '../Pagination'
import AsideFilter from './components/AsideFilter'
import ProductItem from './components/ProductItem'
import SortProductList from './components/SortProductList'

export default function ProductList() {
  const queryConfig = useQueryConfig()

  const productQuery = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProduct(queryConfig as ProductListConfig)
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })
  const categoryQuery = useQuery({
    queryKey: ['category'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <div className='bg-gray-200 py-6'>
      <div className='mx-3 md:container'>
        {productQuery.data && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='hidden md:col-span-3 md:block'>
              <AsideFilter
                categories={categoryQuery.data?.data.data || []}
                queryConfig={queryConfig}
              />
            </div>
            <div className='col-span-12 md:col-span-9'>
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
