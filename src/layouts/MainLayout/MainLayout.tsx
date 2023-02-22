import React from 'react'
import Footer from 'src/components/Footer'
import MainHeader from 'src/components/MainHeader'

interface Props {
  children: React.ReactNode
}
export default function MainLayout({ children }: Props) {
  return (
    <div>
      <MainHeader />
      {children}
      <Footer />
    </div>
  )
}
