const express = require('express');
const router = express.Router();
const { packageStorage } = require('../storage/localStorage');

// Get all packages
router.get('/', async (req, res) => {
  try {
    const packages = packageStorage.findAll();
    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Error fetching packages', error: error.message });
  }
});

// Get single package
router.get('/:id', async (req, res) => {
  try {
    const package = packageStorage.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(package);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create package (admin only)
router.post('/', async (req, res) => {
  try {
    const package = packageStorage.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      duration: req.body.duration,
      image: req.body.image,
      features: req.body.features,
      category: req.body.category,
      capacity: req.body.capacity,
      roomType: req.body.roomType,
      amenities: req.body.amenities,
      location: req.body.location,
      rating: req.body.rating,
      reviews: req.body.reviews
    });
    res.status(201).json(package);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update package (admin only)
router.put('/:id', async (req, res) => {
  try {
    const package = packageStorage.update(req.params.id, req.body);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(package);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete package (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const package = packageStorage.delete(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 