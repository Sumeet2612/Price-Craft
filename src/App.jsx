import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/header/Header'
import MainContent from './components/Main_content/MainContent'
import ProductDetail from './pages/ProductDetail'
import Toast from './components/Toast'
import ErrorBoundary from './components/ErrorBoundary'
import Footer from './components/footer/Footer'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import AuthPage from './pages/AuthPage'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ErrorBoundary>
            <div className="min-h-screen bg-[#f5f2ee] text-slate-900 antialiased">
              <Header />
              <main className="relative">
                <Routes>
                  <Route path="/" element={<MainContent />} />
                  <Route path="/product/:productId" element={<ProductDetail />} />
                  <Route path="/auth" element={<AuthPage />} />
                </Routes>
              </main>
              <Footer />
              <Toast />
            </div>
          </ErrorBoundary>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
