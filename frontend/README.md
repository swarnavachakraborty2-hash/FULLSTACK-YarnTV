# 💻 YarnTV — Frontend Client

The frontend client for YarnTV, built with **React 19**, **Vite**, **Video.js**, **Recharts**, and **Axios**.

> 📖 **Full Project Documentation**: For end-to-end architecture blueprints, backend API specifications, and roadmap, see the [Root README](../README.md).

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration (`.env`)
Create a `.env` file in the `frontend` root:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Start Development Server
```bash
npm run dev
# Vite server running on http://localhost:5173
```

### 4. Build for Production
```bash
npm run build
```

---

## 🎨 Feature Highlights
- **Adaptive Video Player**: Multi-resolution streaming support via Video.js and custom resolution switcher.
- **Creator Studio Analytics**: Subscriber curves and engagement metrics plotted with Recharts.
- **Automatic Session Renewal**: Axios interceptor with automatic token renewal via `refresh-token` on 401 response status.
- **Community Feed**: Interactive creator tweets, nested comment threads, and playlist curation.
