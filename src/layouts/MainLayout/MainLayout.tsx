import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from 'src/components/Footer'
import MainHeader from 'src/components/MainHeader'

interface Props {
  children: React.ReactNode
}
export default function MainLayout() {
  return (
    <div>
      <MainHeader />
      <Outlet />
      <Footer />
    </div>
  )
}
