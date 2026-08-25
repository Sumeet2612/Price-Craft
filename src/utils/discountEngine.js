import { coupons } from '../data/coupons.js'
import { findCoupon, isExpired, hasMinimumCartValue } from './validators.js'

const APPLY_ORDER = {
  BOGO: 0,
  FLAT: 1,
  MIN_CART_VALUE: 2,
  PERCENTAGE: 3
}

const normalizeCouponCode = (value = '') => String(value || '').trim().toUpperCase()

const getItemPrice = (item) => {
  const basePrice = Number(item?.originalPrice || item?.priceAtAddTime || 0)
  const discountPercent = Number(item?.discountPercent || 0)

  if (item?.priceAtAddTime && !item?.originalPrice) {
    return Number(item.priceAtAddTime)
  }

  return basePrice * (1 - discountPercent / 100)
}

export const calculateSubtotal = (cartItems = []) => {
  return cartItems.reduce((total, item) => {
    const quantity = Number(item?.quantity || 0)
    return total + getItemPrice(item) * quantity
  }, 0)
}

const getEligibleItems = (cartItems = [], coupon) => {
  if (!coupon?.condition?.applicableCategories?.length) {
    return cartItems
  }

  const categories = coupon.condition.applicableCategories

  if (categories.includes('all')) {
    return cartItems
  }

  return cartItems.filter((item) => {
    const category = String(item?.category || '').toLowerCase()
    return categories.some((name) => String(name).toLowerCase() === category)
  })
}

const calculateDiscountAmount = (cartItems = [], subtotal = 0, coupon) => {
  const eligibleItems = getEligibleItems(cartItems, coupon)
  const eligibleSubtotal = eligibleItems.reduce((total, item) => {
    const quantity = Number(item?.quantity || 0)
    return total + getItemPrice(item) * quantity
  }, 0)

  let discount = 0

  if (coupon.type === 'PERCENTAGE') {
    discount = eligibleSubtotal * (coupon.value / 100)
  }

  if (coupon.type === 'FLAT' || coupon.type === 'MIN_CART_VALUE') {
    discount = coupon.value
  }

  if (coupon.type === 'BOGO') {
    const qualifyingPrices = eligibleItems
      .flatMap((item) => {
        const quantity = Number(item?.quantity || 0)
        const price = getItemPrice(item)
        return Array.from({ length: quantity }, () => price)
      })
      .sort((a, b) => a - b)

    const pairCount = Math.floor(qualifyingPrices.length / 2)
    discount = qualifyingPrices.slice(0, pairCount).reduce((total, price) => total + price, 0)
  }

  return Math.max(0, Math.min(discount, subtotal, eligibleSubtotal || subtotal))
}

const reject = (cartSubtotal, appliedCoupons, rejectedDiscounts, message) => ({
  success: false,
  message,
  discount: 0,
  finalTotal: cartSubtotal,
  appliedCoupons,
  rejectedDiscounts,
  savings: 0,
  appliedDiscounts: []
})

const validateCoupon = (couponCode, cartItems, cartSubtotal, allRules) => {
  const normalizedCode = normalizeCouponCode(couponCode)
  const coupon = findCoupon(normalizedCode, allRules)

  if (!coupon) {
    return { ok: false, code: normalizedCode, message: 'Invalid coupon code.' }
  }

  if (isExpired(coupon)) {
    return { ok: false, code: normalizedCode, coupon, message: 'Coupon has expired.' }
  }

  if (!hasMinimumCartValue(cartSubtotal, coupon)) {
    return {
      ok: false,
      code: normalizedCode,
      coupon,
      message: `Minimum cart value should be Rs. ${coupon.condition.minCartValue}`
    }
  }

  const eligibleItems = getEligibleItems(cartItems, coupon)
  if (!eligibleItems.length) {
    return {
      ok: false,
      code: normalizedCode,
      coupon,
      message: `${coupon.id} only applies to ${coupon.condition.applicableCategories.join(', ')} items.`
    }
  }

  return { ok: true, code: normalizedCode, coupon }
}

export const applyDiscounts = (cartItems = [], activeCoupons = [], allRules = coupons) => {
  const cartSubtotal = calculateSubtotal(cartItems)
  const rejectedDiscounts = []
  const accepted = []
  const seen = new Set()

  for (const rawCode of activeCoupons) {
    const result = validateCoupon(rawCode, cartItems, cartSubtotal, allRules)

    if (!result.ok) {
      rejectedDiscounts.push({ code: result.code, reason: result.message })
      continue
    }

    if (seen.has(result.code)) {
      rejectedDiscounts.push({ code: result.code, reason: 'Coupon already applied.' })
      continue
    }

    const hasNonStackableExisting = accepted.some((item) => !item.coupon.stackable)
    if (accepted.length > 0 && (!result.coupon.stackable || hasNonStackableExisting)) {
      rejectedDiscounts.push({
        code: result.code,
        reason: 'This coupon cannot be combined with the currently applied coupon(s).'
      })
      continue
    }

    seen.add(result.code)
    accepted.push(result)
  }

  const ordered = [...accepted].sort(
    (a, b) => (APPLY_ORDER[a.coupon.type] ?? 99) - (APPLY_ORDER[b.coupon.type] ?? 99)
  )

  let remainingSubtotal = cartSubtotal
  let totalDiscount = 0
  const appliedDiscounts = []

  for (const { code, coupon } of ordered) {
    const discount = calculateDiscountAmount(cartItems, remainingSubtotal, coupon)
    remainingSubtotal = Math.max(remainingSubtotal - discount, 0)
    totalDiscount += discount
    appliedDiscounts.push({
      code,
      type: coupon.type,
      amount: discount
    })
  }

  return {
    success: appliedDiscounts.length > 0,
    subtotal: cartSubtotal,
    discount: totalDiscount,
    savings: totalDiscount,
    finalTotal: Math.max(remainingSubtotal, 0),
    appliedCoupons: appliedDiscounts.map((item) => item.code),
    appliedDiscounts,
    rejectedDiscounts,
    message: rejectedDiscounts[0]?.reason || (appliedDiscounts.length ? 'Discounts applied.' : '')
  }
}

export const applyCoupon = (
  cartItems = [],
  subtotal = 0,
  couponCode = '',
  appliedCouponCodes = [],
  allRules = coupons
) => {
  const cartSubtotal = subtotal || calculateSubtotal(cartItems)
  const normalizedCode = normalizeCouponCode(couponCode)
  const existingCodes = (appliedCouponCodes || []).map(normalizeCouponCode).filter(Boolean)

  if (!normalizedCode) {
    return reject(cartSubtotal, existingCodes, [], 'Please enter a coupon code.')
  }

  if (existingCodes.includes(normalizedCode)) {
    return reject(cartSubtotal, existingCodes, [{ code: normalizedCode, reason: 'Coupon already applied.' }], 'Coupon already applied.')
  }

  const preview = applyDiscounts(cartItems, [...existingCodes, normalizedCode], allRules)
  const wasAccepted = preview.appliedCoupons.includes(normalizedCode)

  if (!wasAccepted) {
    const rejected = preview.rejectedDiscounts.find((item) => item.code === normalizedCode)
    return reject(
      cartSubtotal,
      existingCodes,
      preview.rejectedDiscounts,
      rejected?.reason || 'Coupon could not be applied.'
    )
  }

  const previous = applyDiscounts(cartItems, existingCodes, allRules)
  const discount = Math.max(preview.discount - previous.discount, 0)

  return {
    success: true,
    appliedCoupon: normalizedCode,
    appliedCoupons: preview.appliedCoupons,
    appliedDiscounts: preview.appliedDiscounts,
    rejectedDiscounts: preview.rejectedDiscounts,
    subtotal: cartSubtotal,
    discount,
    finalTotal: preview.finalTotal,
    savings: preview.savings,
    message: `${normalizedCode} applied successfully.`
  }
}
