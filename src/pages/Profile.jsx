import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { authAPI, addressAPI } from '../services/api'
import { toast } from 'react-hot-toast'
import { User, Mail, Phone, MapPin, Plus, Edit2, Trash2, Check } from 'lucide-react'
import { 
  validateEmail, 
  validatePhone, 
  validatePincode, 
  validateName,
  formatPhone,
  formatPincode,
  formatOnlyLetters 
} from '../utils/validation'

const Profile = () => {
  const { user, setUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  // Address form state
  const [addresses, setAddresses] = useState([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [addressData, setAddressData] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        confirmPassword: '',
      })
      setAddresses(user.addresses || [])
    }
  }, [user])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!validateName(profileData.name)) {
      toast.error('Please enter a valid name (only letters)')
      return
    }

    if (!validateEmail(profileData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (profileData.phone && !validatePhone(profileData.phone)) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }
    
    if (profileData.password && profileData.password !== profileData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (profileData.password && profileData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
      }
      
      if (profileData.password) {
        updateData.password = profileData.password
      }

      const { data } = await authAPI.updateProfile(updateData)
      
      // Update user in context and local storage
      const updatedUser = {
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
        phone: data.phone,
        addresses: data.addresses,
        token: data.token,
      }
      
      setUser(updatedUser)
      localStorage.setItem('userInfo', JSON.stringify(updatedUser))
      
      toast.success('Profile updated successfully')
      setProfileData({ ...profileData, password: '', confirmPassword: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!validateName(addressData.fullName)) {
      toast.error('Please enter a valid name (only letters)')
      return
    }

    if (!validatePhone(addressData.phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    if (!validatePincode(addressData.pincode)) {
      toast.error('Please enter a valid 6-digit pincode')
      return
    }

    if (!addressData.addressLine1 || !addressData.city || !addressData.state) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      let response
      if (editingAddressId) {
        response = await addressAPI.updateAddress(editingAddressId, addressData)
        toast.success('Address updated successfully')
      } else {
        response = await addressAPI.addAddress(addressData)
        toast.success('Address added successfully')
      }

      setAddresses(response.data)
      
      // Update user in context with new addresses
      const updatedUser = { ...user, addresses: response.data }
      setUser(updatedUser)
      localStorage.setItem('userInfo', JSON.stringify(updatedUser))

      resetAddressForm()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save address')
    } finally {
      setLoading(false)
    }
  }

  const handleEditAddress = (address) => {
    setAddressData({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    })
    setEditingAddressId(address._id)
    setShowAddressForm(true)
  }

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return
    }

    setLoading(true)
    try {
      const { data } = await addressAPI.deleteAddress(addressId)
      setAddresses(data)
      
      // Update user in context
      const updatedUser = { ...user, addresses: data }
      setUser(updatedUser)
      localStorage.setItem('userInfo', JSON.stringify(updatedUser))
      
      toast.success('Address deleted successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete address')
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefaultAddress = async (addressId) => {
    setLoading(true)
    try {
      const { data } = await addressAPI.setDefaultAddress(addressId)
      setAddresses(data)
      
      // Update user in context
      const updatedUser = { ...user, addresses: data }
      setUser(updatedUser)
      localStorage.setItem('userInfo', JSON.stringify(updatedUser))
      
      toast.success('Default address updated')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to set default address')
    } finally {
      setLoading(false)
    }
  }

  const resetAddressForm = () => {
    setAddressData({
      fullName: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    })
    setEditingAddressId(null)
    setShowAddressForm(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-4 font-semibold transition-colors ${
            activeTab === 'profile'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-4 px-4 font-semibold transition-colors ${
            activeTab === 'addresses'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Addresses
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card rounded-lg shadow-md p-6 max-w-2xl"
        >
          <h2 className="text-xl font-bold mb-6">Update Profile</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <User size={16} className="inline mr-2" />
                Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Phone size={16} className="inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: formatPhone(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="10-digit phone number"
                maxLength="10"
                pattern="[6-9][0-9]{9}"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter 10-digit mobile number
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Change Password (Optional)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    value={profileData.password}
                    onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {!showAddressForm && (
            <button
              onClick={() => setShowAddressForm(true)}
              className="flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus size={20} />
              <span>Add New Address</span>
            </button>
          )}

          {showAddressForm && (
            <div className="bg-card rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </h2>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={addressData.fullName}
                      onChange={(e) => setAddressData({ ...addressData, fullName: formatOnlyLetters(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      required
                      pattern="[a-zA-Z\s]{2,}"
                      title="Name should contain only letters"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={addressData.phoneNumber}
                      onChange={(e) => setAddressData({ ...addressData, phoneNumber: formatPhone(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      required
                      maxLength="10"
                      pattern="[6-9][0-9]{9}"
                      title="Enter a valid 10-digit phone number starting with 6-9"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address Line 1 *</label>
                  <input
                    type="text"
                    value={addressData.addressLine1}
                    onChange={(e) => setAddressData({ ...addressData, addressLine1: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    placeholder="House No, Building Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address Line 2</label>
                  <input
                    type="text"
                    value={addressData.addressLine2}
                    onChange={(e) => setAddressData({ ...addressData, addressLine2: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    placeholder="Road Name, Area, Colony"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      value={addressData.city}
                      onChange={(e) => setAddressData({ ...addressData, city: formatOnlyLetters(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      required
                      pattern="[a-zA-Z\s]{2,}"
                      title="City name should contain only letters"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <input
                      type="text"
                      value={addressData.state}
                      onChange={(e) => setAddressData({ ...addressData, state: formatOnlyLetters(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      required
                      pattern="[a-zA-Z\s]{2,}"
                      title="State name should contain only letters"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Pincode *</label>
                    <input
                      type="text"
                      value={addressData.pincode}
                      onChange={(e) => setAddressData({ ...addressData, pincode: formatPincode(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      required
                      maxLength="6"
                      pattern="[0-9]{6}"
                      title="Enter a valid 6-digit pincode"
                      placeholder="6-digit pincode"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={addressData.isDefault}
                    onChange={(e) => setAddressData({ ...addressData, isDefault: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isDefault" className="text-sm font-medium">
                    Set as default address
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingAddressId ? 'Update Address' : 'Add Address'}
                  </button>
                  <button
                    type="button"
                    onClick={resetAddressForm}
                    className="px-6 py-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Address List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                <p>No addresses saved yet</p>
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address._id}
                  className={`bg-card rounded-lg shadow-md p-6 relative ${
                    address.isDefault ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  {address.isDefault && (
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full flex items-center space-x-1">
                      <Check size={14} />
                      <span>Default</span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="font-bold text-lg">{address.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{address.phoneNumber}</p>
                  </div>

                  <div className="text-sm space-y-1 mb-4">
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <Edit2 size={16} />
                      <span>Edit</span>
                    </button>
                    
                    {!address.isDefault && (
                      <>
                        <button
                          onClick={() => handleSetDefaultAddress(address._id)}
                          className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                          title="Set as default"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address._id)}
                          className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Profile
