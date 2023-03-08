import classNames from 'classnames'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'
import path from 'src/constant/path'
import { Appcontext } from 'src/contexts/app.context'
import { getAvatarUrl } from 'src/utils/formatNumber.utils'

export default function UserSideNav() {
  const { t } = useTranslation(['header'])
  const { profile } = useContext(Appcontext)
  return (
    <div className='overflow-hidden'>
      <div className='border-gray-b flex w-full items-center border-b py-4'>
        <Link
          to={path.profile}
          className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-black/10'
        >
          <img
            src={getAvatarUrl(profile?.avatar)}
            alt=''
            className='h-full w-full object-cover'
          />
        </Link>
        <div className='flex-grow truncate pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-600'>
            {profile?.email}
          </div>
          <Link
            to={path.profile}
            className='flex items-center capitalize text-gray-500'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='mr-1 h-4 w-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
              />
            </svg>
            {t('header:editProfile')}
          </Link>
        </div>
      </div>
      <div className='mt-7'>
        <NavLink
          to={path.profile}
          className={({ isActive }) => {
            return classNames(
              'mb-3 flex items-center capitalize  transition-colors',
              {
                'text-orangeShopee': isActive,
                'text-gray-500': !isActive
              }
            )
          }}
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-full w-full'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
          </div>
          {t('header:myAccount')}
        </NavLink>
        <NavLink
          to={path.changePassword}
          className={({ isActive }) => {
            return classNames(
              'mb-3 flex items-center capitalize  transition-colors',
              {
                'text-orangeShopee': isActive,
                'text-gray-500': !isActive
              }
            )
          }}
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-full w-full'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z'
              />
            </svg>
          </div>
          {t('header:changePassword')}
        </NavLink>
        <NavLink
          to={path.purchasesHistory}
          className={({ isActive }) => {
            return classNames(
              'mb-3 flex items-center capitalize  transition-colors',
              {
                'text-orangeShopee': isActive,
                'text-gray-500': !isActive
              }
            )
          }}
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-full w-full'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z'
              />
            </svg>
          </div>
          {t('header:purchase')}
        </NavLink>
      </div>
    </div>
  )
}
