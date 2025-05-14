const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { cartStorage, transactionStorage, packageStorage } = require('../storage/localStorage');

// Process payment
router.post('/process', auth, async (req, res) => {
  try {
    const { amount, packageId, checkIn, checkOut, guests } = req.body;
    const userId = req.user.userId;

    // Get cart items
    const cart = cartStorage.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Create transactions for each item in cart
    const transactions = cart.items.map(item => {
      const pkg = item.package;
      return transactionStorage.create({
        userId,
        package: {
          id: pkg.id,
          name: pkg.name,
          price: pkg.price,
          duration: pkg.duration,
          image: pkg.image
        },
        status: 'completed',
        checkIn,
        checkOut,
        guests,
        totalAmount: pkg.price * item.quantity,
        paymentMethod: 'Credit Card'
      });
    });

    // Clear the cart after successful payment
    cartStorage.clear(userId);

    res.json({
      message: 'Payment successful',
      transactions
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Payment failed' });
  }
});

module.exports = router; 