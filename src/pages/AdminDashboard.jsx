import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { productAPI } from '../services/api'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Upload } from 'lucide-react'

const AdminDashboard = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    countInStock: '',
    ecoFriendly: false,
  })

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/')
      return
    }

    fetchProducts()
  }, [user, navigate])

  const fetchProducts = async () => {
    try {
      const { data } = await productAPI.getProducts()
      setProducts(data)
      // derive unique categories from products
      const unique = Array.from(new Set(data.map((p) => p.category).filter(Boolean)))
      setCategories(unique)
    } catch (error) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // If admin is in add-new-category flow and didn't click Save, use newCategory
      const payload = { ...formData }
      if (addingCategory && newCategory.trim()) {
        payload.category = newCategory.trim()
        // add to categories list optimistically
        setCategories((prev) => Array.from(new Set([newCategory.trim(), ...prev])))
      }

      if (editingProduct) {
        await productAPI.updateProduct(editingProduct._id, payload)
        toast.success('Product updated successfully')
      } else {
        await productAPI.createProduct(payload)
        toast.success('Product created successfully')
      }
      fetchProducts()
      resetForm()
    } catch (error) {
      toast.error('Failed to save product')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      countInStock: product.countInStock,
      ecoFriendly: product.ecoFriendly,
    })
    // ensure category exists in list so select shows it
    if (product.category && !categories.includes(product.category)) {
      setCategories((prev) => Array.from(new Set([product.category, ...prev])))
    }
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(id)
        toast.success('Product deleted successfully')
        fetchProducts()
      } catch (error) {
        toast.error('Failed to delete product')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      countInStock: '',
      ecoFriendly: false,
    })
    setEditingProduct(null)
    setAddingCategory(false)
    setNewCategory('')
    setShowForm(false)
  }

  if (!user || !user.isAdmin) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-card rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-bold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                {!addingCategory ? (
                  <div className="flex items-center space-x-2">
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const val = e.target.value
                        if (val === '__add_new') {
                          setAddingCategory(true)
                          setNewCategory('')
                          setFormData({ ...formData, category: '' })
                        } else {
                          setFormData({ ...formData, category: val })
                        }
                      }}
                      className="w-full px-3 py-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="__add_new">+ Add new category</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        setAddingCategory(true)
                        setNewCategory('')
                        setFormData({ ...formData, category: '' })
                      }}
                      className="px-3 py-2 bg-muted text-muted-foreground rounded"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="New category"
                      className="w-full px-3 py-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCategory.trim()) {
                          setFormData({ ...formData, category: newCategory.trim() })
                          // optimistically add to categories for immediate selection
                          setCategories((prev) => Array.from(new Set([newCategory.trim(), ...prev])))
                          setAddingCategory(false)
                        } else {
                          toast.error('Please enter a category name')
                        }
                      }}
                      className="px-3 py-2 bg-primary text-primary-foreground rounded"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAddingCategory(false)
                        setNewCategory('')
                      }}
                      className="px-3 py-2 bg-muted text-muted-foreground rounded"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Stock Count</label>
                <input
                  type="number"
                  value={formData.countInStock}
                  onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ecoFriendly"
                  checked={formData.ecoFriendly}
                  onChange={(e) => setFormData({ ...formData, ecoFriendly: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="ecoFriendly" className="text-sm font-medium">
                  Eco-Friendly
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-2 rounded hover:bg-primary/90 transition-colors"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-muted text-muted-foreground px-6 py-2 rounded hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Products List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-card rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {product.countInStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-primary hover:text-primary/80"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default AdminDashboard