import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchTransactions()
  }, [user, navigate])

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('No authentication token found')
        setLoading(false)
        return
      }

      // Mock transactions data
      const mockTransactions = [
        {
          id: '1',
          package: {
            id: '1',
            name: 'Luxury Beach Villa',
            price: 8999,
            duration: '3 days',
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60'
          },
          status: 'completed',
          checkIn: '2024-01-15',
          checkOut: '2024-01-18',
          guests: 2,
          totalAmount: 26997,
          paymentMethod: 'Credit Card'
        },
        {
          id: '2',
          package: {
            id: '2',
            name: 'Mountain View Suite',
            price: 4999,
            duration: '2 days',
            image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=60'
          },
          status: 'completed',
          checkIn: '2024-02-01',
          checkOut: '2024-02-03',
          guests: 2,
          totalAmount: 9998,
          paymentMethod: 'Debit Card'
        },
        {
          id: '3',
          package: {
            id: '3',
            name: 'Heritage Palace Suite',
            price: 12999,
            duration: '3 days',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60'
          },
          status: 'completed',
          checkIn: '2024-02-20',
          checkOut: '2024-02-23',
          guests: 4,
          totalAmount: 38997,
          paymentMethod: 'UPI'
        },
        {
          id: '4',
          package: {
            id: '4',
            name: 'Treehouse Retreat',
            price: 3499,
            duration: '2 days',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60'
          },
          status: 'cancelled',
          checkIn: '2024-03-05',
          checkOut: '2024-03-07',
          guests: 3,
          totalAmount: 10497,
          paymentMethod: 'Net Banking'
        },
        {
          id: '5',
          package: {
            id: '5',
            name: 'Modern City Apartment',
            price: 2999,
            duration: '1 day',
            image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=60'
          },
          status: 'upcoming',
          checkIn: '2024-03-15',
          checkOut: '2024-03-16',
          guests: 1,
          totalAmount: 2999,
          paymentMethod: 'UPI'
        },
        {
          id: '6',
          package: {
            id: '6',
            name: 'Desert Camp',
            price: 5999,
            duration: '2 days',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60'
          },
          status: 'upcoming',
          checkIn: '2024-04-15',
          checkOut: '2024-04-17',
          guests: 4,
          totalAmount: 23996,
          paymentMethod: 'Credit Card'
        },
        {
          id: '7',
          package: {
            id: '7',
            name: 'Lakeside Cottage',
            price: 4499,
            duration: '2 days',
            image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=60'
          },
          status: 'cancelled',
          checkIn: '2024-03-01',
          checkOut: '2024-03-03',
          guests: 2,
          totalAmount: 8998,
          paymentMethod: 'Debit Card'
        },
        {
          id: '8',
          package: {
            id: '8',
            name: 'Floating Houseboat',
            price: 7999,
            duration: '2 days',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60'
          },
          status: 'upcoming',
          checkIn: '2024-05-20',
          checkOut: '2024-05-22',
          guests: 6,
          totalAmount: 47994,
          paymentMethod: 'Credit Card'
        },
        {
          id: '9',
          package: {
            id: '9',
            name: 'Hill Station Villa',
            price: 6999,
            duration: '3 days',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60'
          },
          status: 'upcoming',
          checkIn: '2024-06-20',
          checkOut: '2024-06-23',
          guests: 4,
          totalAmount: 27996,
          paymentMethod: 'Net Banking'
        },
        {
          id: '10',
          package: {
            id: '10',
            name: 'Beachside Bungalow',
            price: 5499,
            duration: '2 days',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60'
          },
          status: 'upcoming',
          checkIn: '2024-07-01',
          checkOut: '2024-07-03',
          guests: 2,
          totalAmount: 10998,
          paymentMethod: 'UPI'
        }
      ];

      setTransactions(mockTransactions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Past Transactions</h1>
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No transactions found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {transaction.package.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Booking ID: {transaction.id}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    transaction.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : transaction.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Check-in</p>
                    <p className="font-medium">{formatDate(transaction.checkIn)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Check-out</p>
                    <p className="font-medium">{formatDate(transaction.checkOut)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Guests</p>
                    <p className="font-medium">{transaction.guests} people</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{transaction.totalAmount}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium">{transaction.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions 