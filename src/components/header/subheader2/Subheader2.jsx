import { Link } from 'react-router-dom'
import { ChevronDown, Menu, MapPin, ShoppingBag, UserRound } from 'lucide-react'
import logo from '../../../assets/image1.png'
import { useCart } from '../../../context/CartContext'
import '../Header.css'

const Subheader2 = () => {
  const { itemCount } = useCart()

  return (
    <div className='primary-navbar'>
      <div className='nav-logo-wrapper'>
        <button className='menu-toggle-btn' aria-label='Toggle navigation menu'>
          <Menu className='h-5 w-5' />
        </button>

        <Link to='/' className='brand-link'>
          <div className='brand-mark'>
            <img src={logo} alt='Price-Craft logo' className='nav-logo-img' />
          </div>
          <div className='brand-stack'>
            <span className='brand-text'>Price</span>
            <span className='brand-highlight'>Craft</span>
          </div>
        </Link>
      </div>

      <nav className='nav-links' aria-label='Main navigation'>
        <a href='#new-arrivals' className='nav-link'>New Arrivals</a>
        <a href='#featured' className='nav-link'>Featured</a>
        <a href='#essentials' className='nav-link'>Essentials</a>
        <a href='#journal' className='nav-link'>Journal</a>
      </nav>

      <div className='nav-actions-group'>
        <button className='location-button' type='button'>
          <MapPin className='h-4 w-4' />
          <span>Mumbai</span>
          <ChevronDown className='h-3.5 w-3.5' />
        </button>

        <button className='account-button' type='button' aria-label='Account'>
          <UserRound className='h-4 w-4' />
          <span>Account</span>
        </button>

        <Link to='/#cart-section' className='cart-icon-wrapper' aria-label='View cart'>
          <ShoppingBag className='h-5 w-5' />
          {itemCount > 0 ? <span className='cart-badge-dot'>{itemCount}</span> : null}
        </Link>
      </div>
    </div>
  )
}

export default Subheader2
