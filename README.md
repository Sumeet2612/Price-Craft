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
