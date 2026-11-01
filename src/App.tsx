import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppRoutes } from './routes/AppRoutes'
import './App.css'
import { CartProvider } from './context/CartContext'


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes/>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
