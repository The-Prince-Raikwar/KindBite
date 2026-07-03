# KindBite - Food Delivery System

A complete food delivery system with real-time order tracking and OTP verification.

## Features

### Customer App (`/delivery`)
- User registration and login
- Browse restaurants and menu items
- Place orders
- Real-time order tracking with live map
- OTP display for delivery verification
- Order status updates

### Rider App (`/rider-app`)
- Rider login
- View available orders
- Accept delivery assignments
- Live GPS location tracking
- Update delivery status
- OTP verification for delivery completion

### Backend (`/Backend`)
- REST API with Express
- Socket.IO for real-time updates
- MongoDB for data persistence
- JWT authentication
- OTP generation and verification

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd Backend
npm install

# Delivery App (Customer)
cd ../delivery
npm install

# Rider App
cd ../rider-app
npm install
```

### 2. Setup MongoDB

Make sure MongoDB is running locally or update the MONGODB_URI in .env

### 3. Seed Database (creates demo users)

```bash
cd Backend
npm run seed
```

### 4. Start Applications

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Customer App:**
```bash
cd delivery
npm run dev
```

**Terminal 3 - Rider App:**
```bash
cd rider-app
npm run dev
```

## Demo Credentials

### Customer Login
- Email: `demo@example.com`
- Password: `password123`

### Rider Login
- Email: `rider@example.com`
- Password: `rider123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/available` - Get available orders (for riders)
- `GET /api/orders/:orderId` - Get order details
- `PATCH /api/orders/:orderId/status` - Update order status
- `POST /api/orders/:orderId/assign-rider` - Assign rider to order
- `POST /api/orders/:orderId/verify-otp` - Verify delivery OTP
- `POST /api/orders/:orderId/update-location` - Update rider location

## Socket.IO Events

### Client -> Server
- `joinOrderRoom` - Join order tracking room
- `leaveOrderRoom` - Leave order tracking room
- `rider:location` - Send rider location update

### Server -> Client
- `order:location_update` - Location update for customers
- `order:status_change` - Status change notification
- `order:delivered` - Order delivered confirmation

## Order Status Flow

1. `confirmed` - Order placed
2. `preparing` - Restaurant preparing food
3. `assigned` - Rider assigned
4. `picked` - Rider picked up order
5. `out_for_delivery` - Order on the way (OTP generated)
6. `delivered` - Order delivered (OTP verified)

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express, Socket.IO
- **Database**: MongoDB with Mongoose
- **Maps**: Leaflet (OpenStreetMap)
- **Real-time**: Socket.IO

## Project Structure

```
KindBite/
├── Backend/
│   ├── server.js          # Main server
│   ├── seed.js           # Database seeder
│   ├── Utils/
│   │   └── socketSetup.js # Socket.IO setup
│   └── .env.example
├── delivery/              # Customer App
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── PlaceOrder.jsx
│   │   │   └── TrackOrder.jsx
│   │   └── services/
│   │       └── socketService.js
│   └── package.json
├── rider-app/            # Rider App
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Delivery.jsx
│   │   └── services/
│   │       └── socketService.js
│   └── package.json
└── README.md
```

## Environment Variables

Create `.env` file in Backend folder:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/fooddelivery
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

## Notes

- For production, set up proper MongoDB Atlas connection
- OTP expires after 5 minutes
- Maximum 3 OTP verification attempts
- Location updates are sent every 5 seconds when delivering
