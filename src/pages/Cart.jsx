import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'

const Cart = () => {
  const { cartItems, removeFromCart, updateCartQty, getCartTotal, clearCart } = useCart()

  const handleQtyChange = (id, newQty) => {
    if (newQty < 1) return
    updateCartQty(id, newQty)
  }

  const handleRemoveItem = (id) => {
    removeFromCart(id)
  }

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16"
      >
        <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">
          Add some sustainable products to your cart and start making a difference!
        </p>
        <Link
          to="/products"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card rounded-lg shadow-md p-6"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <Link
                    to={`/products/${item._id}`}
                    className="text-lg font-semibold hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-muted-foreground">{item.category}</p>
                  <p className="text-primary font-bold">₹{item.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQtyChange(item._id, item.qty - 1)}
                    className="p-1 rounded hover:bg-muted"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{item.qty}</span>
                  <button
                    onClick={() => handleQtyChange(item._id, item.qty + 1)}
                    className="p-1 rounded hover:bg-muted"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{item.price * item.qty}</p>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-destructive hover:text-destructive/80 mt-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-lg shadow-md p-6 sticky top-4"
          >
            <h2 className="text-xl font-bold mb-4">Cart Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                <span>₹{getCartTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{Math.round(getCartTotal() * 0.18)}</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{getCartTotal() + Math.round(getCartTotal() * 0.18)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/checkout"
                className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors text-center block font-semibold"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={clearCart}
                className="w-full bg-destructive text-destructive-foreground py-2 px-4 rounded hover:bg-destructive/90 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                🌱 By shopping here, you're supporting sustainable products and contributing to a better world!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Cart