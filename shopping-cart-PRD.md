# Product Requirements Document (PRD)
## Shopping Cart Web Application — Resume Project

---

## 1. Overview

**Project name:** ShopCart (working title — rename as you like)

**Purpose:** A frontend e-commerce application demonstrating strong state management, algorithmic thinking (via a discount engine), and production-level UX polish. Built to be a standout portfolio piece for frontend developer interviews.

**Primary differentiator:** A rules-based discount/coupon engine, designed to be extensible and demonstrate edge-case reasoning — not just a checkout form.

---

## 2. Goals

- Demonstrate mastery of React state management (`useReducer` + Context)
- Show ability to design and reason about a non-trivial business logic system (discount engine)
- Produce a polished, deployable, demo-able product for a resume link
- Be defensible in an interview — every design decision has a reason you can explain out loud

---

## 3. Tech Stack (suggested)

- **Frontend:** React (or Next.js if you want SSR + API routes)
- **State:** `useReducer` + Context API (Redux Toolkit/Zustand optional stretch goal)
- **Styling:** Tailwind CSS
- **Data:** Static/mock product JSON, or a simple backend (Express + MongoDB) if you want full-stack scope
- **Deployment:** Vercel/Netlify

---

## 4. Basic Features — How Each Should Work

### 4.1 Product Listing Page
**Behavior:**
- Displays a grid of products (image, name, price, rating)
- Supports **filtering** (category, price range) and **sorting** (price low-high, rating, newest)
- Supports **debounced search** (search-as-you-type, but only fires the filter after ~300ms of no typing, to avoid re-filtering on every keystroke)

**Why it matters:** Filtering/sorting state should live in **one place** (e.g., a single `filters` object in state), not scattered across multiple `useState` calls — this is a common interview follow-up ("how did you manage all these filter states together?").

---

### 4.2 Product Detail Page
**Behavior:**
- Shows full product info: images, description, price, stock status, quantity selector
- "Add to Cart" button updates cart state and gives instant visual feedback (e.g., toast notification or cart icon animation)

**Why it matters:** This is where you demonstrate **optimistic UI** — the cart updates immediately, not after waiting on an API response.

---

### 4.3 Cart Management (Add / Remove / Update Quantity)
**Behavior:**
- Cart is a list of `{ productId, quantity, priceAtAddTime }` objects
- Adding a product already in the cart increments quantity, not creates a duplicate entry
- Removing a product removes it fully; decrementing quantity to 0 also removes it
- Cart total recalculates automatically whenever cart state changes

**Why it matters:** This logic is a perfect candidate for `useReducer` because the actions are clear and discrete:
```
ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART, APPLY_DISCOUNT
```
Each dispatched action moves the cart from one well-defined state to another — this predictability is exactly what interviewers want to hear you articulate.

---

### 4.4 Cart Persistence
**Behavior:**
- Cart state is saved to `localStorage` on every change, and rehydrated on page load
- If using a backend: cart is tied to a logged-in user's account instead

**Why it matters:** Shows you understand syncing in-memory state with a persistence layer, and can explain trade-offs (localStorage = simple but device-bound; backend = persistent across devices but needs auth).

---

### 4.5 Checkout Flow
**Behavior:**
- Multi-step: Cart Review → Shipping Info → Payment (mocked) → Order Confirmation
- Validates required fields before allowing progression
- Displays final order summary including discounts applied

**Why it matters:** Multi-step forms are a common real-world UI challenge — you'll want to discuss how you manage step state and validation (e.g., a `currentStep` field in a reducer, or a form library like React Hook Form).

---

## 5. ⭐ Feature Deep Dive: Coupon / Discount Engine (Main Talking Point)

### 5.1 Why This Is Your Differentiator
Most shopping cart clones stop at "add to cart + checkout." A discount engine forces you to reason about **rules, precedence, and edge cases** — this is the closest a frontend project gets to demonstrating actual algorithmic/system design thinking, which is why it's a strong interview topic.

### 5.2 Core Design: Rule-Based Architecture

Model each discount as a **rule object**, not hardcoded if/else logic. This is the single most important design decision — it's what makes the system "extensible."

```js
// Example rule shape
{
  id: "SUMMER10",
  type: "PERCENTAGE",       // PERCENTAGE | FLAT | BOGO | MIN_CART_VALUE
  value: 10,                // 10% off
  condition: {
    minCartValue: 0,
    applicableCategories: ["all"],
  },
  stackable: false,
}
```

**Discount types to implement:**

| Type | Logic |
|---|---|
| **Percentage off** | `total * (1 - value/100)` applied to eligible items |
| **Flat discount** | Fixed amount subtracted, never goes below ₹0 |
| **BOGO (Buy One Get One)** | For every 2 qualifying items, 1 is free — requires sorting items by price and discounting the cheaper of each pair |
| **Min-cart-value discount** | Only activates if cart subtotal ≥ threshold (e.g., "₹500 off on carts over ₹2000") |

### 5.3 The Engine Flow (Pseudocode)

```
function applyDiscounts(cart, activeCoupons, allRules):
  1. Validate each coupon code against allRules (exists? expired? valid category?)
  2. Filter out coupons whose conditions aren't met (e.g. minCartValue not reached)
  3. Determine stacking rules:
     - If a coupon is NOT stackable, it cannot combine with others
     - If multiple non-stackable coupons are applied, pick the one with highest discount OR reject and prompt user
  4. Apply remaining valid discounts in a defined order:
     - BOGO first (works on item level)
     - Then percentage/flat (work on subtotal level)
  5. Recalculate final total
  6. Return { finalTotal, appliedDiscounts, rejectedDiscounts, savings }
```

### 5.4 Edge Cases You Should Explicitly Handle (and explain in interviews)

1. **Two non-stackable coupons applied together** → reject the second, or auto-pick the better one, and tell the user why
2. **Coupon requires min-cart-value, but user removes an item after applying it** → discount should auto-invalidate and notify the user
3. **BOGO with odd number of items** → only full pairs qualify; leftover item is full price
4. **Discount reduces total below ₹0** → clamp at ₹0, never negative
5. **Coupon applies only to specific categories** → items outside that category are excluded from the discount calculation, but still count toward cart total
6. **Expired or invalid coupon code entered** → clear error message, no silent failure
7. **Multiple stackable discounts** → decide and document an explicit **order of operations** (e.g., always BOGO → then flat → then percentage), because order changes the final price

### 5.5 Why This Impresses Interviewers

- It's a **rules engine**, a pattern used in real production systems (pricing, feature flags, permissions)
- It forces **explicit precedence decisions** — a classic system design conversation in miniature
- It's **extensible by design** — adding a new discount type means adding a new rule handler, not rewriting logic
- You can talk about **testing strategy** — this is the part of your project most naturally suited to unit tests (pure functions, clear inputs/outputs), which is a great thing to mention even if you only write a handful

---

## 6. Success Criteria

**Functional success — the project works if:**
- A user can browse, filter, search, add to cart, apply a discount, and complete checkout end-to-end with zero broken states
- Cart state persists correctly across a page refresh
- At least 3 discount types work correctly, including one stacking/rejection scenario

**Technical success — the code is solid if:**
- Cart logic lives in a reducer with clearly named, minimal actions (not scattered `useState`)
- The discount engine is a **pure function** — same inputs always produce same outputs, no side effects, easily testable
- No unnecessary re-renders on typing in search (debounce verified)
- Code is modular enough that adding a 4th discount type takes minutes, not hours

**Resume/interview success — the project has done its job if:**
- You can explain, without looking at the code, why you chose a reducer over multiple `useState`s
- You can walk through 2-3 discount edge cases unprompted and explain your resolution logic
- You can justify at least one trade-off you made (e.g., localStorage vs backend persistence)
- A recruiter or interviewer, after 5 minutes on your live demo, understands what makes this project different from a tutorial clone

---

## 7. Suggested Build Order

1. Product listing + detail pages (static data first)
2. Cart reducer + context (core state management)
3. Cart persistence (localStorage)
4. Discount engine as an isolated, testable module — build and test this **before** wiring it into the UI
5. Checkout flow
6. Polish: skeletons, error boundaries, animations
7. Deploy + write README with architecture decisions (great prep for interview questions)
