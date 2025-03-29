"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface CartItem {
  id: string | number
  title: string
  price: number
  quantity: number
  image?: string
  variant?: string
}

interface CartContextType {
  items: CartItem[]
  count: number
  total: number
  addItem: (item: CartItem) => void
  removeItem: (id: string | number, variant?: string) => void
  updateQuantity: (id: string | number, quantity: number, variant?: string) => void
  clearCart: () => void
}

// For server components compatibility
const defaultCartContext: CartContextType = {
  items: [],
  count: 0,
  total: 0,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
}

const CartContext = createContext<CartContextType>(defaultCartContext)

export const useCartContext = () => useContext(CartContext)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Sync with local storage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save cart to localStorage", error)
    }
  }, [items])

  const count = items.reduce((acc, item) => acc + item.quantity, 0)
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.variant === item.variant,
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity
        return updatedItems
      } else {
        return [...prevItems, item]
      }
    })
  }

  const removeItem = (id: string | number, variant?: string) => {
    setItems((prevItems) => prevItems.filter((item) => !(item.id === id && item.variant === variant)))
  }

  const updateQuantity = (id: string | number, quantity: number, variant?: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id && item.variant === variant ? { ...item, quantity: quantity } : item)),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

