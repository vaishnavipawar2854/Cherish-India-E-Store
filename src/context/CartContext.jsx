import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const cartItemsFromStorage = localStorage.getItem('cartItems')
    if (cartItemsFromStorage) {
      setCartItems(JSON.parse(cartItemsFromStorage))
    }
  }, [])

  const addToCart = (product, qty = 1) => {
    const existItem = cartItems.find((x) => x._id === product._id)

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x._id === existItem._id ? { ...x, qty: x.qty + qty } : x
        )
      )
    } else {
      setCartItems([...cartItems, { ...product, qty }])
    }
  }

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id))
  }

  const updateCartQty = (id, qty) => {
    setCartItems(
      cartItems.map((x) => (x._id === id ? { ...x, qty: Number(qty) } : x))
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.qty, 0)
  }

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    getCartTotal,
    getCartCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}