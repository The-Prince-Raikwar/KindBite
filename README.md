# KindBite - Full Stack Food Delivery Application

A modern, full-stack food delivery application built with React, Node.js, and MongoDB.

## 🚀 Project Overview

KindBite is a complete food delivery platform with three main components:

- **Frontend** - Customer-facing React application
- **Admin Panel** - Administrative dashboard for managing orders and menu
- **Backend** - Node.js API server with MongoDB database

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** with Vite
- **TailwindCSS** for styling
- **React Router DOM** for navigation
- **Axios** for API calls
- **Firebase** for authentication
- **Framer Motion** for animations

### Admin Panel
- **React 19.2.0** with Vite
- **Ant Design** for UI components
- **Recharts** for analytics
- **TailwindCSS** for styling

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Stripe** for payments
- **Nodemailer** for emails
- **Multer** for file uploads

## 📁 Project Structure

```
KindBite/
├── Frontend/          # Customer React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── assets/
│   ├── .env.example
│   └── package.json
├── admin/             # Admin React app
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   ├── .env.example
│   └── package.json
├── Backend/           # Node.js API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── env.example
│   └── package.json
├── deploy.sh          # Linux/Mac deployment script
├── deploy.bat         # Windows deployment script
├── DEPLOY.md          # Detailed deployment guide
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Stripe account (for payments)

### Automated Setup (Recommended)

**Windows:**
```bash
deploy.bat
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Setup

1. **Backend Setup:**
```bash
cd Backend
cp env.example .env
# Edit .env with your MongoDB URI, JWT secret, Stripe keys, etc.
npm install
npm run dev
```

2. **Frontend Setup:**
```bash
cd Frontend
cp .env.example .env
# Edit .env with your backend URL
npm install
npm run dev
```

3. **Admin Panel Setup:**
```bash
cd admin
cp .env.example .env
# Edit .env with your backend URL
npm install
npm run dev
```

## 🌐 Deployment

For detailed deployment instructions, see [DEPLOY.md](./DEPLOY.md).

### Deployment Platforms
- **Backend**: Render, Railway, Heroku
- **Frontend**: Vercel, Netlify
- **Admin**: Vercel, Netlify

## 📱 Features

### Customer Features
- Browse food menu with categories
- Add items to cart
- Place orders with Stripe payment
- Order tracking
- User authentication
- Order history

### Admin Features
- Dashboard with analytics
- Order management
- Food item management
- User management
- Real-time updates

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_random_secret
STRIPE_SECRET_KEY=your_stripe_live_key
EMAIL=your_email@gmail.com
PASS=your_gmail_app_password
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.onrender.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Admin (.env)
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For deployment issues, refer to the [DEPLOY.md](./DEPLOY.md) file or create an issue in the repository.
