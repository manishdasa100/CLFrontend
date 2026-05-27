import { Outlet, useNavigate } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import { QueryClientProvider, QueryClient } from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
import { UserProvider } from './context/UserContext'

const queryClient = new QueryClient()

export default function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <NextUIProvider navigate={useNavigate()}>
          <Outlet/>
          <ReactQueryDevtools initialIsOpen={false} position='bottom-right'/>
        </NextUIProvider>
      </UserProvider>
    </QueryClientProvider>
  )
}

