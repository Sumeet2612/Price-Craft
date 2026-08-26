<<<<<<< HEAD
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
=======
# ShopCart 🛒

A frontend e-commerce application built to demonstrate strong React state management, a rules-based discount/coupon engine, and production-level UX polish.

**Live demo:** [https://price-craft-navy.vercel.app/]

---

## Why This Project Exists

Most shopping cart clones stop at "add to cart + checkout." This project goes further by implementing a **rules-based coupon/discount engine** as an isolated, pure, testable function — the kind of system design thinking (rules, precedence, edge cases) that real pricing/permissions engines in production use.

---

## Tech Stack

- **React** (Vite)
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **State management:** `useReducer` + Context API
- **Icons:** Lucide React
- **Deployment:** Vercel

---

## Features

- **Product listing** with filtering, sorting, and debounced search
- **Cart management** — add, remove, update quantity — powered by a `useReducer`-based cart reducer (`ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`)
- **Coupon / Discount Engine** (⭐ main differentiator):
  - Rule-based architecture — each discount is a typed rule object, not hardcoded if/else
  - Supports: Percentage off, Flat discount, BOGO, Minimum-cart-value discounts
  - Handles edge cases: non-stackable coupon conflicts, auto-invalidation when the cart drops below a threshold, BOGO with odd item counts, and negative-total clamping
  - Built and tested as a pure function before being wired into the UI
- **Multi-step checkout** — Cart Review → Shipping Info → Payment → Order Confirmation

---

## Architecture Decisions

**Why `useReducer` over multiple `useState` calls?**
Cart actions are discrete and well-defined (add, remove, update quantity), which maps cleanly onto reducer actions. This keeps state transitions predictable and makes the logic easy to test and reason about as the app grows.

**Why a rules-based discount engine?**
Hardcoded if/else logic for discounts doesn't scale — adding a new discount type would mean touching existing logic. Modeling each discount as a rule object (type, value, condition, stackable) means adding a new discount type is a matter of adding a new rule handler, not rewriting existing code.

**Derived vs. stored values**
Discounted prices are computed on render rather than stored in state, avoiding data drift between the original price and the discount logic.

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Sumeet2612>/Price-Craft.git
cd Price-Craft

# Install dependencies
npm install

# Run locally
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Project Structure

```
src/
├── components/
│   ├── MainContent.jsx    # Cart state, handlers, breadcrumb, step indicator
│   ├── CartItem.jsx       # Stateless cart item display component
│   └── ...
├── context/                # Cart context + reducer (in progress)
├── data/                    # Static product data
└── App.jsx
```

---



## What This Project Demonstrates (for interviews)

- Reducer-based state management for predictable, testable state transitions
- Designing a rules engine and reasoning explicitly about precedence and edge cases
- Writing pure, testable business logic decoupled from UI
- Trade-off analysis (e.g., localStorage vs. backend-persisted cart)

---

## License

MIT
>>>>>>> 8db4ec0650e7a7f77d5dc1ff70afdbf7612cce2c
