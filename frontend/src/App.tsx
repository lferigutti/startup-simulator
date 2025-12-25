import MainBoard from  '@/components/sections/MainBoard.tsx'
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";


const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider  client={queryClient}>
      <MainBoard />
    </QueryClientProvider>
  )
}

export default App;
