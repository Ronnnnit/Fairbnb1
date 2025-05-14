// In-memory storage
const storage = {
  users: [],
  packages: [],
  carts: [],
  transactions: []
};

// Helper function to generate unique IDs
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// User storage methods
const userStorage = {
  create: (userData) => {
    const user = {
      id: generateId(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    storage.users.push(user);
    return user;
  },

  findByEmail: (email) => {
    return storage.users.find(user => user.email === email);
  },

  findById: (id) => {
    return storage.users.find(user => user.id === id);
  },

  update: (id, updates) => {
    const index = storage.users.findIndex(user => user.id === id);
    if (index !== -1) {
      storage.users[index] = {
        ...storage.users[index],
        ...updates,
        updatedAt: new Date()
      };
      return storage.users[index];
    }
    return null;
  }
};

// Package storage methods
const packageStorage = {
  create: (packageData) => {
    const package = {
      id: generateId(),
      ...packageData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    storage.packages.push(package);
    return package;
  },

  findAll: () => {
    return storage.packages;
  },

  findById: (id) => {
    return storage.packages.find(pkg => pkg.id === id);
  },

  update: (id, updates) => {
    const index = storage.packages.findIndex(pkg => pkg.id === id);
    if (index !== -1) {
      storage.packages[index] = {
        ...storage.packages[index],
        ...updates,
        updatedAt: new Date()
      };
      return storage.packages[index];
    }
    return null;
  },

  delete: (id) => {
    const index = storage.packages.findIndex(pkg => pkg.id === id);
    if (index !== -1) {
      return storage.packages.splice(index, 1)[0];
    }
    return null;
  }
};

// Cart storage methods
const cartStorage = {
  create: (cartData) => {
    const cart = {
      id: generateId(),
      ...cartData,
      items: [],
      totalAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    storage.carts.push(cart);
    return cart;
  },

  findByUserId: (userId) => {
    return storage.carts.find(cart => cart.userId === userId);
  },

  addItem: (userId, packageId, quantity = 1) => {
    const cart = cartStorage.findByUserId(userId);
    if (!cart) {
      return cartStorage.create({ userId });
    }

    const existingItem = cart.items.find(item => item.packageId === packageId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ packageId, quantity });
    }

    cart.totalAmount = cart.items.reduce((total, item) => {
      const pkg = packageStorage.findById(item.packageId);
      return total + (pkg.price * item.quantity);
    }, 0);

    cart.updatedAt = new Date();
    return cart;
  },

  updateItemQuantity: (userId, packageId, quantity) => {
    const cart = cartStorage.findByUserId(userId);
    if (!cart) return null;

    const item = cart.items.find(item => item.packageId === packageId);
    if (item) {
      if (quantity <= 0) {
        return cartStorage.removeItem(userId, packageId);
      }
      item.quantity = quantity;
      cart.totalAmount = cart.items.reduce((total, item) => {
        const pkg = packageStorage.findById(item.packageId);
        return total + (pkg.price * item.quantity);
      }, 0);
      cart.updatedAt = new Date();
    }
    return cart;
  },

  removeItem: (userId, packageId) => {
    const cart = cartStorage.findByUserId(userId);
    if (!cart) return null;

    const index = cart.items.findIndex(item => item.packageId === packageId);
    if (index !== -1) {
      cart.items.splice(index, 1);
      cart.totalAmount = cart.items.reduce((total, item) => {
        const pkg = packageStorage.findById(item.packageId);
        return total + (pkg.price * item.quantity);
      }, 0);
      cart.updatedAt = new Date();
    }
    return cart;
  },

  clear: (userId) => {
    const cart = cartStorage.findByUserId(userId);
    if (cart) {
      cart.items = [];
      cart.totalAmount = 0;
      cart.updatedAt = new Date();
    }
    return cart;
  },

  getCartSummary: (userId) => {
    const cart = cartStorage.findByUserId(userId);
    if (!cart) return { items: [], totalAmount: 0, itemCount: 0 };

    const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    return {
      items: cart.items.map(item => ({
        ...item,
        package: packageStorage.findById(item.packageId)
      })),
      totalAmount: cart.totalAmount,
      itemCount
    };
  }
};

// Transaction storage methods
const transactionStorage = {
  create: (transactionData) => {
    const transaction = {
      id: generateId(),
      ...transactionData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    storage.transactions.push(transaction);
    return transaction;
  },

  findByUserId: (userId) => {
    return storage.transactions.filter(transaction => transaction.userId === userId);
  },

  findById: (id) => {
    return storage.transactions.find(transaction => transaction.id === id);
  },

  update: (id, updates) => {
    const index = storage.transactions.findIndex(transaction => transaction.id === id);
    if (index !== -1) {
      storage.transactions[index] = {
        ...storage.transactions[index],
        ...updates,
        updatedAt: new Date()
      };
      return storage.transactions[index];
    }
    return null;
  }
};

// Initialize with sample data
const initializeSampleData = () => {
  const samplePackages = [
    {
      name: "Luxury Beach Villa",
      description: "Stunning beachfront villa with private pool and ocean views",
      price: 8999,
      duration: "3 days",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60",
      features: ["Private Pool", "Beach Access", "Ocean View", "BBQ Area"],
      category: "Luxury",
      capacity: { min: 2, max: 6 },
      roomType: "Villa",
      amenities: ["WiFi", "Kitchen", "Pool", "Parking"],
      location: { city: "Goa", country: "India" },
      rating: 4.8,
      reviews: 45
    },
    {
      name: "Mountain View Suite",
      description: "Cozy suite with panoramic views and fireplace",
      price: 4999,
      duration: "2 days",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=60",
      features: ["Mountain View", "Fireplace", "Hiking Trails", "Garden"],
      category: "Premium",
      capacity: { min: 2, max: 4 },
      roomType: "Suite",
      amenities: ["WiFi", "Kitchen", "Fireplace", "Parking"],
      location: { city: "Manali", country: "India" },
      rating: 4.6,
      reviews: 32
    },
    {
      name: "Heritage Palace Suite",
      description: "Experience royal living in this magnificent heritage palace suite",
      price: 12999,
      duration: "3 days",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60",
      features: ["Royal Architecture", "Private Garden", "Butler Service", "Spa Access"],
      category: "Luxury",
      capacity: { min: 2, max: 4 },
      roomType: "Suite",
      amenities: ["WiFi", "Butler", "Spa", "Private Garden"],
      location: { city: "Udaipur", country: "India" },
      rating: 4.9,
      reviews: 78
    },
    {
      name: "Treehouse Retreat",
      description: "Unique treehouse experience surrounded by nature",
      price: 3499,
      duration: "2 days",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
      features: ["Treehouse Living", "Nature Trails", "Bird Watching", "Campfire"],
      category: "Premium",
      capacity: { min: 2, max: 3 },
      roomType: "Treehouse",
      amenities: ["WiFi", "Basic Kitchen", "Camping Gear", "Parking"],
      location: { city: "Coorg", country: "India" },
      rating: 4.7,
      reviews: 56
    },
    {
      name: "Modern City Apartment",
      description: "Stylish apartment in the heart of the city",
      price: 2999,
      duration: "1 day",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=60",
      features: ["City View", "Modern Design", "Smart Home", "Gym Access"],
      category: "Basic",
      capacity: { min: 1, max: 3 },
      roomType: "Apartment",
      amenities: ["WiFi", "Kitchen", "Gym", "Parking"],
      location: { city: "Mumbai", country: "India" },
      rating: 4.5,
      reviews: 42
    },
    {
      name: "Desert Camp",
      description: "Authentic desert camping experience with cultural activities",
      price: 5999,
      duration: "2 days",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
      features: ["Desert Safari", "Cultural Shows", "Camel Rides", "Traditional Food"],
      category: "Premium",
      capacity: { min: 2, max: 4 },
      roomType: "Camp",
      amenities: ["Basic Facilities", "Traditional Food", "Cultural Activities", "Parking"],
      location: { city: "Jaisalmer", country: "India" },
      rating: 4.6,
      reviews: 38
    },
    {
      name: "Lakeside Cottage",
      description: "Peaceful cottage by the lake with fishing and boating",
      price: 4499,
      duration: "2 days",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=60",
      features: ["Lake View", "Fishing", "Boating", "BBQ Area"],
      category: "Premium",
      capacity: { min: 2, max: 4 },
      roomType: "Cottage",
      amenities: ["WiFi", "Kitchen", "Fishing Gear", "Parking"],
      location: { city: "Ooty", country: "India" },
      rating: 4.7,
      reviews: 45
    },
    {
      name: "Floating Houseboat",
      description: "Unique houseboat experience on the backwaters",
      price: 7999,
      duration: "2 days",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
      features: ["Backwater Views", "Traditional Food", "Sunset Cruise", "Fishing"],
      category: "Luxury",
      capacity: { min: 2, max: 6 },
      roomType: "Houseboat",
      amenities: ["WiFi", "Kitchen", "Boat Tours", "Parking"],
      location: { city: "Kerala", country: "India" },
      rating: 4.8,
      reviews: 62
    },
    {
      name: "Hill Station Villa",
      description: "Spacious villa with panoramic hill views",
      price: 6999,
      duration: "3 days",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
      features: ["Hill View", "Garden", "Hiking Trails", "BBQ Area"],
      category: "Premium",
      capacity: { min: 4, max: 8 },
      roomType: "Villa",
      amenities: ["WiFi", "Kitchen", "Garden", "Parking"],
      location: { city: "Shimla", country: "India" },
      rating: 4.7,
      reviews: 48
    },
    {
      name: "Beachside Bungalow",
      description: "Charming bungalow steps away from the beach",
      price: 5499,
      duration: "2 days",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
      features: ["Beach Access", "Ocean View", "Garden", "Outdoor Shower"],
      category: "Premium",
      capacity: { min: 2, max: 4 },
      roomType: "Bungalow",
      amenities: ["WiFi", "Kitchen", "Garden", "Parking"],
      location: { city: "Pondicherry", country: "India" },
      rating: 4.6,
      reviews: 52
    },
    {
      name: "Riverside Cabin",
      description: "Cozy cabin by the river with fishing and kayaking",
      price: 3999,
      duration: "2 days",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
      features: ["River View", "Fishing", "Kayaking", "Campfire"],
      category: "Basic",
      capacity: { min: 2, max: 3 },
      roomType: "Cabin",
      amenities: ["WiFi", "Basic Kitchen", "Fishing Gear", "Parking"],
      location: { city: "Rishikesh", country: "India" },
      rating: 4.5,
      reviews: 35
    },
    {
      name: "Luxury Penthouse",
      description: "Stunning penthouse with city skyline views",
      price: 14999,
      duration: "3 days",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
      features: ["City View", "Private Pool", "Rooftop Garden", "Smart Home"],
      category: "Luxury",
      capacity: { min: 2, max: 6 },
      roomType: "Penthouse",
      amenities: ["WiFi", "Kitchen", "Pool", "Parking"],
      location: { city: "Bangalore", country: "India" },
      rating: 4.9,
      reviews: 68
    },
    {
      name: "Forest Lodge",
      description: "Secluded lodge surrounded by lush forest",
      price: 4999,
      duration: "2 days",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
      features: ["Forest View", "Wildlife", "Hiking", "Campfire"],
      category: "Premium",
      capacity: { min: 2, max: 4 },
      roomType: "Lodge",
      amenities: ["WiFi", "Kitchen", "Hiking Gear", "Parking"],
      location: { city: "Munnar", country: "India" },
      rating: 4.7,
      reviews: 42
    },
    {
      name: "Heritage Haveli",
      description: "Beautifully restored heritage haveli with traditional architecture",
      price: 8999,
      duration: "3 days",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
      features: ["Heritage Architecture", "Courtyard", "Traditional Decor", "Cultural Shows"],
      category: "Luxury",
      capacity: { min: 4, max: 8 },
      roomType: "Haveli",
      amenities: ["WiFi", "Kitchen", "Garden", "Parking"],
      location: { city: "Jaipur", country: "India" },
      rating: 4.8,
      reviews: 58
    },
    {
      name: "Island Resort",
      description: "Exclusive island resort with private beach access",
      price: 12999,
      duration: "3 days",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
      features: ["Private Beach", "Water Sports", "Spa", "Island Tours"],
      category: "Luxury",
      capacity: { min: 2, max: 6 },
      roomType: "Resort",
      amenities: ["WiFi", "Kitchen", "Spa", "Parking"],
      location: { city: "Lakshadweep", country: "India" },
      rating: 4.9,
      reviews: 72
    },
    {
      name: "Vineyard Villa",
      description: "Elegant villa in the middle of a vineyard",
      price: 7999,
      duration: "2 days",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
      features: ["Vineyard Views", "Wine Tasting", "Garden", "BBQ Area"],
      category: "Premium",
      capacity: { min: 2, max: 4 },
      roomType: "Villa",
      amenities: ["WiFi", "Kitchen", "Wine Cellar", "Parking"],
      location: { city: "Nashik", country: "India" },
      rating: 4.7,
      reviews: 45
    }
  ];

  samplePackages.forEach(pkg => packageStorage.create(pkg));

  // Get the first user if any, or fallback to 'user_1'
  let userId = 'user_1';
  if (storage.users.length > 0) {
    userId = storage.users[0].id;
  }

  // Add sample transactions for the first user
  const sampleTransactions = [
    {
      userId,
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
      userId,
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
      userId,
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
      userId,
      package: {
        id: '4',
        name: 'Treehouse Retreat',
        price: 3499,
        duration: '2 days',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60'
      },
      status: 'completed',
      checkIn: '2024-03-05',
      checkOut: '2024-03-07',
      guests: 3,
      totalAmount: 10497,
      paymentMethod: 'Net Banking'
    },
    {
      userId,
      package: {
        id: '5',
        name: 'Modern City Apartment',
        price: 2999,
        duration: '1 day',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=60'
      },
      status: 'completed',
      checkIn: '2024-03-15',
      checkOut: '2024-03-16',
      guests: 1,
      totalAmount: 2999,
      paymentMethod: 'UPI'
    }
  ];

  sampleTransactions.forEach(transaction => transactionStorage.create(transaction));
};

// Initialize sample data
initializeSampleData();

module.exports = {
  userStorage,
  packageStorage,
  cartStorage,
  transactionStorage
}; 