import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/header/Header'
import MainContent from './components/Main_content/MainContent'
import ProductDetail from './pages/ProductDetail'
import Toast from './components/Toast'
import ErrorBoundary from './components/ErrorBoundary'
import { CartProvider } from './context/CartContext'

const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <ErrorBoundary>
          <div className="bg-[#fff4ee] min-h-screen">
            <Header />
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
            </Routes>
            <Toast />
          </div>
        </ErrorBoundary>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
