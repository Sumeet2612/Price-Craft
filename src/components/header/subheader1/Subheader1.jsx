import React from 'react'
import '../Header.css'

const Subheader1 = () => {
  return (
    <div className='top-utility-bar'>
      <div className='announcement-badge'>
        <span className='promo-tag'>Offer</span>
        <span>Free express delivery across India on orders above Rs. 3,999.</span>
      </div>

      <div className='utility-nav-group'>
        <div className='utility-item'>
          <span>Support</span>
        </div>
        <div className='utility-item'>
          <span>India</span>
          <span className='utility-chevron'>▾</span>
        </div>
        <div className='utility-item'>
          <span>Mumbai</span>
          <span className='utility-chevron'>▾</span>
        </div>
      </div>
    </div>
  )
}

export default Subheader1
