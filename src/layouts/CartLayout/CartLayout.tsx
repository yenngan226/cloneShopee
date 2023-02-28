import { Outlet } from 'react-router-dom'
import Footer from 'src/components/Footer'
import CartHeader from '../../components/CartHeader'

export default function CartLayout() {
  return (
    <div>
      <CartHeader />
      <Outlet />
      <Footer />
    </div>
  )
}
