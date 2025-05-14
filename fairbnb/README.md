# Fairbnb - A Simplified Airbnb Clone

Fairbnb is a simplified version of Airbnb that focuses on package selection, cart functionality, and mock payments. It's built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User authentication (login/register)
- Package browsing and selection
- Shopping cart functionality
- Mock payment system
- Responsive design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Vite for build tooling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fairbnb
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a .env file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fairbnb
JWT_SECRET=your-secret-key
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- POST /api/users/register - Register a new user
- POST /api/users/login - Login user
- GET /api/users/profile/:id - Get user profile

### Packages
- GET /api/packages - Get all packages
- GET /api/packages/:id - Get single package
- POST /api/packages - Create new package (admin only)

### Cart
- GET /api/cart/:userId - Get user's cart
- POST /api/cart/:userId - Add item to cart
- DELETE /api/cart/:userId/:packageId - Remove item from cart

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 