const express = require('express');
const router = express.Router();
const { cartStorage, packageStorage } = require('../storage/localStorage');
const auth = require('../middleware/auth');

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cartSummary = cartStorage.getCartSummary(req.user.userId);
    res.json(cartSummary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { packageId, quantity = 1 } = req.body;
    
    // Verify package exists
    const package = packageStorage.findById(packageId);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const cart = cartStorage.addItem(req.user.userId, packageId, quantity);
    const cartSummary = cartStorage.getCartSummary(req.user.userId);
    res.json(cartSummary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update item quantity
router.put('/update/:packageId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const cart = cartStorage.updateItemQuantity(req.user.userId, req.params.packageId, quantity);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartSummary = cartStorage.getCartSummary(req.user.userId);
    res.json(cartSummary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:packageId', auth, async (req, res) => {
  try {
    const cart = cartStorage.removeItem(req.user.userId, req.params.packageId);
    if (!cart) {
      return res.json({ items: [], totalAmount: 0, itemCount: 0 });
    }

    const cartSummary = cartStorage.getCartSummary(req.user.userId);
    res.json(cartSummary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    cartStorage.clear(req.user.userId);
    res.json({ message: 'Cart cleared successfully', items: [], totalAmount: 0, itemCount: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 