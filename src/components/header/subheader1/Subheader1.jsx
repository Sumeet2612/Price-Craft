import React from 'react'
import '../Header.css'

const Subheader1 = () => {
  return (
    <div className='top-utility-bar'>
      <div className='announcement-badge'>
        <span className='promo-tag'>OFFER</span>
        <span>Welcome to Indianmarket.co — 🔥 Express delivery on all orders!</span>
      </div>

      <div className='utility-nav-group'>
        <div className='utility-item'>
          <span>💬</span>
          <span>Support</span>
        </div>

        <div className='utility-item'>
          <span>🇮🇳</span>
          <span>India</span>
          <span className='utility-chevron'>▾</span>
        </div>

        <div className='utility-item'>
          <span>Mumbai</span>
          <span className='utility-chevron'>▾</span>
        </div>

        <div className='utility-item'>
          <span>🌐</span>
          <span>EN</span>
          <span className='utility-chevron'>▾</span>
        </div>
      </div>
    </div>
  )
}

export default Subheader1