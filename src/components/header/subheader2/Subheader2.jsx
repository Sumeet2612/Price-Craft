import React from 'react'
import { Menu, Search, ShoppingBag, MapPin } from 'lucide-react'
import logo from '../../../assets/image1.png'

const Subheader2 = () => {
  return (
    <div className='flex items-center justify-between px-6 py-4 bg-white'>

      {/* Left: menu + logo */}
      <div className='flex items-center space-x-4'>
        <Menu className='w-6 h-6 cursor-pointer' />
        <div className='flex items-center space-x-2'>
          <img src={logo} alt="logo" className='w h-20' />
          <span className='text-xl font-semibold'>
            <span className='text-orange-500'></span>
          </span>
        </div>
      </div>

      {/* Center: search bar */}
      <div className='flex items-center border rounded-md overflow-hidden w-150'>
        <input
          type="text"
          placeholder="Restaurants, grocery, fashion"
          className='px-4 py-2 w-full outline-none text-sm'
        />
        <button className='px-4 py-2 border-l'>
          <Search className='w-5 h-5' />
        </button>
      </div>

      {/* Right: nav links + cart + location */}
      <div className='flex items-center space-x-6 text-sm font-medium'>
        <span className='cursor-pointer'>Stores</span>
        <span className='cursor-pointer'>Restaurants</span>
        <span className='cursor-pointer'>Marketplace</span>
        <span className='cursor-pointer'>Login / Register</span>

        <ShoppingBag className='w-6 h-6 text-orange-500 cursor-pointer' />

        <button className='flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-md text-xs font-semibold'>
          <MapPin className='w-4 h-4' />
          <span>DETECT LOCATION</span>
        </button>
      </div>

    </div>
  )
}

export default Subheader2