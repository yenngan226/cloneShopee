import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import useRouteElements from './hooks/useRouteElements'
import { ToastContainer } from 'react-toastify'
function App() {
  const routes = useRouteElements()
  return (
    <div className='App'>
      {routes}
      <ToastContainer />
    </div>
  )
}

export default App
