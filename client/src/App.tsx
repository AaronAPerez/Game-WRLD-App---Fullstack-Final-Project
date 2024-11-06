import { QueryClientProvider } from '@tanstack/react-query';
import Layout from './routing/Layout'
import { Provider } from './components/ui/provider';
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  return (
    <>
      <Provider>
        <QueryClientProvider>
          <Router>
            <Layout />
          </Router>
        </QueryClientProvider>
      </Provider>
    </>
  )
}

export default App
