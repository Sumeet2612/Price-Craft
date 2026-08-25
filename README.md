# ShopCart

Frontend shopping cart built as a portfolio piece. The standout feature is a **rules-based discount engine** (percentage, flat, BOGO, min-cart) with stacking, rejection, and auto-invalidation.

## Run locally

```bash
npm install
npm run dev
npm test
```

## Architecture decisions

**`useReducer` + Context instead of many `useState`s.** Cart mutations are discrete (`ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`, `APPLY_DISCOUNT`). Listing filters live in one `filters` object (`search`, `category`, `maxPrice`, `sortBy`) so filter/sort/search stay in a single place.

**Discount engine is a pure function.** `applyDiscounts(cart, coupons)` always returns the same totals for the same inputs. Order of operations is BOGO → flat → min-cart → percentage. Non-stackable coupons reject the later code instead of silently combining. Totals never go below ₹0.

**localStorage persistence.** Cart line items and applied coupons rehydrate on refresh. This is device-bound and needs no auth; a backend cart would be the right next step for cross-device persistence.

**Optimistic UI.** Add-to-cart updates immediately and shows a toast. There is no API wait.

## Demo coupons

| Code | Type | Notes |
|---|---|---|
| `SAVE10` | 10% off | Not stackable |
| `FLAT200` | ₹200 off | Stackable, min ₹1000 |
| `FASHION20` | 20% off Fashion | Category-limited |
| `BOGOBOOKS` | BOGO on Books | Odd leftover item stays full price |
| `BIG500` | ₹500 off | Stackable, min ₹2000 |

## Interview talking points

- Why a reducer for cart actions vs scattered `useState`
- Why BOGO runs before percentage (order changes the price)
- What happens if a min-cart coupon is applied and the user then removes items
- Why two non-stackable codes cannot combine
