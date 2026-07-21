// discountEngine.js
import { coupons } from "../data/coupons.js";
import { findCoupon, isExpired, hasMinimumCartValue } from "./validators.js";

const normalizeCouponCode = (value = "") => String(value || "").trim().toUpperCase();

const getItemPrice = (item) => {
  const basePrice = Number(item?.originalPrice || 0);
  const discountPercent = Number(item?.discountPercent || 0);

  return basePrice * (1 - discountPercent / 100);
};

export const calculateSubtotal = (cartItems = []) => {
  return cartItems.reduce((total, item) => {
    const quantity = Number(item?.quantity || 0);
    return total + getItemPrice(item) * quantity;
  }, 0);
};

const getEligibleItems = (cartItems = [], coupon) => {
  if (!coupon?.condition?.applicableCategories?.length) {
    return cartItems;
  }

  const categories = coupon.condition.applicableCategories;

  if (categories.includes("all")) {
    return cartItems;
  }

  return cartItems.filter((item) => {
    const category = String(item?.category || "").toLowerCase();
    return categories.some((name) => String(name).toLowerCase() === category);
  });
};

const calculateDiscountAmount = (cartItems = [], subtotal = 0, coupon) => {
  const eligibleItems = getEligibleItems(cartItems, coupon);
  const eligibleSubtotal = eligibleItems.reduce((total, item) => {
    const quantity = Number(item?.quantity || 0);
    return total + getItemPrice(item) * quantity;
  }, 0);

  let discount = 0;

  if (coupon.type === "PERCENTAGE") {
    discount = eligibleSubtotal * (coupon.value / 100);
  }

  if (coupon.type === "FLAT") {
    discount = coupon.value;
  }

  if (coupon.type === "MIN_CART_VALUE") {
    discount = coupon.value;
  }

  if (coupon.type === "BOGO") {
    const qualifyingPrices = eligibleItems
      .flatMap((item) => {
        const quantity = Number(item?.quantity || 0);
        const price = getItemPrice(item);
        return Array.from({ length: quantity }, () => price);
      })
      .sort((a, b) => a - b);

    const pairCount = Math.floor(qualifyingPrices.length / 2);

    discount = qualifyingPrices.slice(0, pairCount).reduce((total, price) => total + price, 0);
  }

  return Math.max(0, Math.min(discount, subtotal));
};

export const applyCoupon = (
  cartItems = [],
  subtotal = 0,
  couponCode = "",
  appliedCouponCodes = []
) => {
  const cartSubtotal = subtotal || calculateSubtotal(cartItems);
  const normalizedCode = normalizeCouponCode(couponCode);
  const coupon = findCoupon(normalizedCode, coupons);
  const existingCodes = (appliedCouponCodes || []).map(normalizeCouponCode).filter(Boolean);

  if (!coupon) {
    return {
      success: false,
      message: "Invalid coupon code.",
      discount: 0,
      finalTotal: cartSubtotal,
      appliedCoupons: existingCodes,
    };
  }

  if (existingCodes.includes(normalizedCode)) {
    return {
      success: false,
      message: "Coupon already applied.",
      discount: 0,
      finalTotal: cartSubtotal,
      appliedCoupons: existingCodes,
    };
  }

  if (isExpired(coupon)) {
    return {
      success: false,
      message: "Coupon has expired.",
      discount: 0,
      finalTotal: cartSubtotal,
      appliedCoupons: existingCodes,
    };
  }

  if (!hasMinimumCartValue(cartSubtotal, coupon)) {
    return {
      success: false,
      message: `Minimum cart value should be ₹${coupon.condition.minCartValue}`,
      discount: 0,
      finalTotal: cartSubtotal,
      appliedCoupons: existingCodes,
    };
  }

  const existingCoupons = existingCodes
    .map((code) => findCoupon(code, coupons))
    .filter(Boolean);

  const hasNonStackableExistingCoupon = existingCoupons.some((item) => !item.stackable);

  if (existingCoupons.length > 0 && (!coupon.stackable || hasNonStackableExistingCoupon)) {
    return {
      success: false,
      message: "This coupon cannot be combined with the currently applied coupon(s).",
      discount: 0,
      finalTotal: cartSubtotal,
      appliedCoupons: existingCodes,
    };
  }

  const discount = calculateDiscountAmount(cartItems, cartSubtotal, coupon);
  const finalTotal = Math.max(cartSubtotal - discount, 0);

  return {
    success: true,
    appliedCoupon: coupon.id,
    appliedCoupons: [...existingCodes, normalizedCode],
    subtotal: cartSubtotal,
    discount,
    finalTotal,
    savings: discount,
    message: `${coupon.id} applied successfully.`,
  };
};