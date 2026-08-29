import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/header/Header'
import MainContent from './components/Main_content/MainContent'
import ProductDetail from './pages/ProductDetail'
import Toast from './components/Toast'
import ErrorBoundary from './components/ErrorBoundary'
import Footer from './components/footer/Footer'
import { CartProvider } from './context/CartContext'

const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-[#f5f2ee] text-slate-900 antialiased">
            <Header />
            <main className="relative">
              <Routes>
                <Route path="/" element={<MainContent />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
              </Routes>
            </main>
            <Footer />
            <Toast />
          </div>
        </ErrorBoundary>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
