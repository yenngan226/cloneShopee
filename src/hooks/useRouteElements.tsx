import React, { useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import CartHeader from 'src/components/CartHeader'
import MainHeader from 'src/components/MainHeader'
import path from 'src/constant/path'
import { Appcontext } from 'src/contexts/app.context'
import MainLayout from 'src/layouts/MainLayout'
import RegisterLayout from 'src/layouts/RegisterLayout'
import Cart from 'src/pages/Cart'
import Login from 'src/pages/Login'
import NotFound from 'src/pages/NotFound'
import ProductDetail from 'src/pages/PageDetail'
import ProductList from 'src/pages/ProductList'
import Profile from 'src/pages/Profile'
import Register from 'src/pages/Register'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(Appcontext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}
function RejectedRoute() {
  const { isAuthenticated } = useContext(Appcontext)
  return !isAuthenticated ? (
    <RegisterLayout>
      <Outlet />
    </RegisterLayout>
  ) : (
    <Navigate to='/' />
  )
}
export default function useRouteElements() {
  const routeElement = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,

      children: [
        {
          path: path.login,

          element: <Login />
        },
        {
          path: path.register,

          element: <Register />
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,

      children: [
        {
          path: path.profile,

          element: (
            <MainLayout header={<MainHeader />}>
              <Profile />
            </MainLayout>
          )
        },
        {
          path: path.cart,

          element: (
            <MainLayout header={<CartHeader />}>
              <Cart />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: path.home,
      index: true,
      element: (
        <MainLayout header={<MainHeader />}>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: path.productDetail,
      index: true,
      element: (
        <MainLayout header={<MainHeader />}>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: '*',
      element: (
        <MainLayout header={<MainHeader />}>
          <NotFound />
        </MainLayout>
      )
    }
  ])
  return routeElement
}
