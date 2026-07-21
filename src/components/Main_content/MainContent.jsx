import React, { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import Cartitem from './Cartitem'
import Ordersummary from './Ordersummary'
import { applyCoupon, calculateSubtotal } from '../../utils/discountEngine'

import One8 from '../../assets/one8shoes.jpeg'
import One82 from '../../assets/oneshoes2.jpeg'
import Nike1 from '../../assets/nikealphashoes.jpeg'
import Nike2 from '../../assets/nikejordan.jpeg'

const createEmptyShippingForm = () => ({
  fullName: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zipCode: ''
})

const createEmptyPaymentForm = () => ({
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvv: ''
})

const MainContent = () => {
  const steps = ['Cart Review', 'Shipping Info', 'Payment', 'Order Confirmation']

  const [currentStep, setCurrentStep] = useState(0)
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
  const [shippingForm, setShippingForm] = useState(createEmptyShippingForm())
  const [paymentForm, setPaymentForm] = useState(createEmptyPaymentForm())
  const [errors, setErrors] = useState({})

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

  const validateShipping = () => {
    const nextErrors = {}

    if (!shippingForm.fullName.trim()) nextErrors.fullName = 'Full name is required.'
    if (!shippingForm.email.trim()) nextErrors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingForm.email)) nextErrors.email = 'Please enter a valid email.'
    if (!shippingForm.address.trim()) nextErrors.address = 'Street address is required.'
    if (!shippingForm.city.trim()) nextErrors.city = 'City is required.'
    if (!shippingForm.state.trim()) nextErrors.state = 'State is required.'
    if (!shippingForm.zipCode.trim()) nextErrors.zipCode = 'ZIP code is required.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const validatePayment = () => {
    const nextErrors = {}

    if (!paymentForm.cardName.trim()) nextErrors.cardName = 'Cardholder name is required.'
    if (!/^\d{16}$/.test(paymentForm.cardNumber.replace(/\s/g, ''))) nextErrors.cardNumber = 'Card number must be 16 digits.'
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentForm.expiry)) nextErrors.expiry = 'Use MM/YY format.'
    if (!/^\d{3,4}$/.test(paymentForm.cvv)) nextErrors.cvv = 'CVV must be 3 or 4 digits.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleNextStep = () => {
    if (currentStep === 0) {
      setCurrentStep(1)
      setErrors({})
      return
    }

    if (currentStep === 1) {
      if (!validateShipping()) return
      setCurrentStep(2)
      setErrors({})
      return
    }

    if (currentStep === 2) {
      if (!validatePayment()) return
      setCurrentStep(3)
      setErrors({})
      return
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const handleStartOver = () => {
    setCurrentStep(0)
    setShippingForm(createEmptyShippingForm())
    setPaymentForm(createEmptyPaymentForm())
    setErrors({})
  }

  const discountedSubtotal = couponSummary.discountedSubtotal
  const deliveryFee = deliveryMethod === 'delivery' ? 7.99 : 0
  const serviceFee = discountedSubtotal * 0.03
  const tax = discountedSubtotal * 0.12
  const credits = useCredit ? 8 : 0
  const total = discountedSubtotal + deliveryFee + serviceFee + tax + tip - credits

  const renderLeftContent = () => {
    if (currentStep === 0) {
      return (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Cart Review</h2>
              <p className="text-sm text-gray-500">Confirm your items before you continue.</p>
            </div>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
              {items.length} item{items.length === 1 ? '' : 's'}
            </span>
          </div>
          <hr className="mb-6" />
          <Cartitem
            items={items}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onRemove={handleRemove}
          />
        </div>
      )
    }

    if (currentStep === 1) {
      return (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Shipping Info</h2>
            <p className="text-sm text-gray-500">We’ll send your order confirmation to this address.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-gray-600">
              <span className="mb-1 block">Full name</span>
              <input
                value={shippingForm.fullName}
                onChange={(event) => setShippingForm({ ...shippingForm, fullName: event.target.value })}
                className="w-full border border-gray-300 px-3 py-2"
              />
              {errors.fullName ? <span className="mt-1 block text-red-500">{errors.fullName}</span> : null}
            </label>

            <label className="text-sm text-gray-600">
              <span className="mb-1 block">Email</span>
              <input
                type="email"
                value={shippingForm.email}
                onChange={(event) => setShippingForm({ ...shippingForm, email: event.target.value })}
                className="w-full border border-gray-300 px-3 py-2"
              />
              {errors.email ? <span className="mt-1 block text-red-500">{errors.email}</span> : null}
            </label>

            <label className="text-sm text-gray-600 md:col-span-2">
              <span className="mb-1 block">Street address</span>
              <input
                value={shippingForm.address}
                onChange={(event) => setShippingForm({ ...shippingForm, address: event.target.value })}
                className="w-full border border-gray-300 px-3 py-2"
              />
              {errors.address ? <span className="mt-1 block text-red-500">{errors.address}</span> : null}
            </label>

            <label className="text-sm text-gray-600">
              <span className="mb-1 block">City</span>
              <input
                value={shippingForm.city}
                onChange={(event) => setShippingForm({ ...shippingForm, city: event.target.value })}
                className="w-full border border-gray-300 px-3 py-2"
              />
              {errors.city ? <span className="mt-1 block text-red-500">{errors.city}</span> : null}
            </label>

            <label className="text-sm text-gray-600">
              <span className="mb-1 block">State</span>
              <input
                value={shippingForm.state}
                onChange={(event) => setShippingForm({ ...shippingForm, state: event.target.value })}
                className="w-full border border-gray-300 px-3 py-2"
              />
              {errors.state ? <span className="mt-1 block text-red-500">{errors.state}</span> : null}
            </label>

            <label className="text-sm text-gray-600">
              <span className="mb-1 block">ZIP code</span>
              <input
                value={shippingForm.zipCode}
                onChange={(event) => setShippingForm({ ...shippingForm, zipCode: event.target.value })}
                className="w-full border border-gray-300 px-3 py-2"
              />
              {errors.zipCode ? <span className="mt-1 block text-red-500">{errors.zipCode}</span> : null}
            </label>
          </div>
        </div>
      )
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Payment</h2>
            <p className="text-sm text-gray-500">This checkout uses a mocked payment experience for demo purposes.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-gray-600 md:col-span-2">
              <span className="mb-1 block">Name on card</span>
              <input
                value={paymentForm.cardName}
                onChange={(event) => setPaymentForm({ ...paymentForm, cardName: event.target.value })}
                className="w-full border border-gray-300 px-3 py-2"
              />
              {errors.cardName ? <span className="mt-1 block text-red-500">{errors.cardName}</span> : null}
            </label>

            <label className="text-sm text-gray-600 md:col-span-2">
              <span className="mb-1 block">Card number</span>
              <input
                value={paymentForm.cardNumber}
                onChange={(event) => setPaymentForm({ ...paymentForm, cardNumber: event.target.value })}
                className="w-full border border-gray-300 px-3 py-2"
                placeholder="1234 5678 9012 3456"
              />
              {errors.cardNumber ? <span className="mt-1 block text-red-500">{errors.cardNumber}</span> : null}
            </label>

            <label className="text-sm text-gray-600">
              <span className="mb-1 block">Expiry</span>
              <input
                value={paymentForm.expiry}
                onChange={(event) => setPaymentForm({ ...paymentForm, expiry: event.target.value })}
                className="w-full border border-gray-300 px-3 py-2"
                placeholder="MM/YY"
              />
              {errors.expiry ? <span className="mt-1 block text-red-500">{errors.expiry}</span> : null}
            </label>

            <label className="text-sm text-gray-600">
              <span className="mb-1 block">CVV</span>
              <input
                value={paymentForm.cvv}
                onChange={(event) => setPaymentForm({ ...paymentForm, cvv: event.target.value })}
                className="w-full border border-gray-300 px-3 py-2"
                placeholder="123"
              />
              {errors.cvv ? <span className="mt-1 block text-red-500">{errors.cvv}</span> : null}
            </label>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4 rounded-lg border border-green-200 bg-green-50 p-5">
        <h2 className="text-xl font-semibold text-gray-800">Order Confirmed</h2>
        <p className="text-sm text-gray-600">Thank you for your order. Your purchase is on the way and a confirmation email has been sent.</p>

        <div className="rounded-md bg-white p-4 text-sm text-gray-700">
          <p><span className="font-semibold">Order ID:</span> SHOP-1024</p>
          <p><span className="font-semibold">Delivery:</span> {shippingForm.fullName || 'Customer'}</p>
          <p><span className="font-semibold">Address:</span> {shippingForm.address || 'N/A'}</p>
          <p><span className="font-semibold">Payment:</span> •••• {paymentForm.cardNumber.slice(-4) || '0000'}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {appliedCoupons.length ? (
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700">Coupons: {appliedCoupons.join(', ')}</span>
          ) : null}
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">Total: ${total.toFixed(2)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-10">
      <div className="flex items-center gap-1 pt-5 px-7.5 text-sm text-gray-400 cursor-pointer">
        <span className="hover:text-gray-600">Home</span>
        <ChevronRight size={14} />
        <span className="hover:text-gray-600">Stores</span>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 px-7">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isComplete = index < currentStep

          return (
            <React.Fragment key={step}>
              <div className={`rounded-full px-3 py-1 text-sm font-medium ${isActive ? 'bg-orange-500 text-white' : isComplete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {step}
              </div>
              {index < steps.length - 1 && <span className="text-gray-400">→</span>}
            </React.Fragment>
          )
        })}
      </div>

      <div className="mt-8 px-7.5 text-2xl font-semibold text-gray-800">
        Checkout
      </div>

      <div className="flex gap-8 mx-7 mt-6 items-start">
        <div className="flex-1 bg-white px-6 py-6">
          {renderLeftContent()}

          <div className="mt-6 flex justify-between gap-3">
            {currentStep > 0 && currentStep < 3 ? (
              <button onClick={handlePreviousStep} className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button onClick={handleNextStep} className="bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                {currentStep === 2 ? 'Place Order' : currentStep === 1 ? 'Continue to Payment' : 'Continue to Shipping'}
              </button>
            ) : (
              <button onClick={handleStartOver} className="bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                Start Over
              </button>
            )}
          </div>
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