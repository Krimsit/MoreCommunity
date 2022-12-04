import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
})

export default queryClient
