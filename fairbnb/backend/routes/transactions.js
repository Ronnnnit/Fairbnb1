const express = require('express');
const router = express.Router();
const { transactionStorage } = require('../storage/localStorage');
const auth = require('../middleware/auth');

// Get user's transactions
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching transactions for user:', req.user.userId);
    const transactions = transactionStorage.findByUserId(req.user.userId);
    console.log('Found transactions:', transactions);
    res.json(transactions);
  } catch (error) {
    console.error('Error in GET /transactions:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single transaction
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = transactionStorage.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    if (transaction.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view this transaction' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new transaction (this would typically be called after successful payment)
router.post('/', auth, async (req, res) => {
  try {
    const transaction = transactionStorage.create({
      userId: req.user.userId,
      ...req.body
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update transaction status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const transaction = transactionStorage.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    if (transaction.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this transaction' });
    }
    
    const updatedTransaction = transactionStorage.update(req.params.id, {
      status: req.body.status
    });
    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 