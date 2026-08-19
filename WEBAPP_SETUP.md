# Clinic OS Web App - Quick Setup Guide

Get the React web app running in 5 minutes.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd webapp
npm install
```

### 2. Start Backend API

In a separate terminal:

```bash
cd D:\clinical os
python -m uvicorn clinic_os.main:app --reload --port 8000
```

Or with Docker:

```bash
docker-compose up -d
```

### 3. Start Web App

```bash
cd webapp
npm run dev
```

The app opens at **http://localhost:3000**

---

## 📊 What's Included

### Pages
- ✅ **Dashboard** — Overview with stats
- ✅ **Appointments** — List and manage appointments
- 🔄 **Check-in Form** — Patient intake (coming soon)
- 🔄 **Queue Tracker** — Live queue view (coming soon)

### Components
- ✅ **Layout** — Sidebar navigation with responsive design
- ✅ **Card** — Reusable card component
- ✅ **Button** — Styled button component
- ✅ **API Client** — Axios-based API wrapper
- ✅ **React Query Hooks** — Data fetching hooks

### Features
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ React Query for data management
- ✅ Vite for fast builds
- ✅ Mobile responsive design

---

## 🔌 API Integration

The app automatically connects to backend at `http://localhost:8000/api/v1`

**Set clinic ID in localStorage:**

```javascript
localStorage.setItem('clinicId', 'clinic-001')
```

Or edit in `src/App.tsx`:

```typescript
const clinicId = localStorage.getItem('clinicId') || 'your-clinic-id'
```

---

## 📁 Folder Structure

```
webapp/
├── src/
│   ├── api/          # API client
│   ├── components/   # Reusable components
│   ├── hooks/        # React Query hooks
│   ├── pages/        # Full pages
│   └── App.tsx       # Main component
├── index.html        # HTML template
├── package.json      # Dependencies
└── vite.config.ts    # Vite configuration
```

---

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (hot reload) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code style |
| `npm run type-check` | TypeScript validation |

---

## 🎨 Styling

Uses **Tailwind CSS** for all styling. Customize in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        600: '#0284c7', // Change primary color
      },
    },
  },
}
```

---

## 📦 Adding New Pages

1. Create file in `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Layout.tsx`

### Example:

```typescript
// src/pages/MyPage.tsx
import Layout from '../components/Layout'

export default function MyPage() {
  return (
    <Layout userRole="doctor">
      <h1>My Page</h1>
    </Layout>
  )
}
```

Add to App.tsx routes:

```typescript
<Route path="/my-page" element={<MyPage />} />
```

---

## 🔐 Authentication (Optional)

To add login:

1. Create `src/pages/Login.tsx`
2. Create `src/context/AuthContext.tsx`
3. Protect routes with PrivateRoute

```typescript
function PrivateRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  return children
}
```

---

## 🐛 Debugging

### Check Backend Connection

```bash
# Test API health
curl http://localhost:8000/health
```

### Browser Console Errors

Open DevTools (F12) → Console tab

### Network Requests

DevTools → Network tab → Look for `/api/v1/*` requests

---

## 🚢 Deploy to Production

### Build

```bash
npm run build
```

Creates `/dist` folder ready to deploy.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

1. Run `npm run build`
2. Drag `/dist` folder to netlify.com
3. Set environment variable: `REACT_APP_API_URL=https://your-api.com/api/v1`

---

## 📊 Project Status

**Webapp Status:** ✅ Foundation Complete (40% of MVP)

| Component | Status |
|-----------|--------|
| Setup & Config | ✅ Done |
| Layout & Navigation | ✅ Done |
| Dashboard | ✅ Done |
| Appointments List | ✅ Done |
| API Client | ✅ Done |
| React Query Hooks | ✅ Done |
| Book Appointment Form | 🔄 Next |
| Check-in Form | 🔄 Next |
| Queue Tracker | 🔄 Next |
| Authentication | 🔄 Next |
| Deployment | 🔄 Next |

---

## 🆘 Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- --port 3001
```

### Backend API not found
- Check backend is running: `curl http://localhost:8000/health`
- Check `vite.config.ts` proxy settings
- Check clinic ID is set: `localStorage.getItem('clinicId')`

### Styles not loading
```bash
# Rebuild Tailwind CSS
npm run build
```

### TypeScript errors
```bash
npm run type-check
```

---

## 📚 Next Steps

1. ✅ **Setup complete** — Backend and frontend running
2. 🔄 **Build appointment booking form** — Patient-facing form
3. 🔄 **Build check-in page** — QR code to WhatsApp form
4. 🔄 **Build queue tracker** — Real-time queue updates
5. 🔄 **Add authentication** — Login for staff/doctors
6. 🔄 **Deploy to staging** — Cloud hosting
7. 🔄 **Production launch** — Go live

---

**Getting help?**
- Check webapp/README.md for more details
- Review Backend API docs at backend.md
- Check Clinic OS PRD for requirements

Happy coding! 🎉
