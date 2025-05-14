import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchCart()
  }, [user, navigate])

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5001/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCartItems(response.data.items)
      setTotalAmount(response.data.totalAmount)
      setLoading(false)
    } catch (error) {
      setError('Failed to fetch cart items')
      setLoading(false)
    }
  }

  const removeFromCart = async (packageId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:5001/api/cart/remove/${packageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCart()
    } catch (error) {
      setError('Failed to remove item from cart')
    }
  }

  const updateQuantity = async (packageId, newQuantity) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `http://localhost:5001/api/cart/update/${packageId}`,
        { quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      fetchCart()
    } catch (error) {
      setError('Failed to update quantity')
    }
  }

  const handleCheckout = () => {
    navigate('/payment')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Your cart is empty</p>
          <button
            onClick={() => navigate('/packages')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Packages
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item.packageId} className="p-6 flex items-center">
                <img
                  src={item.package.image}
                  alt={item.package.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.package.name}
                  </h3>
                  <p className="text-sm text-gray-500">{item.package.duration}</p>
                  <div className="mt-2">
                    <span className="text-sm font-medium text-gray-900">
                      Features:
                    </span>
                    <ul className="mt-1 text-sm text-gray-500">
                      {item.package.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="ml-6 flex items-center space-x-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item.packageId, Math.max(1, item.quantity - 1))}
                      className="bg-gray-200 px-3 py-1 rounded-l"
                    >
                      -
                    </button>
                    <span className="bg-gray-100 px-4 py-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.packageId, item.quantity + 1)}
                      className="bg-gray-200 px-3 py-1 rounded-r"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      ₹{item.package.price * item.quantity}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.packageId)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium text-gray-900">Total</p>
                <p className="text-sm text-gray-500">Including all taxes</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{totalAmount}
              </p>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart 