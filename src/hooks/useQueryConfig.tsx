import { isUndefined, omitBy } from 'lodash'
import { QueryConfig } from 'src/pages/ProductList/ProductList'
import useQueryString from './useQueryString'

export default function useQueryConfig() {
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
  return queryConfig
}