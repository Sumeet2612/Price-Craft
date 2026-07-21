// validators.js

export const findCoupon = (couponCode, coupons) => {
  return coupons.find(
    (coupon) => coupon.id.toLowerCase() === couponCode.toLowerCase()
  );
};

export const isExpired = (coupon) => {
  const today = new Date();
  const expiry = new Date(coupon.expiry);

  return today > expiry;
};

export const hasMinimumCartValue = (subtotal, coupon) => {
  return subtotal >= coupon.condition.minCartValue;
};