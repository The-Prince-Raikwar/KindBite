# KindBite Deployment Guide

## Prerequisites
- Node.js 18+
- MongoDB Atlas account (for production database)
- Stripe account (for payments)
- Hosting platform account (Render, Railway, or similar)

## 1. Backend Configuration

Update `Backend/.env` with production values:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=4000
NODE_ENV=production
JWT_SECRET=your_secure_random_secret_min_32_chars
EMAIL=your_email@gmail.com
PASS=your_app_password
STRIPE_SECRET_KEY=your_stripe_live_key
FRONTEND_URL=https://your-frontend-domain.com
```

## 2. Deploy Backend

### Option A: Render (Free)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Settings:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment: Node

### Option B: Railway
1. Create new project on Railway
2. Connect GitHub repository
3. Add environment variables
4. Deploy

## 3. Deploy Frontend

### Option A: Vercel (Recommended)
1. Import your repository on Vercel
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`

### Option B: Netlify
1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable: `VITE_API_URL`

## 4. Deploy Admin Panel

Same as frontend - deploy to Vercel/Netlify and configure `VITE_API_URL` to point to backend.

## 5. Important Notes

- Update CORS in `server.js` to allow your production domain
- Generate new Stripe keys for production (not test keys)
- Use MongoDB Atlas for production database (not local)
- Ensure all environment variables are set on your hosting platform
- The built files are in the `dist` folder of each project

## Quick Deploy Commands

### Automated Setup (Recommended)
Run the automated deployment script for your platform:

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

**Backend:**
```bash
cd Backend
cp env.example .env  # Create .env from example
# Edit .env with your actual values
npm install
npm run build
npm run start
```

**Frontend:**
```bash
cd Frontend
cp .env.example .env  # Create .env from example
# Edit .env with your actual values
npm install
npm run build
npm run dev
```

**Admin:**
```bash
cd admin
cp .env.example .env  # Create .env from example
# Edit .env with your actual values
npm install
npm run build
npm run dev
```

### Environment Variable Templates
The project includes `.env.example` files in each directory. Copy them to `.env` and fill in your values:

- `Backend/env.example` - Backend configuration
- `Frontend/.env.example` - Frontend configuration  
- `admin/.env.example` - Admin panel configuration