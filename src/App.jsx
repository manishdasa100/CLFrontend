import { Outlet } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { UserProvider } from './context/UserContext'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Outlet/>
        <ReactQueryDevtools initialIsOpen={false} position='bottom-right'/>
      </UserProvider>
    </QueryClientProvider>
  )
}

