import React from 'react'

const Subheader1 = () => {
  return (
    <div className='bg-black text-white text-sm rounded-l flex justify-between items-center px-6 py-2'>
      
     
      <div>
        Welcome to Indianmarket.co
      </div>

      
      <div className='flex items-center space-x-6'>
        <div className='flex items-center space-x-1 cursor-pointer'>
          <span>💬</span>
          <span>Support</span>
        </div>

        <div className='flex items-center space-x-1 cursor-pointer'>
          <span>🇮🇳</span>
          <span>India</span>
          <span>▾</span>
        </div>

        <div className='flex items-center space-x-1 cursor-pointer'>
          <span>Mumbai</span>
          <span>▾</span>
        </div>

        <div className='flex items-center space-x-1 cursor-pointer'>
          <span>🌐</span>
          <span>EN</span>
          <span>▾</span>
        </div>
      </div>

    </div>
  )
}

export default Subheader1