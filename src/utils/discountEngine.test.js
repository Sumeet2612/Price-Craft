import test from 'node:test'
import assert from 'node:assert/strict'
import { applyCoupon, applyDiscounts, calculateSubtotal } from './discountEngine.js'

const fashionCart = [
  {
    id: 1,
    name: 'Shirt',
    category: 'Fashion',
    originalPrice: 100,
    discountPercent: 0,
    quantity: 1
  },
  {
    id: 2,
    name: 'Jeans',
    category: 'Fashion',
    originalPrice: 200,
    discountPercent: 0,
    quantity: 1
  }
]

const largeCart = [
  {
    id: 1,
    name: 'Jacket',
    category: 'Fashion',
    originalPrice: 2500,
    discountPercent: 0,
    quantity: 1
  }
]

test('applies a percentage coupon to the eligible subtotal', () => {
  const result = applyCoupon(fashionCart, 300, 'SAVE10')

  assert.equal(result.success, true)
  assert.equal(result.discount, 30)
  assert.equal(result.finalTotal, 270)
})

test('applies a flat coupon when the cart meets the threshold', () => {
  const result = applyCoupon(largeCart, calculateSubtotal(largeCart), 'FLAT200')

  assert.equal(result.success, true)
  assert.equal(result.discount, 200)
  assert.equal(result.finalTotal, 2300)
})

test('handles BOGO discounts by giving one free unit for each pair', () => {
  const bogoCart = [
    {
      id: 1,
      name: 'Book A',
      category: 'Books',
      originalPrice: 80,
      discountPercent: 0,
      quantity: 2
    },
    {
      id: 2,
      name: 'Book B',
      category: 'Books',
      originalPrice: 40,
      discountPercent: 0,
      quantity: 2
    }
  ]

  const result = applyCoupon(bogoCart, 240, 'BOGOBOOKS')

  assert.equal(result.success, true)
  assert.equal(result.discount, 80)
  assert.equal(result.finalTotal, 160)
})

test('leaves an odd BOGO leftover item at full price', () => {
  const oddCart = [
    {
      id: 1,
      name: 'Book A',
      category: 'Books',
      originalPrice: 80,
      discountPercent: 0,
      quantity: 3
    }
  ]

  const result = applyCoupon(oddCart, 240, 'BOGOBOOKS')

  assert.equal(result.success, true)
  assert.equal(result.discount, 80)
  assert.equal(result.finalTotal, 160)
})

test('rejects a second non-stackable coupon', () => {
  const first = applyCoupon(largeCart, calculateSubtotal(largeCart), 'SAVE10')
  const second = applyCoupon(largeCart, first.finalTotal, 'FASHION20', first.appliedCoupons)

  assert.equal(second.success, false)
  assert.match(second.message, /cannot be combined/i)
})

test('allows a stackable coupon to be applied alongside an existing coupon', () => {
  const firstResult = applyCoupon(largeCart, calculateSubtotal(largeCart), 'FLAT200', [])
  const stackedResult = applyCoupon(
    largeCart,
    firstResult.finalTotal,
    'BIG500',
    firstResult.appliedCoupons
  )

  assert.equal(stackedResult.success, true)
  assert.equal(stackedResult.discount, 500)
  assert.equal(stackedResult.finalTotal, 1800)
})

test('applyDiscounts auto-invalidates a min-cart coupon when the cart drops below threshold', () => {
  const result = applyDiscounts(fashionCart, ['BIG500'])

  assert.equal(result.appliedCoupons.includes('BIG500'), false)
  assert.equal(result.rejectedDiscounts[0].code, 'BIG500')
})

test('clamps a discount so the total never goes below zero', () => {
  const tinyCart = [
    {
      id: 1,
      name: 'Pin',
      category: 'Fashion',
      originalPrice: 50,
      discountPercent: 0,
      quantity: 1
    }
  ]

  const result = applyCoupon(tinyCart, 50, 'SAVE10')
  assert.equal(result.finalTotal >= 0, true)
})
