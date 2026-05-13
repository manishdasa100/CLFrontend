import { Outlet, useNavigate } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import { QueryClientProvider, QueryClient } from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'

const queryClient = new QueryClient()

export default function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider navigate={useNavigate()}> 
        <Outlet/>
        <ReactQueryDevtools initialIsOpen={false} position='bottom-right'/>
      </NextUIProvider>
    </QueryClientProvider>
  )
}

