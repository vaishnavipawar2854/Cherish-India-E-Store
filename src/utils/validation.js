// Validation utility functions

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  // Indian phone number: 10 digits
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\s+/g, ''))
}

export const validatePincode = (pincode) => {
  // Indian pincode: 6 digits
  const pincodeRegex = /^\d{6}$/
  return pincodeRegex.test(pincode)
}

export const validatePassword = (password) => {
  // At least 6 characters
  return password.length >= 8
}

export const validateName = (name) => {
  // Only letters and spaces, at least 2 characters
  const nameRegex = /^[a-zA-Z\s]{2,}$/
  return nameRegex.test(name)
}

export const validateCardNumber = (cardNumber) => {
  // 16 digits
  const cleaned = cardNumber.replace(/\s+/g, '')
  return /^\d{16}$/.test(cleaned)
}

export const validateCVV = (cvv) => {
  // 3 or 4 digits
  return /^\d{3,4}$/.test(cvv)
}

export const validateExpiryDate = (expiry) => {
  // MM/YY format
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
  if (!expiryRegex.test(expiry)) return false
  
  const [month, year] = expiry.split('/')
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1
  
  const expiryYear = parseInt(year, 10)
  const expiryMonth = parseInt(month, 10)
  
  if (expiryYear < currentYear) return false
  if (expiryYear === currentYear && expiryMonth < currentMonth) return false
  
  return true
}

export const validateUPI = (upiId) => {
  // Format: username@provider
  const upiRegex = /^[\w.-]+@[\w.-]+$/
  return upiRegex.test(upiId)
}

// Format helpers
export const formatCardNumber = (value) => {
  const cleaned = value.replace(/\s+/g, '').replace(/\D/g, '')
  const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
  return formatted.substring(0, 19) // Max 16 digits + 3 spaces
}

export const formatExpiryDate = (value) => {
  let cleaned = value.replace(/\D/g, '')
  if (cleaned.length >= 2) {
    cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
  }
  return cleaned.substring(0, 5)
}

export const formatPhone = (value) => {
  const cleaned = value.replace(/\D/g, '')
  return cleaned.substring(0, 10)
}

export const formatPincode = (value) => {
  const cleaned = value.replace(/\D/g, '')
  return cleaned.substring(0, 6)
}

export const formatCVV = (value) => {
  const cleaned = value.replace(/\D/g, '')
  return cleaned.substring(0, 3)
}

export const formatOnlyLetters = (value) => {
  return value.replace(/[^a-zA-Z\s]/g, '')
}

export const formatOnlyNumbers = (value) => {
  return value.replace(/\D/g, '')
}

export const formatAlphanumeric = (value) => {
  return value.replace(/[^a-zA-Z0-9\s]/g, '')
}
