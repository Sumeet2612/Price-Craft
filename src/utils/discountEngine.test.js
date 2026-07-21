import test from 'node:test';
import assert from 'node:assert/strict';
import { applyCoupon } from './discountEngine.js';

const sampleCart = [
  {
    id: 1,
    name: 'Shirt',
    category: 'Fashion',
    originalPrice: 100,
    discountPercent: 0,
    quantity: 1,
  },
  {
    id: 2,
    name: 'Jeans',
    category: 'Fashion',
    originalPrice: 200,
    discountPercent: 0,
    quantity: 1,
  },
];

test('applies a percentage coupon to the eligible subtotal', () => {
  const result = applyCoupon(sampleCart, 300, 'SAVE10');

  assert.equal(result.success, true);
  assert.equal(result.discount, 30);
  assert.equal(result.finalTotal, 270);
});

test('applies a flat coupon when the cart meets the threshold', () => {
  const result = applyCoupon(sampleCart, 1200, 'FLAT200');

  assert.equal(result.success, true);
  assert.equal(result.discount, 200);
  assert.equal(result.finalTotal, 1000);
});

test('handles BOGO discounts by giving one free unit for each pair', () => {
  const bogoCart = [
    {
      id: 1,
      name: 'Book A',
      category: 'Books',
      originalPrice: 80,
      discountPercent: 0,
      quantity: 2,
    },
    {
      id: 2,
      name: 'Book B',
      category: 'Books',
      originalPrice: 40,
      discountPercent: 0,
      quantity: 2,
    },
  ];

  const result = applyCoupon(bogoCart, 240, 'BOGOBOOKS');

  assert.equal(result.success, true);
  assert.equal(result.discount, 80);
  assert.equal(result.finalTotal, 160);
});

test('allows a stackable coupon to be applied alongside an existing coupon', () => {
  const firstResult = applyCoupon(sampleCart, 2500, 'FLAT200', []);
  const stackedResult = applyCoupon(sampleCart, firstResult.finalTotal, 'BIG500', firstResult.appliedCoupons);

  assert.equal(stackedResult.success, true);
  assert.equal(stackedResult.discount, 500);
  assert.equal(stackedResult.finalTotal, 1800);
});
