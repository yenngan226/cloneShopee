import { lazy, Suspense, useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'

import path from 'src/constant/path'
import { Appcontext } from 'src/contexts/app.context'
import CartLayout from 'src/layouts/CartLayout/CartLayout'
import MainLayout from 'src/layouts/MainLayout'
import RegisterLayout from 'src/layouts/RegisterLayout'
import UserLayout from 'src/pages/User/Layout'
import ChangePassword from 'src/pages/User/pages/ChangePassword'
import PurchasesHistory from 'src/pages/User/pages/PurchasesHistory'

const Login = lazy(() => import('src/pages/Login'))
const ProductDetail = lazy(() => import('src/pages/PageDetail'))
const ProductList = lazy(() => import('src/pages/ProductList'))
const Profile = lazy(() => import('src/pages/Profile'))
const Register = lazy(() => import('src/pages/Register'))
const Cart = lazy(() => import('src/pages/Cart'))
const NotFound = lazy(() => import('src/pages/NotFound'))

function ProtectedRoute() {
  const { isAuthenticated } = useContext(Appcontext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}
function RejectedRoute() {
  const { isAuthenticated } = useContext(Appcontext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}
export default function useRouteElements() {
  const routeElement = useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: '/',
          element: (
            <Suspense>
              <ProductList />
            </Suspense>
          )
        },
        {
          path: path.productDetail,
          element: (
            <Suspense>
              <ProductDetail />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: <MainLayout />,
          children: [
            {
              path: path.user,
              element: <UserLayout />,
              children: [
                {
                  path: path.profile,
                  element: (
                    <Suspense>
                      <Profile />
                    </Suspense>
                  )
                },
                {
                  path: path.changePassword,
                  element: (
                    <Suspense>
                      <ChangePassword />
                    </Suspense>
                  )
                },
                {
                  path: path.purchasesHistory,
                  element: (
                    <Suspense>
                      <PurchasesHistory />
                    </Suspense>
                  )
                }
              ]
            }
          ]
        },
        {
          path: path.cart,
          element: <CartLayout />,
          children: [
            {
              path: '',
              element: (
                <Suspense>
                  <Cart />
                </Suspense>
              )
            }
          ]
        }
      ]
    },

    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: '',
          element: <RegisterLayout />,
          children: [
            {
              path: path.login,

              element: (
                <Suspense>
                  <Login />
                </Suspense>
              )
            },
            {
              path: path.register,

              element: (
                <Suspense fallback={<></>}>
                  <Register />
                </Suspense>
              )
            }
          ]
        }
      ]
    },

    {
      path: '*',
      element: <NotFound />
    }
  ])
  return routeElement
}
