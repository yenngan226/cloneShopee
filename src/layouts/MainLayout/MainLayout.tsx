import React from 'react'
import Footer from 'src/components/Footer'
import MainHeader from 'src/components/MainHeader'

interface Props {
  children: React.ReactNode
  header: React.ReactNode
}
export default function MainLayout({ header, children }: Props) {
  return (
    <div>
      {header}
      {children}
      <Footer />
    </div>
  )
}
