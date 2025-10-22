import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { productAPI } from '../services/api'
import { toast } from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { ArrowLeft, ShoppingCart, Heart } from 'lucide-react'

const ProductDetails = () => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [wishlist, setWishlist] = useState(false)

  const { id } = useParams()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productAPI.getProduct(id)
        setProduct(data)
      } catch (error) {
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, qty)
    toast.success('Added to cart!')
  }

  const handleWishlist = () => {
    setWishlist(!wishlist)
    toast.success(wishlist ? 'Removed from wishlist' : 'Added to wishlist')
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-32 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">Product not found</p>
        <Link to="/products" className="text-primary hover:underline">
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <Link
        to="/products"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <img
            src={product.image}
            alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg img-zoom tilt-hover"
          />
          {product.ecoFriendly && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Eco-Friendly
            </span>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{product.category}</p>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-primary">
              ₹{product.price}
            </span>
            <button
              onClick={handleWishlist}
              className={`p-3 rounded-full border-2 transition-colors ${
                wishlist
                  ? 'bg-red-100 border-red-300 text-red-600'
                  : 'border-muted hover:border-primary'
              }`}
            >
              <Heart size={20} fill={wishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

            <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="qty" className="font-medium">
                Quantity:
              </label>
              <select
                id="qty"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="px-3 py-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover-lift"
            >
              <ShoppingCart size={20} />
              <span>
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </span>
            </button>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Category: {product.category}</li>
              <li>In Stock: {product.countInStock} units</li>
              {product.ecoFriendly && <li>✓ Eco-friendly product</li>}
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ProductDetails