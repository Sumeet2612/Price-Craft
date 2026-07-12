import React from 'react'
import { ChevronRight } from 'lucide-react'
import Cartitem from './Cartitem'


const MainContent = () => {
  const steps = ['Cart', 'Shipping', 'Payment']
  const currentStep = 'Cart'
  

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
        My Cart(4)
        <hr className='mx-4.5 mt-6 mb-3' />
        <Cartitem />
      </div>
      <div>
        
      </div>
    </div>
  )
}

export default MainContent