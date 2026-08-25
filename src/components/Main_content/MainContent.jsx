import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Search, SlidersHorizontal, Star } from 'lucide-react'
import Cartitem from './Cartitem'
import Ordersummary from './Ordersummary'
import { products, getSalePrice } from '../../data/products'
import { useCart } from '../../context/CartContext'

const formatRupees = (value) => `Rs. ${Number(value).toFixed(2)}`

const genericSearchTerms = new Set(['shoe', 'shoes', 'sneaker', 'sneakers', 'show', 'shows'])

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
  const {
    items,
    filters,
    addItem,
    removeItem,
    updateQuantity,
    applyCartCoupon,
    removeCoupon,
    setFilters,
    itemCount,
    subtotal,
    discountSummary,
    rejectedDiscounts
  } = useCart()

  const [currentStep, setCurrentStep] = useState(0)
  const [searchTerm, setSearchTerm] = useState(filters.search)
  const [tip, setTip] = useState(0)
  const [deliveryMethod, setDeliveryMethod] = useState('delivery')
  const [useCredit, setUseCredit] = useState(true)
  const [couponCode, setCouponCode] = useState('')
  const [couponStatus, setCouponStatus] = useState({
    type: 'idle',
    message: 'Try SAVE10, FLAT200, FASHION20, BOGOBOOKS, or BIG500.'
  })
  const [shippingForm, setShippingForm] = useState(createEmptyShippingForm())
  const [paymentForm, setPaymentForm] = useState(createEmptyPaymentForm())
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setFilters({ search: searchTerm })
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [searchTerm, setFilters])

  useEffect(() => {
    if (!rejectedDiscounts.length) return
    setCouponStatus({
      type: 'error',
      message: rejectedDiscounts.map((item) => `${item.code}: ${item.reason}`).join(' ')
    })
  }, [rejectedDiscounts])

  const categories = useMemo(() => ['All', ...new Set(products.map((product) => product.category))], [])

  const cartQuantityById = useMemo(() => {
    return items.reduce((cartMap, item) => {
      cartMap[item.productId] = item.quantity
      return cartMap
    }, {})
  }, [items])

  const visibleProducts = useMemo(() => {
    const searchTokens = getSearchTokens(filters.search)

    return products
      .filter((product) => {
        const matchesCategory = filters.category === 'All' || product.category === filters.category
        const matchesPrice = getSalePrice(product) <= Number(filters.maxPrice)
        const productSearchText = getProductSearchText(product)
        const matchesSearch = !searchTokens.length || searchTokens.every((token) => productSearchText.includes(token))

        return matchesCategory && matchesPrice && matchesSearch
      })
      .sort((firstProduct, secondProduct) => {
        if (filters.sortBy === 'price-low-high') return getSalePrice(firstProduct) - getSalePrice(secondProduct)
        if (filters.sortBy === 'rating') return secondProduct.rating - firstProduct.rating
        return new Date(secondProduct.createdAt) - new Date(firstProduct.createdAt)
      })
  }, [filters])

  const handleApplyCoupon = () => {
    const result = applyCartCoupon(couponCode)

    if (result.success) {
      setCouponStatus({
        type: 'success',
        message: `${result.appliedCoupon} applied. You saved ${formatRupees(result.discount)}.`
      })
      setCouponCode('')
      return
    }

    setCouponStatus({ type: 'error', message: result.message })
  }

  const handleRemoveCoupon = (codeToRemove) => {
    removeCoupon(codeToRemove)
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
      if (!items.length) {
        setErrors({ cart: 'Add at least one item before continuing.' })
        return
      }
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

  const discountedSubtotal = discountSummary.finalTotal
  const deliveryFee = deliveryMethod === 'delivery' ? 79 : 0
  const serviceFee = discountedSubtotal * 0.03
  const tax = discountedSubtotal * 0.12
  const credits = useCredit ? 80 : 0
  const total = Math.max(discountedSubtotal + deliveryFee + serviceFee + tax + tip - credits, 0)

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
              {itemCount} item{itemCount === 1 ? '' : 's'}
            </span>
          </div>
          <hr className="mb-6" />
          {errors.cart ? <p className="mb-4 text-sm text-red-500">{errors.cart}</p> : null}
          <Cartitem
            items={items}
            onIncrement={(id) => {
              const item = items.find((entry) => entry.productId === id)
              updateQuantity(id, (item?.quantity || 0) + 1)
            }}
            onDecrement={(id) => {
              const item = items.find((entry) => entry.productId === id)
              updateQuantity(id, (item?.quantity || 0) - 1)
            }}
            onRemove={removeItem}
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
          {discountSummary.appliedCoupons.length ? (
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700">
              Coupons: {discountSummary.appliedCoupons.join(', ')}
            </span>
          ) : null}
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">Total: {formatRupees(total)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-10">
      <div className="flex items-center gap-1 pt-5 px-7.5 text-sm text-gray-400">
        <Link to="/" className="hover:text-gray-600">Home</Link>
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
            <h2 className="text-xl font-semibold text-gray-800">Shop Cart catalog</h2>
            <p className="text-sm text-gray-500">Search, filter, and sort. Fashion and Books unlock FASHION20 and BOGOBOOKS.</p>
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
                placeholder="Try Puma, fashion, or books"
                className="catalog-field"
              />
            </label>

            <label className="catalog-control">
              <span className="mb-1 flex items-center gap-1 font-medium text-gray-700">
                <SlidersHorizontal size={14} />
                Category
              </span>
              <select
                value={filters.category}
                onChange={(event) => setFilters({ category: event.target.value })}
                className="catalog-field"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <label className="catalog-control">
              <span className="mb-1 block font-medium text-gray-700">Max price: {formatRupees(filters.maxPrice)}</span>
              <input
                type="range"
                min="400"
                max="16000"
                step="100"
                value={filters.maxPrice}
                onChange={(event) => setFilters({ maxPrice: Number(event.target.value) })}
                className="h-10 w-full accent-orange-500"
              />
            </label>

            <label className="catalog-control">
              <span className="mb-1 block font-medium text-gray-700">Sort by</span>
              <select
                value={filters.sortBy}
                onChange={(event) => setFilters({ sortBy: event.target.value })}
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
            <article key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} className="block">
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img src={product.img} alt={product.name} className="h-full w-full object-cover" />
                </div>
              </Link>

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/product/${product.id}`} className="font-semibold text-gray-800 hover:text-orange-600">
                      {product.name}
                    </Link>
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
                    onClick={() => addItem(product)}
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

      <div className="flex gap-8 mx-7 mt-6 items-start max-lg:flex-col">
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
            itemCount={itemCount}
            deliveryFee={deliveryFee}
            serviceFee={serviceFee}
            tax={tax}
            tip={tip}
            total={total}
            useCredit={useCredit}
            deliveryMethod={deliveryMethod}
            couponCode={couponCode}
            couponStatus={couponStatus}
            discountAmount={discountSummary.discount}
            appliedCoupons={discountSummary.appliedCoupons}
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
