import { Outlet } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { UserProvider } from './context/UserContext'

// react-query retries three times by default, with backoff. For a 4xx that is
// pure waiting: a 404 or a 403 will never become a 200, so every "not found"
// screen in the app sat behind ~14s of spinner before it could say anything.
// Retry server faults and network drops, never client ones. Set here rather than
// per-hook so a new query can't reintroduce the delay by forgetting to opt out.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, err) => {
        const status = err?.response?.status
        if (status >= 400 && status < 500) return false
        return failureCount < 2
      },
    },
  },
})

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

