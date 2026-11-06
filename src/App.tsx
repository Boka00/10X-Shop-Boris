import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppRoutes } from './routes/AppRoutes'
import './App.css'
import { CartProvider } from './context/CartContext'
import { ErrorBoundary } from './components/common/ErrorBoundary'


function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
