import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import { CheckCircle, CreditCard, Truck, MapPin, Plus, AlertCircle } from 'lucide-react'
import { orderAPI, authAPI } from '../services/api'
import { 
  validateCardNumber, 
  validateCVV, 
  validateExpiryDate, 
  validateUPI, 
  formatCardNumber, 
  formatExpiryDate, 
  formatCVV 
} from '../utils/validation'

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [processing, setProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(true)

  // Card payment details
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  })

  // UPI details
  const [upiId, setUpiId] = useState('')

  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const tax = Math.round(getCartTotal() * 0.18)
  const total = getCartTotal() + tax

  useEffect(() => {
    if (!user) {
      toast.error('Please login to place an order')
      navigate('/login?redirect=/checkout')
      return
    }

    // Fetch user's addresses
    const fetchAddresses = async () => {
      try {
        const { data } = await authAPI.getProfile()
        setAddresses(data.addresses || [])
        
        // Auto-select default address
        const defaultAddress = data.addresses?.find(addr => addr.isDefault)
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id)
        }
      } catch (error) {
        toast.error('Failed to load addresses')
      } finally {
        setLoadingAddresses(false)
      }
    }

    fetchAddresses()
  }, [user, navigate])

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login to place an order')
      navigate('/login?redirect=/checkout')
      return
    }

    // Check if address is selected
    if (!selectedAddressId) {
      toast.error('Please select a delivery address')
      return
    }

    // Validate payment method specific details
    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
        toast.error('Please fill in all card details')
        return
      }
      if (!validateCardNumber(cardDetails.cardNumber)) {
        toast.error('Please enter a valid 16-digit card number')
        return
      }
      if (!validateCVV(cardDetails.cvv)) {
        toast.error('Please enter a valid 3-digit CVV')
        return
      }
      if (!validateExpiryDate(cardDetails.expiryDate)) {
        toast.error('Please enter a valid expiry date (MM/YY) that is not expired')
        return
      }
    }

    if (paymentMethod === 'upi') {
      if (!validateUPI(upiId)) {
        toast.error('Please enter a valid UPI ID (e.g., name@upi)')
        return
      }
    }

    setProcessing(true)

    try {
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      }))

      // Get the selected address
      const selectedAddress = addresses.find(addr => addr._id === selectedAddressId)

      const orderData = {
        orderItems,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          phoneNumber: selectedAddress.phoneNumber,
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
        },
        paymentMethod,
        itemsPrice: getCartTotal(),
        taxPrice: tax,
        totalPrice: total,
      }

      const { data } = await orderAPI.createOrder(orderData)

      setOrderPlaced(true)
      clearCart()
      toast.success('Order placed successfully!')
      setProcessing(false)
      // redirect to orders/history page
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
      setProcessing(false)
    }
  }

  if (orderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center py-16"
      >
        <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for shopping with CherishIndia. Your order has been placed and will be processed soon.
        </p>
        <div className="bg-card rounded-lg p-6 mb-8">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Items Total:</span>
              <span>₹{getCartTotal()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
        </button>
      </motion.div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">Your cart is empty</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded hover:bg-primary/90 transition-colors"
        >
          Shop Now
        </button>
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
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* No Address Warning */}
      {!loadingAddresses && addresses.length === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-yellow-600 dark:text-yellow-400 mt-0.5" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                No Delivery Address Found
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                You need to add a delivery address before placing an order.
              </p>
              <Link
                to="/profile"
                className="inline-flex items-center space-x-2 bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <Plus size={18} />
                <span>Add Address</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Delivery Address Selection */}
          <div className="bg-card rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <MapPin size={20} />
                <span>Delivery Address</span>
              </h2>
              <Link
                to="/profile"
                className="text-primary hover:underline text-sm flex items-center space-x-1"
              >
                <Plus size={16} />
                <span>Add New</span>
              </Link>
            </div>

            {loadingAddresses ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>No addresses available. Please add a delivery address.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address._id}
                    className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAddressId === address._id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selectedAddressId === address._id}
                        onChange={() => setSelectedAddressId(address._id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold">{address.fullName}</span>
                          {address.isDefault && (
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{address.phoneNumber}</p>
                        <p className="text-sm mt-2">
                          {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.qty} × ₹{item.price}
                    </p>
                  </div>
                  <span className="font-bold">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="space-y-4">
              {/* Cash on Delivery */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary"
                  />
                  <span className="font-medium">Cash on Delivery</span>
                </label>
              </div>

              {/* Credit/Debit Card */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary"
                  />
                  <span className="font-medium">Credit/Debit Card</span>
                </label>

                {/* Card Details Form */}
                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 ml-7 space-y-3 p-4 bg-muted/30 rounded-lg"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={(e) => {
                          setCardDetails({ ...cardDetails, cardNumber: formatCardNumber(e.target.value) })
                        }}
                        maxLength="19"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        required={paymentMethod === 'card'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="JOHN DOE"
                        value={cardDetails.cardName}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        required={paymentMethod === 'card'}
                        pattern="[A-Z\s]{2,}"
                        title="Name should contain only letters"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiryDate}
                          onChange={(e) => {
                            setCardDetails({ ...cardDetails, expiryDate: formatExpiryDate(e.target.value) })
                          }}
                          maxLength="5"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                          required={paymentMethod === 'card'}
                          pattern="(0[1-9]|1[0-2])\/\d{2}"
                          title="Enter expiry in MM/YY format"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">CVV</label>
                        <input
                          type="password"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => {
                            setCardDetails({ ...cardDetails, cvv: formatCVV(e.target.value) })
                          }}
                          maxLength="3"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                          required={paymentMethod === 'card'}
                          pattern="[0-9]{3}"
                          title="Enter 3-digit CVV"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2">
                      🔒 Your card details are secure and encrypted
                    </p>
                  </motion.div>
                )}
              </div>

              {/* UPI */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary"
                  />
                  <span className="font-medium">UPI</span>
                </label>

                {/* UPI ID Form */}
                {paymentMethod === 'upi' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 ml-7 space-y-3 p-4 bg-muted/30 rounded-lg"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-1">UPI ID</label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        required={paymentMethod === 'upi'}
                        pattern="[\w.-]+@[\w.-]+"
                        title="Enter valid UPI ID (e.g., name@upi)"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Enter your UPI ID (e.g., 9876543210@paytm, username@googlepay)
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Total & Place Order */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Total</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{getCartTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%):</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Truck size={20} className="text-green-600" />
              <span className="font-semibold text-green-800 dark:text-green-200">
                Free Shipping
              </span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Enjoy free shipping on all orders. Delivery within 3-5 business days.
            </p>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={processing || !selectedAddressId || addresses.length === 0}
            className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <CreditCard size={20} />
                <span>Place Order - ₹{total}</span>
              </>
            )}
          </button>

          {addresses.length === 0 && (
            <p className="text-xs text-red-500 text-center">
              Please add a delivery address to proceed
            </p>
          )}

          <p className="text-xs text-muted-foreground text-center">
            By placing your order, you agree to our terms and conditions.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default Checkout