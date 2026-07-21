// Cartitem.jsx
import { Minus, Plus, X } from 'lucide-react'

const formatRupees = (value) => `Rs. ${Number(value).toFixed(2)}`

const Cartitem = ({ items, onIncrement, onDecrement, onRemove }) => {
  return (
    <div className='mx-10 my-10 bg-white'>
      {items.map(function (elem, index) {
        const discountedPrice = Math.round(
          elem.originalPrice * (1 - elem.discountPercent / 100)
        )

        return (
          <div
            key={elem.id}
            className={`flex items-center justify-between py-5 ${
              index !== items.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            {/* Image */}
            <img
              src={elem.img}
              alt={elem.name}
              className='h-40 w-40 rounded object-cover'
            />

            {/* Details */}
            <div className='flex-1 ml-4'>
              <p className='text-gray-800 font-medium'>{elem.name}</p>
              <p className='text-sm text-gray-400'>{elem.category}</p>
              <p className='text-sm text-gray-500 mt-1'>
                Color : {elem.color} | Size : {elem.size}
              </p>
              <p className='mt-1'>
                <span className='text-gray-400 line-through mr-2'>
                  {formatRupees(elem.originalPrice)}
                </span>
                <span className='text-gray-800 font-semibold mr-2'>
                  {formatRupees(discountedPrice)}
                </span>
                <span className='text-orange-500 text-sm font-medium'>
                  {elem.discountPercent}% OFF
                </span>
              </p>
            </div>

            {/* Quantity + Remove */}
            <div className='flex flex-col items-end gap-2'>
              <div className='flex items-center gap-2'>
                <button
                  className='h-6 w-6 bg-gray-800 text-white rounded flex items-center justify-center cursor-pointer'
                  onClick={() => onDecrement(elem.id)}
                >
                  <Minus size={12} />
                </button>
                <span className='text-sm w-4 text-center'>{elem.quantity}</span>
                <button
                  className='h-6 w-6 bg-gray-800 text-white rounded flex items-center justify-center cursor-pointer'
                  onClick={() => onIncrement(elem.id)}
                >
                  <Plus size={12} />
                </button>
              </div>
              <button
                className='flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 cursor-pointer'
                onClick={() => onRemove(elem.id)}
              >
                <X size={12} /> Remove
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Cartitem
