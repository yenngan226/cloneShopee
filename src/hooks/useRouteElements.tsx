import React, { useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from 'src/constant/path'
import { Appcontext } from 'src/contexts/app.context'
import MainLayout from 'src/layouts/MainLayout'
import RegisterLayout from 'src/layouts/RegisterLayout'
import Login from 'src/pages/Login'
import ProductDetail from 'src/pages/PageDetail'
import ProductList from 'src/pages/ProductList'
import Profile from 'src/pages/Profile'
import Register from 'src/pages/Register'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(Appcontext)
  return isAuthenticated ? (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ) : (
    <Navigate to={path.login} />
  )
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
          element: <Profile />
        }
      ]
    },
    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: path.productDetail,
      index: true,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    }
  ])
  return routeElement
}
