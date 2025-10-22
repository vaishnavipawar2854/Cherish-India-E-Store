import React, { useEffect, useState } from 'react'
import { orderAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { MapPin, Package } from 'lucide-react'

const Orders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = user && user.isAdmin ? await orderAPI.getAllOrders() : await orderAPI.getMyOrders()
        setOrders(data)
      } catch (err) {
        toast.error('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchOrders()

  }, [user])

  const handleUpdateStatus = async (orderId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this order?`)) return
    try {
      const { data } = await orderAPI.updateOrderStatus(orderId, { status })
      // Update local list
      setOrders((prev) => prev.map((o) => (o._id === data._id ? data : o)))
      toast.success(`Order ${status}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order')
    }
  }

  if (!user) return <p className="text-center">Please login to view your orders.</p>

  return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Orders { orders.length === 0 ? (loading) : (<i> {orders.length}</i>)}</h1> 
      {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">You have no orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-card p-6 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row md:justify-between mb-4 border-b pb-4">
                <div>
                  <div className="font-semibold text-lg">Order ID: {order._id}</div>
                  <div className="text-sm text-muted-foreground">Placed: {new Date(order.createdAt).toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground mt-1">Payment: {order.paymentMethod.toUpperCase()}</div>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <div className="font-bold text-xl text-primary">₹{order.totalPrice}</div>
                  <div className="text-sm text-muted-foreground">Items: {order.orderItems.length}</div>
                      <div className={`text-sm font-semibold mt-1 ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.isPaid ? 'Paid' : 'Pending Payment'}
                      </div>
                      <div className={`text-sm font-semibold mt-1 ${order.status === 'approved' ? 'text-green-600' : order.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {order.status?.toUpperCase()}
                      </div>
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <MapPin size={18} className="text-primary mt-1" />
                    <div>
                      <div className="font-semibold mb-1">Delivery Address</div>
                      <div className="text-sm">
                        <div>{order.shippingAddress.fullName}</div>
                        <div>{order.shippingAddress.phoneNumber}</div>
                        <div className="mt-1">
                          {order.shippingAddress.addressLine1}
                          {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                        </div>
                        <div>
                          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="mt-4">
                <div className="font-semibold mb-3">Order Items</div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {order.orderItems.map((it) => (
                    <div key={it.product} className="border p-3 rounded-lg hover:shadow-md transition-shadow">
                      <img src={it.image} alt={it.name} className="w-full h-32 object-cover rounded mb-2" />
                      <div className="text-sm font-medium line-clamp-2">{it.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">Qty: {it.qty}</div>
                      <div className="text-sm font-semibold text-primary">₹{it.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-end">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between space-x-8">
                      <span className="text-muted-foreground">Items Price:</span>
                      <span className="font-semibold">₹{order.itemsPrice}</span>
                    </div>
                    <div className="flex justify-between space-x-8">
                      <span className="text-muted-foreground">Tax:</span>
                      <span className="font-semibold">₹{order.taxPrice}</span>
                    </div>
                    <div className="flex justify-between space-x-8 text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-primary">₹{order.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Admin actions */}
              {user?.isAdmin && (
                <div className="mt-4 flex items-center justify-end space-x-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'approved')}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'rejected')}
                        className="bg-destructive text-destructive-foreground px-4 py-2 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {order.status !== 'pending' && (
                    <div className="text-sm text-muted-foreground">Processed by: {order.processedBy?.name || order.processedBy || '—'} at {order.processedAt ? new Date(order.processedAt).toLocaleString() : '—'}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}


export default Orders
