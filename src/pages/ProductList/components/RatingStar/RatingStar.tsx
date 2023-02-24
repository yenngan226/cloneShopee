import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constant/path'
import { QueryConfig } from '../../ProductList'

//Thuật toán render rating star
//Index = 0 thì có 5 ngôi sao có indexStar từ 0-4 màu vàng
//Index = 1 thì có 4 ngôi sao có indexStar từ 0-3 màu vàng
//Index = 2 thì có 3 ngôi sao có indexStar từ 0-2 màu vàng
//Index = 3 thì có 2 ngôi sao có indexStar từ 0-1 màu vàng
//Index = 4 thì có 1 ngôi sao có indexStar vị trí 0 màu vàng

type Props = {
  queryConfig: QueryConfig
}
export default function RatingStar({ queryConfig }: Props) {
  const navigate = useNavigate()
  const handleFilterRating = (index: number) => {
    return navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        rating_filter: String(index),
        page: '1'
      }).toString()
    })
  }
  return (
    <ul className='my-3'>
      {Array(5)
        .fill(0)
        .map((_, index) => {
          return (
            <li className='flex items-center py-1 pl-2' key={index}>
              <div
                className='flex items-center'
                onClick={() => {
                  handleFilterRating(5 - index)
                }}
                aria-hidden='true'
                tabIndex={0}
                role='button'
              >
                {Array(5)
                  .fill(0)
                  .map((_, indexStar) => {
                    if (indexStar < 5 - index) {
                      return (
                        <div key={indexStar} className='mr-1'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            className='h-4 w-4 fill-yellow-500'
                          >
                            <path
                              fillRule='evenodd'
                              d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </div>
                      )
                    }
                    return (
                      <div key={indexStar} className='mr-1'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          className='h-4 w-4 fill-none stroke-slate-400'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                    )
                  })}

                {index !== 0 && <span className='text-xs'>Trở lên</span>}
              </div>
            </li>
          )
        })}
    </ul>
  )
}
