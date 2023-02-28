import { Outlet } from 'react-router-dom'
import Footer from 'src/components/Footer'
import RegisterHeader from 'src/components/RegisterHeader'

interface Props {
  children?: React.ReactNode
}

export default function RegisterLayout() {
  return (
    <div>
      <RegisterHeader />

      <Outlet />
      <Footer />
    </div>
  )
}
