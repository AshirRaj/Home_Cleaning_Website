# SAGARIKA Cleaning Service Backend API

Production-ready Node.js, Express.js & MongoDB REST API backend built for Sagarika Odicare Services Home Cleaning Web Application.

---

## 🚀 Technology Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JWT & HTTP-Only Secure Cookies
- **Password Security**: bcryptjs
- **Validation**: Zod
- **Payment Gateway**: Razorpay (HMAC SHA256 Signature Verification)
- **Notifications**: Transactional Email (Nodemailer) & WhatsApp Cloud API
- **Security**: Helmet, CORS, Express-Rate-Limit

---

## 📁 Environment Variables Setup

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

MONGODB_URI=mongodb://localhost:27017/cleaning_service

JWT_SECRET=super_secret_production_jwt_key_sagarika_cleaning_2026
JWT_EXPIRES_IN=7d

RAZORPAY_KEY_ID=rzp_test_sparkle123
RAZORPAY_KEY_SECRET=rzp_secret_test_sparkle456
RAZORPAY_WEBHOOK_SECRET=rzp_webhook_secret_789

EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@sagarika.com
SMTP_PASS=app_password_here
EMAIL_FROM=SAGARIKA Cleaning <no-reply@sagarika.com>

WHATSAPP_PROVIDER=meta_cloud
WHATSAPP_ACCESS_TOKEN=eaab_test_token_whatsapp_cloud_api
WHATSAPP_PHONE_NUMBER_ID=109283746501928
```

---

## 🛠️ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Seed Database (Admin & Services)
npm run seed

# 3. Start Development Server
npm run dev

# 4. Start Production Server
npm start
```

---

## 📡 API Reference & Endpoints

### 🔑 Auth API
- `POST /api/admin/login` - Authenticate admin credentials and receive JWT + cookie.
- `POST /api/admin/logout` - Clear admin authentication session.
- `GET /api/admin/me` - Fetch currently authenticated admin profile.

### 🧹 Services API
- `GET /api/services` - List all active cleaning services.
- `GET /api/services/:id` - Fetch details for a specific service by ID or slug.

### 📅 Bookings API
- `POST /api/bookings` - Submit a new cleaning service booking (backend calculates pricing & validates availability).
- `GET /api/bookings/availability` - Fetch available dates & time slots for booking.
- `GET /api/bookings/:id` - Get booking details by Booking ID.

### 🛡️ Admin Bookings API (Protected)
- `GET /api/admin/bookings` - Filtered, searched, sorted & paginated booking list.
- `GET /api/admin/bookings/:id` - Complete booking details for admin modal.
- `PATCH /api/admin/bookings/:id/status` - Update booking status (`Confirmed`, `In Progress`, `Completed`, `Cancelled`).
- `PATCH /api/admin/bookings/:id/status/payment` - Update payment & booking status.
- `POST /api/admin/bookings/:id/notes` - Append internal operational notes.

### 💳 Payments API
- `POST /api/payments/create-order` - Generate Razorpay payment order.
- `POST /api/payments/verify` - Verify Razorpay payment signature & confirm booking.
- `GET /api/payments/:id` - Fetch payment status.
- `POST /api/payments/webhook` - Idempotent payment webhook listener.

### 📊 Admin Dashboard API (Protected)
- `GET /api/admin/dashboard/stats` - Total bookings, revenue, pending payments & completion metrics.
- `GET /api/admin/dashboard/recent-bookings` - Fetch recent bookings list.
