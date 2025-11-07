import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { cartService } from '../services/cartService'
import { useAuth } from './AuthContext'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_CART':
      return { 
        ...state, 
        cart: action.payload, 
        loading: false, 
        error: null,
        itemCount: action.payload?.items?.length || 0
      }
    case 'ADD_TO_CART_SUCCESS':
      return { 
        ...state, 
        cart: action.payload, 
        loading: false, 
        error: null,
        itemCount: action.payload?.items?.length || 0
      }
    case 'UPDATE_CART_SUCCESS':
      return { 
        ...state, 
        cart: action.payload, 
        loading: false, 
        error: null,
        itemCount: action.payload?.items?.length || 0
      }
    case 'REMOVE_FROM_CART_SUCCESS':
      return { 
        ...state, 
        cart: action.payload, 
        loading: false, 
        error: null,
        itemCount: action.payload?.items?.length || 0
      }
    case 'CLEAR_CART_SUCCESS':
      return { 
        ...state, 
        cart: { items: [], subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0 }, 
        loading: false, 
        error: null,
        itemCount: 0
      }
    case 'APPLY_DISCOUNT_SUCCESS':
      return { 
        ...state, 
        cart: action.payload, 
        loading: false, 
        error: null
      }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

const initialState = {
  cart: {
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0
  },
  loading: false,
  error: null,
  itemCount: 0
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  
  // Define loadCart function first
  const loadCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await cartService.getCart()
      dispatch({ type: 'SET_CART', payload: response.data.cart })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }, [])
  
  // Safely get auth context
  let isAuthenticated = false
  let user = null
  try {
    const authContext = useAuth()
    isAuthenticated = authContext?.isAuthenticated || false
    user = authContext?.user || null
  } catch (error) {
    // Auth context not available yet, use default values
    isAuthenticated = false
    user = null
  }

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart()
    } else {
      // Clear cart when user logs out
      dispatch({ type: 'CLEAR_CART_SUCCESS' })
    }
  }, [isAuthenticated, user, loadCart])

  const addToCart = async (productIdOrCartData, customization, quantity = 1, totalPrice = 0) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Check if first parameter is cartData object (from HairCustomization) or productId (from ProductDetail)
      let cartData
      if (typeof productIdOrCartData === 'object' && productIdOrCartData.isCustomHairSystem) {
        // HairCustomization case - productIdOrCartData is actually cartData
        cartData = productIdOrCartData
      } else {
        // ProductDetail case - format the data using cartService
        cartData = cartService.formatCartData(productIdOrCartData, customization, quantity, totalPrice)
      }
      
      const response = await cartService.addToCart(cartData)
      dispatch({ type: 'ADD_TO_CART_SUCCESS', payload: response.data.cart })
      return response
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await cartService.updateCartItem(itemId, quantity)
      dispatch({ type: 'UPDATE_CART_SUCCESS', payload: response.data.cart })
      return response
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await cartService.removeFromCart(itemId)
      dispatch({ type: 'REMOVE_FROM_CART_SUCCESS', payload: response.data.cart })
      return response
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await cartService.clearCart()
      dispatch({ type: 'CLEAR_CART_SUCCESS', payload: response.data.cart })
      return response
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const applyDiscount = async (discountCode) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await cartService.applyDiscount(discountCode)
      dispatch({ type: 'APPLY_DISCOUNT_SUCCESS', payload: response.data.cart })
      return response
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const refreshCart = useCallback(async () => {
    if (isAuthenticated && user) {
      await loadCart()
    }
  }, [isAuthenticated, user, loadCart])

  const value = {
    ...state,
    loadCart,
    refreshCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyDiscount,
    clearError
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider. Make sure your component is wrapped with CartProvider in main.jsx')
  }
  return context
}
