import { getSalePrice } from '../data/products.js'

export const CART_STORAGE_KEY = 'shopcart-v1'

export const initialFilters = {
  search: '',
  category: 'All',
  maxPrice: 16000,
  sortBy: 'newest'
}

export const initialCartState = {
  items: [],
  appliedCoupons: [],
  filters: initialFilters,
  toast: null
}

const toCartItem = (product, quantity = 1) => ({
  productId: product.id,
  quantity,
  priceAtAddTime: getSalePrice(product),
  id: product.id,
  img: product.img,
  name: product.name,
  category: product.category,
  color: product.color,
  size: product.size,
  originalPrice: product.originalPrice,
  discountPercent: product.discountPercent,
  rating: product.rating,
  stock: product.stock
})

export function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        items: action.payload.items || [],
        appliedCoupons: action.payload.appliedCoupons || [],
        filters: { ...initialFilters, ...(action.payload.filters || {}) }
      }

    case 'ADD_ITEM': {
      const product = action.payload
      const quantityToAdd = Number(action.quantity || 1)
      const existing = state.items.find((item) => item.productId === product.id)

      const items = existing
        ? state.items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantityToAdd, product.stock || 99) }
              : item
          )
        : [...state.items, toCartItem(product, quantityToAdd)]

      return {
        ...state,
        items,
        toast: `${product.name} added to cart`
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.payload)
      }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.productId !== productId)
        }
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      }
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        appliedCoupons: []
      }

    case 'APPLY_DISCOUNT':
      return {
        ...state,
        appliedCoupons: action.payload
      }

    case 'REMOVE_DISCOUNT':
      return {
        ...state,
        appliedCoupons: state.appliedCoupons.filter((code) => code !== action.payload)
      }

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      }

    case 'SET_TOAST':
      return {
        ...state,
        toast: action.payload
      }

    default:
      return state
  }
}

export function loadPersistedCart() {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function persistCart(state) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify({
      items: state.items,
      appliedCoupons: state.appliedCoupons
    })
  )
}
