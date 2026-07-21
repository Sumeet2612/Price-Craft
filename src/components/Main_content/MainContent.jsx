import React, { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import Cartitem from './Cartitem'
import Ordersummary from './Ordersummary'
import { applyCoupon, calculateSubtotal } from '../../utils/discountEngine'

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

  const [tip, setTip] = useState(4)
  const [deliveryMethod, setDeliveryMethod] = useState('delivery')
  const [useCredit, setUseCredit] = useState(true)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupons, setAppliedCoupons] = useState([])
  const [couponStatus, setCouponStatus] = useState({
    type: 'idle',
    message: 'Apply a coupon to unlock extra savings.'
  })

  const handleIncrement = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    )
  }

  const handleDecrement = (id) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const handleRemove = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const subtotal = useMemo(() => calculateSubtotal(items), [items])

  const couponSummary = useMemo(() => {
    let remainingSubtotal = subtotal
    let totalDiscount = 0
    const validCoupons = []

    for (const code of appliedCoupons) {
      const result = applyCoupon(items, remainingSubtotal, code, validCoupons)

      if (!result.success) {
        break
      }

      remainingSubtotal = result.finalTotal
      totalDiscount += result.discount
      validCoupons.push(code)
    }

    return {
      totalDiscount,
      discountedSubtotal: Math.max(remainingSubtotal, 0),
      validCoupons,
    }
  }, [appliedCoupons, items, subtotal])

  const handleApplyCoupon = () => {
    const trimmedCode = couponCode.trim().toUpperCase()

    if (!trimmedCode) {
      setCouponStatus({ type: 'error', message: 'Please enter a coupon code.' })
      return
    }

    const result = applyCoupon(items, subtotal - couponSummary.totalDiscount, trimmedCode, couponSummary.validCoupons)

    if (result.success) {
      setAppliedCoupons(result.appliedCoupons)
      setCouponStatus({
        type: 'success',
        message: `${trimmedCode} applied. You saved $${result.discount.toFixed(2)}.`
      })
      setCouponCode('')
      return
    }

    setCouponStatus({ type: 'error', message: result.message })
  }

  const handleRemoveCoupon = (codeToRemove) => {
    const updatedCoupons = appliedCoupons.filter((code) => code !== codeToRemove)
    setAppliedCoupons(updatedCoupons)
    setCouponStatus({ type: 'success', message: `${codeToRemove} removed.` })
  }

  const discountedSubtotal = couponSummary.discountedSubtotal
  const deliveryFee = deliveryMethod === 'delivery' ? 7.99 : 0
  const serviceFee = discountedSubtotal * 0.03
  const tax = discountedSubtotal * 0.12
  const credits = useCredit ? 8 : 0
  const total = discountedSubtotal + deliveryFee + serviceFee + tax + tip - credits

  return (
    <div className="pb-10">
      <div className="flex items-center gap-1 pt-5 px-7.5 text-sm text-gray-400 cursor-pointer">
        <span className="hover:text-gray-600">Home</span>
        <ChevronRight size={14} />
        <span className="hover:text-gray-600">Stores</span>
      </div>

      <div className="flex items-center justify-center gap-3 mt-10">
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
              <span className="border-t border-dotted border-gray-400 w-10 mt-0.5" />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-10 px-7.5 text-2xl font-semibold text-gray-800">
        My Cart
      </div>

      <div className="flex gap-8 mx-7 mt-6 items-start">
        <div className="flex-1 bg-white px-6 py-6">
          <h2 className="text-xl mb-4">My Cart ({items.length})</h2>
          <hr className="mb-6" />
          <Cartitem
            items={items}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onRemove={handleRemove}
          />
        </div>

        <div className="w-[340px] shrink-0">
          <Ordersummary
            subtotal={subtotal}
            discountedSubtotal={discountedSubtotal}
            itemCount={items.length}
            deliveryFee={deliveryFee}
            serviceFee={serviceFee}
            tax={tax}
            tip={tip}
            total={total}
            useCredit={useCredit}
            deliveryMethod={deliveryMethod}
            couponCode={couponCode}
            couponStatus={couponStatus}
            discountAmount={couponSummary.totalDiscount}
            appliedCoupons={appliedCoupons}
            setCouponCode={setCouponCode}
            setTip={setTip}
            setUseCredit={setUseCredit}
            setDeliveryMethod={setDeliveryMethod}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
          />
        </div>
      </div>
    </div>
  )
}

export default MainContent