// MainContent.jsx
import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import Cartitem from './Cartitem'
import One8 from '../../assets/one8shoes.jpeg'
import One82 from '../../assets/oneshoes2.jpeg'
import Nike1 from '../../assets/nikealphashoes.jpeg'
import Nike2 from '../../assets/nikejordan.jpeg'

const MainContent = () => {
  const steps = ['Cart', 'Shipping', 'Payment']
  const currentStep = 'Cart'

  const [items, setItems] = useState([
    {
      id: 1,
      img: One8,
      name: 'Seam XVIII Signature',
      category: 'One8',
      color: 'Black',
      size: 'UK 7',
      originalPrice: 770,
      discountPercent: 10,
      quantity: 1
    },
    {
      id: 2,
      img: One82,
      name: 'Seam XVIII Signature',
      category: 'One8',
      color: 'White',
      size: 'UK 7',
      originalPrice: 770,
      discountPercent: 10,
      quantity: 1
    },
    {
      id: 3,
      img: Nike1,
      name: 'Alpha Fly',
      category: 'Nike',
      color: 'Blue',
      size: 'UK 8',
      originalPrice: 950,
      discountPercent: 15,
      quantity: 1
    },
    {
      id: 4,
      img: Nike2,
      name: 'Air Jordan',
      category: 'Nike',
      color: 'Red',
      size: 'UK 9',
      originalPrice: 1200,
      discountPercent: 20,
      quantity: 2
    }
  ])

  const handleIncrement = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const handleDecrement = (id) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const handleRemove = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  return (
    <div className=' pb-10'>
      {/* Breadcrumb */}
      <div className='flex items-center gap-1 pt-5 px-7.5 text-sm text-gray-400 cursor-pointer'>
        <span className='hover:text-gray-600'>Home</span>
        <ChevronRight size={14} />
        <span className='hover:text-gray-600'>Stores</span>
      </div>

      {/* Step Indicator */}
      <div className='flex items-center justify-center gap-3 mt-10'>
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <span
              className={
                step === currentStep
                  ? 'text-gray-800 font-medium text-sm'
                  : 'text-gray-400 text-sm'
              }
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <span className='border-t border-dotted border-gray-400 w-10 mt-0.5' />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Heading */}
      <div className='mt-10 px-7.5 text-2xl font-semibold text-gray-800'>
        My Cart
      </div>

      <hr className='mx-7.5 mt-4 border-t border-orange-200' />
      <div className='bg-white mx-7 px-6 py-6 mt-6 col-auto'>
        My Cart({items.length})
        <hr className='mx-4.5 mt-6 mb-3' />
        <Cartitem
          items={items}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onRemove={handleRemove}
        />
      </div>
    </div>
  )
}

export default MainContent