import React, { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Search, SlidersHorizontal, Star } from 'lucide-react'
import Cartitem from './Cartitem'
import Ordersummary from './Ordersummary'
import { applyCoupon, calculateSubtotal } from '../../utils/discountEngine'

import One8 from '../../assets/one8shoes.jpeg'
import One82 from '../../assets/oneshoes2.jpeg'
import Nike1 from '../../assets/nikealphashoes.jpeg'
import Nike2 from '../../assets/nikejordan.jpeg'
import Puma1 from '../../assets/Puma.jpeg'
import Puma2 from '../../assets/image.png'

const formatRupees = (value) => `Rs. ${Number(value).toFixed(2)}`

const genericSearchTerms = new Set(['shoe', 'shoes', 'sneaker', 'sneakers', 'show', 'shows'])

const getSalePrice = (product) => Math.round(
  product.originalPrice * (1 - product.discountPercent / 100)
)

const normalizeSearchValue = (value) => String(value)
  .toLowerCase()
  .replace(/one\s*8/g, 'one8')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()

const getSearchTokens = (value) => normalizeSearchValue(value)
  .split(' ')
  .filter((token) => token && !genericSearchTerms.has(token))

const getProductSearchText = (product) => normalizeSearchValue([
  product.name,
  product.category,
  `${product.category} shoes`,
  product.color,
  product.size
].join(' '))

const products = [
  {
    id: 1,
    img: One8,
    name: 'One8 Drift Runner',
    category: 'One8',
    color: 'Black',
    size: 'UK 7',
    price: 6999,
    originalPrice: 7799,
    discountPercent: 10,
    rating: 4.7,
    createdAt: '2026-07-08'
  },
  {
    id: 2,
    img: One82,
    name: 'One8 Court Sprint',
    category: 'One8',
    color: 'White',
    size: 'UK 7',
    price: 6299,
    originalPrice: 6999,
    discountPercent: 10,
    rating: 4.4,
    createdAt: '2026-06-26'
  },
  {
    id: 3,
    img: Nike1,
    name: 'Nike Alpha Fly',
    category: 'Nike',
    color: 'Blue',
    size: 'UK 8',
    price: 11899,
    originalPrice: 13999,
    discountPercent: 15,
    rating: 4.8,
    createdAt: '2026-07-15'
  },
  {
    id: 4,
    img: Nike2,
    name: 'Nike Air Jordan',
    category: 'Nike',
    color: 'Red',
    size: 'UK 9',
    price: 12799,
    originalPrice: 15999,
    discountPercent: 20,
    rating: 4.9,
    createdAt: '2026-07-19'
  },
  {
    id: 5,
    img: Nike1,
    name: 'Nike Tempo Glide',
    category: 'Nike',
    color: 'Silver',
    size: 'UK 8',
    price: 8999,
    originalPrice: 9999,
    discountPercent: 10,
    rating: 4.6,
    createdAt: '2026-07-13'
  },
  {
    id: 6,
    img: One8,
    name: 'One8 Urban Walk',
    category: 'One8',
    color: 'Grey',
    size: 'UK 6',
    price: 5599,
    originalPrice: 6999,
    discountPercent: 20,
    rating: 4.3,
    createdAt: '2026-07-01'
  },
  {
    id: 7,
    img: One82,
    name: 'Adidas Swift Court',
    category: 'Adidas',
    color: 'White',
    size: 'UK 9',
    price: 7499,
    originalPrice: 9999,
    discountPercent: 25,
    rating: 4.5,
    createdAt: '2026-07-17'
  },
  {
    id: 8,
    img: Puma1,
    name: 'Puma Street Rider',
    category: 'Puma',
    color: 'Black',
    size: 'UK 10',
    price: 6399,
    originalPrice: 7999,
    discountPercent: 20,
    rating: 4.2,
    createdAt: '2026-06-20'
  },
  {
    id: 9,
    img: Nike1,
    name: 'Adidas Aero Boost',
    category: 'Adidas',
    color: 'Blue',
    size: 'UK 8',
    price: 10499,
    originalPrice: 13999,
    discountPercent: 25,
    rating: 4.8,
    createdAt: '2026-07-20'
  },
  {
    id: 10,
    img: Puma2,
    name: 'Puma Flex Runner',
    category: 'Puma',
    color: 'Orange',
    size: 'UK 7',
    price: 4799,
    originalPrice: 5999,
    discountPercent: 20,
    rating: 4.1,
    createdAt: '2026-06-12'
  }
]

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
  const [items, setItems] = useState(products.slice(0, 4).map((product) => ({ ...product, quantity: product.id === 4 ? 2 : 1 })))
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [maxPrice, setMaxPrice] = useState(16000)
  const [sortBy, setSortBy] = useState('newest')

  const [tip, setTip] = useState(0)
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

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [searchTerm])

  const categories = useMemo(() => ['All', ...new Set(products.map((product) => product.category))], [])

  const cartQuantityById = useMemo(() => {
    return items.reduce((cartMap, item) => {
      cartMap[item.id] = item.quantity
      return cartMap
    }, {})
  }, [items])

  const cartItemCount = useMemo(() => {
    return items.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0)
  }, [items])

  const visibleProducts = useMemo(() => {
    const searchTokens = getSearchTokens(debouncedSearchTerm)

    return products
      .filter((product) => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
        const matchesPrice = getSalePrice(product) <= Number(maxPrice)
        const productSearchText = getProductSearchText(product)
        const matchesSearch = !searchTokens.length || searchTokens.every((token) => productSearchText.includes(token))

        return matchesCategory && matchesPrice && matchesSearch
      })
      .sort((firstProduct, secondProduct) => {
        if (sortBy === 'price-low-high') return getSalePrice(firstProduct) - getSalePrice(secondProduct)
        if (sortBy === 'rating') return secondProduct.rating - firstProduct.rating
        return new Date(secondProduct.createdAt) - new Date(firstProduct.createdAt)
      })
  }, [debouncedSearchTerm, maxPrice, selectedCategory, sortBy])

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

  const handleAddProductToCart = (product) => {
    setItems((prevItems) => {
      const itemExists = prevItems.some((item) => item.id === product.id)

      if (itemExists) {
        return prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        )
      }

      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const handleProductKeyDown = (event, product) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleAddProductToCart(product)
    }
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
        message: `${trimmedCode} applied. You saved ${formatRupees(result.discount)}.`
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
  const deliveryFee = deliveryMethod === 'delivery' ? 79 : 0
  const serviceFee = discountedSubtotal * 0.03
  const tax = discountedSubtotal * 0.12
  const credits = useCredit ? 80 : 0
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
              {cartItemCount} item{cartItemCount === 1 ? '' : 's'}
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
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">Total: {formatRupees(total)}</span>
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
        Products
      </div>

      <section className="catalog-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Shop shoes</h2>
            <p className="text-sm text-gray-500">Search, filter, and sort the latest picks before checkout.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <label className="catalog-control">
              <span className="mb-1 flex items-center gap-1 font-medium text-gray-700">
                <Search size={14} />
                Search
              </span>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Try Puma shoes or one 8 shoes"
                className="catalog-field"
              />
            </label>

            <label className="catalog-control">
              <span className="mb-1 flex items-center gap-1 font-medium text-gray-700">
                <SlidersHorizontal size={14} />
                Category
              </span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="catalog-field"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <label className="catalog-control">
              <span className="mb-1 block font-medium text-gray-700">Max price: {formatRupees(maxPrice)}</span>
              <input
                type="range"
                min="4000"
                max="16000"
                step="500"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                className="h-10 w-full accent-orange-500"
              />
            </label>

            <label className="catalog-control">
              <span className="mb-1 block font-medium text-gray-700">Sort by</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="catalog-field"
              >
                <option value="price-low-high">Price low-high</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <article
              key={product.id}
              className="product-card"
              role="button"
              tabIndex={0}
              onClick={() => handleAddProductToCart(product)}
              onKeyDown={(event) => handleProductKeyDown(event, product)}
            >
              <div className="aspect-square overflow-hidden bg-gray-50">
                <img src={product.img} alt={product.name} className="h-full w-full object-cover" />
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 bg-orange-50 px-2 py-1 text-sm font-semibold text-orange-700">
                    <Star size={14} fill="currentColor" />
                    {product.rating}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p>
                    <span className="font-semibold text-gray-900">{formatRupees(getSalePrice(product))}</span>
                    <span className="ml-2 text-sm text-gray-400 line-through">{formatRupees(product.originalPrice)}</span>
                  </p>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleAddProductToCart(product)
                    }}
                    className="cart-action-button"
                  >
                    ADD CART
                  </button>
                </div>

                {cartQuantityById[product.id] ? (
                  <p className="text-xs font-medium text-green-700">
                    {cartQuantityById[product.id]} in cart
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        {!visibleProducts.length ? (
          <div className="mt-5 border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
            No products match your filters.
          </div>
        ) : null}
      </section>

      <div id="cart-section" className="mt-8 scroll-mt-28 px-7.5 text-2xl font-semibold text-gray-800">
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
            itemCount={cartItemCount}
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
