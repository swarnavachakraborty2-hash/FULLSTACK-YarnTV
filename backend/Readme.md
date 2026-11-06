# ⚙️ YarnTV — Backend API Service

The backend REST API service for YarnTV, powered by Node.js, Express 5, MongoDB, Mongoose, and Cloudinary.

> 📖 **Full Project Documentation**: For complete architectural blueprints, frontend instructions, and roadmap, see the [Root README](../README.md).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
```env
PORT=5000
DATABASE_URI=your_mongodb_connection_uri
CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_jwt_access_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Run Development Server
```bash
npm run dev
```

---

## 📂 Architecture Overview
- `src/controllers`: Core business logic (Videos, Users, Comments, Likes, Playlists, Tweets).
- `src/models`: Mongoose schemas with validation and aggregation pagination.
- `src/routes`: Modular Express route definitions with JWT authentication guards.
- `src/middlewares`: Auth token verification & Multer file upload pipelines.
- `src/utils`: Standardized API responses, error handling wrapper, and Cloudinary upload helper.
