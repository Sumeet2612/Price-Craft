import { Link } from 'react-router-dom'
import { Menu, Search, ShoppingBag, MapPin } from 'lucide-react'
import logo from '../../../assets/image1.png'
import { useCart } from '../../../context/CartContext'
import '../Header.css'

const Subheader2 = () => {
  const { itemCount } = useCart()

  return (
    <div className='primary-navbar'>

      {/* Left: menu + logo */}
      <div className='nav-logo-wrapper'>
        <button className='menu-toggle-btn' aria-label="Toggle Navigation Menu">
          <Menu className='w-6 h-6' />
        </button>
        <Link to="/" className='flex items-center space-x-2 text-decoration-none'>
          <img src={logo} alt="IndianMarket Logo" className='nav-logo-img' />
          <span className='brand-text'>
            Indian<span className='brand-highlight'>Market</span>
          </span>
        </Link>
      </div>

      {/* Center: search bar */}
      <div className='nav-search-container'>
        <input
          type="text"
          placeholder="Search restaurants, grocery, fashion..."
          className='nav-search-input'
        />
        <button className='nav-search-btn' aria-label="Search">
          <Search className='w-4 h-4' />
        </button>
      </div>

      {/* Right: nav links + cart + location */}
      <div className='nav-actions-group'>
        <nav className='nav-links'>
          <a href="#stores" className='nav-link'>Stores</a>
          <a href="#restaurants" className='nav-link'>Restaurants</a>
          <a href="#marketplace" className='nav-link'>Marketplace</a>
          <a href="#login" className='nav-link'>Login / Register</a>
        </nav>

        <Link
          to="/#cart-section"
          aria-label="Go to cart"
          className="cart-icon-wrapper"
        >
          <ShoppingBag className='w-5 h-5' />
          {itemCount > 0 ? <span className='cart-badge-dot'>{itemCount}</span> : null}
        </Link>

        <button className='detect-location-btn'>
          <MapPin className='w-4 h-4 pin-icon' />
          <span>DETECT LOCATION</span>
        </button>
      </div>

    </div>
  )
}

export default Subheader2
