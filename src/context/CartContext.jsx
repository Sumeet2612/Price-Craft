import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { applyCoupon, applyDiscounts, calculateSubtotal } from '../utils/discountEngine'
import {
  cartReducer,
  initialCartState,
  loadPersistedCart,
  persistCart
} from './cartReducer'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const persisted = loadPersistedCart()
    if (persisted) {
      dispatch({ type: 'HYDRATE', payload: persisted })
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    persistCart(state)
  }, [ready, state.items, state.appliedCoupons])

  const discountSummary = useMemo(
    () => applyDiscounts(state.items, state.appliedCoupons),
    [state.items, state.appliedCoupons]
  )

  useEffect(() => {
    if (!ready) return
    if (discountSummary.appliedCoupons.join('|') === state.appliedCoupons.join('|')) return
    if (!state.appliedCoupons.length) return

    dispatch({ type: 'APPLY_DISCOUNT', payload: discountSummary.appliedCoupons })
  }, [discountSummary.appliedCoupons, ready, state.appliedCoupons])

  const subtotal = useMemo(() => calculateSubtotal(state.items), [state.items])
  const itemCount = useMemo(
    () => state.items.reduce((total, item) => total + item.quantity, 0),
    [state.items]
  )

  const addItem = useCallback((product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: product, quantity })
  }, [])

  const removeItem = useCallback((productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }, [])

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [])

  const applyCartCoupon = useCallback((couponCode) => {
    const result = applyCoupon(
      state.items,
      calculateSubtotal(state.items),
      couponCode,
      applyDiscounts(state.items, state.appliedCoupons).appliedCoupons
    )

    if (result.success) {
      dispatch({ type: 'APPLY_DISCOUNT', payload: result.appliedCoupons })
    }

    return result
  }, [state.appliedCoupons, state.items])

  const removeCoupon = useCallback((code) => {
    dispatch({ type: 'REMOVE_DISCOUNT', payload: code })
  }, [])

  const setFilters = useCallback((partial) => {
    dispatch({ type: 'SET_FILTERS', payload: partial })
  }, [])

  const setToast = useCallback((message) => {
    dispatch({ type: 'SET_TOAST', payload: message })
  }, [])

  const value = {
    items: state.items,
    appliedCoupons: discountSummary.appliedCoupons,
    requestedCoupons: state.appliedCoupons,
    filters: state.filters,
    toast: state.toast,
    rejectedDiscounts: discountSummary.rejectedDiscounts,
    discountSummary,
    subtotal,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCartCoupon,
    removeCoupon,
    setFilters,
    setToast
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}
