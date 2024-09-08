import { Outlet, useNavigate } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
 
export default function App() {

  const navigate = useNavigate()

  return (
    <NextUIProvider navigate={navigate}> 
      <Outlet/>
    </NextUIProvider>
  )
}

