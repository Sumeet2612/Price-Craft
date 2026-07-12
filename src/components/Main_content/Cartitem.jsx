import React from 'react'
import { Minus, Plus, X } from 'lucide-react'
import One8 from '../../assets/one8shoes.jpeg'
import One82 from '../../assets/oneshoes2.jpeg'
import Nike1 from '../../assets/nikealphashoes.jpeg'
import Nike2 from '../../assets/nikejordan.jpeg'

const Cartitem = () => {
    const items = [
        {
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
            img: Nike2,
            name: 'Air Jordan',
            category: 'Nike',
            color: 'Red',
            size: 'UK 9',
            originalPrice: 1200,
            discountPercent: 20,
            quantity: 2
        }
    ]

    return (
        <div className='mx-10 my-10 bg-white'>
            {items.map(function (elem, index) {
                const discountedPrice = Math.round(
                    elem.originalPrice * (1 - elem.discountPercent / 100)
                )

                return (
                    <div
                        key={index}
                        className={`flex items-center justify-between py-5 ${
                            index !== items.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                    >
                        {/* Image */}
                        <img
                            src={elem.img}
                            alt={elem.name}
                            className='h-20 w-20 rounded object-cover'
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
                                    ${elem.originalPrice}
                                </span>
                                <span className='text-gray-800 font-semibold mr-2'>
                                    ${discountedPrice}
                                </span>
                                <span className='text-orange-500 text-sm font-medium'>
                                    {elem.discountPercent}% OFF
                                </span>
                            </p>
                        </div>

                        {/* Quantity + Remove — stubbed until cart reducer exists (PRD 4.3) */}
                        <div className='flex flex-col items-end gap-2'>
                            <div className='flex items-center gap-2'>
                                <button className='h-6 w-6 bg-gray-800 text-white rounded flex items-center justify-center'>
                                    <Minus size={12} />
                                </button>
                                <span className='text-sm w-4 text-center'>
                                    {elem.quantity}
                                </span>
                                <button className='h-6 w-6 bg-gray-800 text-white rounded flex items-center justify-center'>
                                    <Plus size={12} />
                                </button>
                            </div>
                            <button className='flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600'>
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