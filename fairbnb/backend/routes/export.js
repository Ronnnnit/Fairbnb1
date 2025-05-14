const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const User = require('../models/User');
const Cart = require('../models/Cart');

// Get all data for chatbot training
router.get('/chatbot-data', async (req, res) => {
  try {
    // Get all packages
    const packages = await Package.find({});
    
    // Get all users (excluding sensitive data)
    const users = await User.find({}, '-password');
    
    // Get all carts with populated package details
    const carts = await Cart.find({})
      .populate('user', 'name email')
      .populate('items.package');

    // Structure the data for chatbot training
    const trainingData = {
      packages: packages.map(pkg => ({
        id: pkg._id,
        name: pkg.name,
        description: pkg.description,
        price: pkg.price,
        duration: pkg.duration,
        category: pkg.category,
        features: pkg.features,
        amenities: pkg.amenities,
        location: pkg.location,
        capacity: pkg.capacity,
        roomType: pkg.roomType,
        rating: pkg.rating,
        reviews: pkg.reviews
      })),
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      })),
      carts: carts.map(cart => ({
        id: cart._id,
        user: cart.user,
        items: cart.items.map(item => ({
          package: item.package,
          quantity: item.quantity
        })),
        totalAmount: cart.totalAmount
      }))
    };

    res.json(trainingData);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ message: 'Error exporting data' });
  }
});

module.exports = router; 