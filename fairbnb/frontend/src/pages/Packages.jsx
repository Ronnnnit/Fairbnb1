import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Packages = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPeople, setSelectedPeople] = useState({})
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/packages')
      setPackages(response.data)
      // Initialize selectedPeople for each package
      const initialPeople = {}
      response.data.forEach(pkg => {
        initialPeople[pkg.id] = pkg.capacity.min
      })
      setSelectedPeople(initialPeople)
    } catch (err) {
      setError('Failed to fetch packages')
      console.error('Error fetching packages:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePeopleChange = (packageId, value) => {
    setSelectedPeople(prev => ({
      ...prev,
      [packageId]: value
    }))
  }

  const addToCart = async (packageId) => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      const response = await axios.post(
        'http://localhost:5001/api/cart/add',
        {
          packageId,
          quantity: selectedPeople[packageId]
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      alert('Package added to cart successfully!')
    } catch (err) {
      console.error('Error adding to cart:', err)
      alert('Failed to add package to cart')
    }
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Packages</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={pkg.image}
              alt={pkg.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {pkg.name}
              </h2>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-900">Features:</span>
                <ul className="mt-1 text-sm text-gray-500">
                  {pkg.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Number of People:
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => handlePeopleChange(pkg.id, Math.max(pkg.capacity.min, selectedPeople[pkg.id] - 1))}
                    className="bg-gray-200 px-3 py-1 rounded-l"
                    disabled={selectedPeople[pkg.id] <= pkg.capacity.min}
                  >
                    -
                  </button>
                  <span className="bg-gray-100 px-4 py-1">
                    {selectedPeople[pkg.id]}
                  </span>
                  <button
                    onClick={() => handlePeopleChange(pkg.id, Math.min(pkg.capacity.max, selectedPeople[pkg.id] + 1))}
                    className="bg-gray-200 px-3 py-1 rounded-r"
                    disabled={selectedPeople[pkg.id] >= pkg.capacity.max}
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Capacity: {pkg.capacity.min} - {pkg.capacity.max} people
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-blue-600">₹{pkg.price}</span>
                  <span className="text-gray-500"> / {pkg.duration}</span>
                </div>
                <button
                  onClick={() => addToCart(pkg.id)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Packages 