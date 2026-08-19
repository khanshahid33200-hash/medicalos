# Clinic OS - React Web App

Modern React 18 + TypeScript web application for Clinic OS patient workflow automation platform.

## 🎯 Features

- **Dashboard** — Overview of appointments, check-ins, and statistics
- **Appointments** — View, book, reschedule, and cancel appointments
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Real-time Data** — React Query for automatic data sync
- **Type Safe** — Full TypeScript support
- **Tailwind CSS** — Modern, utility-first styling

## 🛠️ Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Vite** — Fast build tool
- **Tailwind CSS** — Styling
- **React Router** — Client-side routing
- **React Query** — Server state management
- **Axios** — HTTP client
- **Lucide React** — Icon library

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup

```bash
# Navigate to webapp directory
cd webapp

# Install dependencies
npm install

# Create .env file (optional)
echo "REACT_APP_API_URL=http://localhost:8000/api/v1" > .env

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## 🚀 Development

### Available Scripts

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint code
npm run lint
```

## 📁 Project Structure

```
webapp/
├── src/
│   ├── api/
│   │   └── client.ts              # API client & endpoints
│   ├── components/
│   │   ├── Layout.tsx             # Main layout with sidebar
│   │   ├── Card.tsx               # Card components
│   │   └── Button.tsx             # Reusable button
│   ├── hooks/
│   │   └── useApi.ts              # React Query hooks
│   ├── pages/
│   │   ├── Dashboard.tsx          # Dashboard page
│   │   └── Appointments.tsx       # Appointments page
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
├── tailwind.config.js             # Tailwind config
└── .gitignore
```

## 🔌 API Integration

The app connects to the Clinic OS backend at `http://localhost:8000/api/v1`.

### API Client Usage

```typescript
import apiClient from '@/api/client'

// Set clinic ID
apiClient.setClinicId('clinic-001')

// Book appointment
const response = await apiClient.bookAppointment({
  patient_id: 'patient-123',
  doctor_id: 'doctor-456',
  appointment_date: '2025-09-01T10:00:00',
})
```

### React Query Hooks

```typescript
import { useAppointments, useBookAppointment } from '@/hooks/useApi'

function MyComponent() {
  // Fetch appointments
  const { data, isLoading, error } = useAppointments()

  // Mutate (create/update/delete)
  const bookMutation = useBookAppointment()
  
  const handleBook = async (data) => {
    await bookMutation.mutateAsync(data)
  }
}
```

## 🎨 Styling

Uses Tailwind CSS for styling. Customize colors and theme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: { 500: '...', 600: '...' },
    },
  },
}
```

## 📱 Responsive Design

The app is fully responsive with mobile-first approach:

- Mobile: Full-screen content, drawer navigation
- Tablet: Sidebar on left, main content on right
- Desktop: Full sidebar, expanded content area

## 🌙 Dark Mode (Ready)

Dark mode support via `prefers-color-scheme`. To enable:

```css
@media (prefers-color-scheme: dark) {
  /* dark mode styles */
}
```

## 🔐 Authentication (TODO)

Add authentication by:

1. Add login page at `/src/pages/Login.tsx`
2. Create auth context in `/src/context/AuthContext.tsx`
3. Protect routes with `PrivateRoute` wrapper
4. Store tokens in localStorage

```typescript
// Example
if (!token) {
  return <Navigate to="/login" />
}
```

## 📊 Pages to Build

### Core Pages (Priority)
- [ ] Dashboard — Done ✅
- [ ] Appointments List — Done ✅
- [ ] Book Appointment — TODO
- [ ] Queue Tracker (patient) — TODO
- [ ] Queue Management (doctor) — TODO

### Admin Pages
- [ ] Clinic Settings
- [ ] Staff Management
- [ ] Clinic Hours & Capacity
- [ ] Reports Management

### Patient Pages
- [ ] Check-in Form
- [ ] My Appointments
- [ ] Live Queue Tracker
- [ ] Medical History

## 🧪 Testing (TODO)

Add testing with Jest and React Testing Library:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

```typescript
import { render, screen } from '@testing-library/react'
import Dashboard from './Dashboard'

test('renders dashboard', () => {
  render(<Dashboard />)
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
})
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
# Output in /dist directory
```

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag /dist to netlify.com
```

### Docker

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
CMD ["serve", "-s", "dist", "-l", "3000"]
```

## 📚 Learn More

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Query Docs](https://tanstack.com/query/latest)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Open a pull request

## 📝 License

MIT License - See LICENSE file for details

---

**Status:** Foundation complete (Dashboard, Appointments list, API integration)  
**Coverage:** ~40% of planned pages  
**Ready for:** Testing, additional pages, deployment
