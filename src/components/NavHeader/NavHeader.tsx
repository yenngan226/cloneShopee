import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from 'src/api/api/auth.api'
import path from 'src/constant/path'
import { purchasesStatus } from 'src/constant/purchase'
import { Appcontext } from 'src/contexts/app.context'
import { clearLS } from 'src/utils/auth.utils'

import Popover from '../Popover'

export default function NavHeader() {
  const { isAuthenticated, reset, profile } = useContext(Appcontext)
  const queryClient = useQueryClient()

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: (data) => {
      clearLS()
      reset()
      //Do useEffect ở main header xử lý
      // queryClient.removeQueries({
      //   queryKey: ['purchases', { status: purchasesStatus.inCart }]
      // })
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handleLogout = () => logoutMutation.mutate()

  return (
    <div>
      <div className='flex justify-between md:justify-end '>
        <Popover
          placement='bottom'
          as={'span'}
          className='ml-2 flex cursor-pointer items-center justify-center py-1 text-white hover:text-gray-300 md:mr-5'
          renderPopover={
            <div className='relative rounded-md border border-gray-200 bg-white shadow-md'>
              <div className='flex flex-col px-2 py-3'>
                <button className='py-2 px-4 text-sm hover:bg-slate-300 hover:text-orangeShopee'>
                  Tiếng Việt
                </button>
                <button className='mt-2 py-2 px-4 text-sm hover:bg-slate-300 hover:text-orangeShopee'>
                  English
                </button>
              </div>
            </div>
          }
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
            />
          </svg>
          <span className='mx-1 text-sm'>Tiếng Việt</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5'
            />
          </svg>
        </Popover>
        {!isAuthenticated && (
          <div className='flex justify-between'>
            <Link to={path.login} className='px-2 py-2 text-white'>
              Đăng nhập
            </Link>
            <Link to={path.register} className='px-2 py-2 text-white'>
              Đăng ký
            </Link>
          </div>
        )}
        {isAuthenticated && (
          <Popover
            placement='bottom'
            className='flex cursor-pointer items-center py-1 text-white hover:text-gray-300'
            renderPopover={
              <div className='relative rounded-md border border-gray-200 bg-white shadow-md'>
                <div className='flex flex-col px-2 py-3'>
                  <Link
                    to={path.profile}
                    className='py-2 px-4 text-sm hover:bg-slate-300 hover:text-orangeShopee'
                  >
                    Tài khoản
                  </Link>
                  <Link
                    to='/'
                    className='py-2 px-4 text-sm hover:bg-slate-300 hover:text-orangeShopee'
                  >
                    Đơn mua
                  </Link>
                  <button
                    className='py-2 px-4 text-sm hover:bg-slate-300 hover:text-orangeShopee'
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            }
          >
            <div className='mx-[0.1rem] mr-1 h-6 w-6 flex-shrink-0'>
              <img
                src='https://easydrawingguides.com/wp-content/uploads/2018/09/Sun-10.png'
                alt='avatar'
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <span className='text-sm md:mr-3'>{profile?.email}</span>
          </Popover>
        )}
      </div>
    </div>
  )
}
