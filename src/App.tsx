import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import useRouteElements from './hooks/useRouteElements'
import { ToastContainer } from 'react-toastify'
import { useContext, useEffect } from 'react'
import { LocalStorageEventTarget } from './utils/auth.utils'
import { Appcontext } from './contexts/app.context'
function App() {
  const routes = useRouteElements()
  const { reset } = useContext(Appcontext)
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  return (
    <div className='App'>
      {routes}
      <ToastContainer />
    </div>
  )
}

export default App
