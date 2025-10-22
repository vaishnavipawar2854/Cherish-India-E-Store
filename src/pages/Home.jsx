import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { productAPI } from '../services/api'
import { toast } from 'react-hot-toast'
import { useCart } from '../context/CartContext'

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productAPI.getProducts()
        setProducts(data.slice(0, 6)) // Show first 6 products
      } catch (error) {
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product) => {
    addToCart(product)
    toast.success('Added to cart!')
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-16 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg tilt-hover"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            CherishIndia E-Store
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Self Goodness : Better World
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Discover eco-friendly products that make a difference. Shop sustainably and contribute to a better world.
          </p>
          <Link
            to="/products"
            className="inline-block bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors btn-accent hover-lift"
          >
            Shop Now
          </Link>
        </div>
      </motion.section>

      {/* Featured Products */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated selection of sustainable products designed for conscious living.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-card rounded-lg shadow-md p-6 animate-pulse">
                <div className="w-full h-48 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow card-animate"
                >
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                      className="w-full h-48 object-cover img-zoom"
                  />
                </Link>
                <div className="p-6">
                  <Link to={`/products/${product._id}`}>
                    <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ₹{product.price}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                  {product.ecoFriendly && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Eco-Friendly
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            to="/products"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            View All Products
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

export default Home