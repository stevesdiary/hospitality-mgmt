# 🚀 Quick Start Guide - Hospitality Management React Frontend

## Prerequisites

- Node.js >= 18
- npm or yarn
- Backend API running on http://localhost:3360

## Installation & Setup

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and update if needed:
# VITE_API_URL=http://localhost:3360/api
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3001**

## Project Structure Overview

```
client/src/
├── components/     # Reusable UI components
│   ├── common/    # Atoms, molecules (buttons, inputs)
│   └── layout/    # Layout components (MainLayout, AuthLayout)
├── pages/          # Page components
│   ├── auth/      # Login, Register, etc.
│   ├── hotels/    # Hotel listing and details
│   ├── rooms/     # Room pages
│   ├── bookings/  # Booking pages
│   ├── user/      # User profile and settings
│   └── admin/     # Admin dashboard and management
├── services/       # API service layer
│   ├── api.ts              # Base API service
│   ├── auth.service.ts     # Authentication
│   ├── hotel.service.ts    # Hotel operations
│   ├── room.service.ts     # Room operations
│   ├── reservation.service.ts  # Reservations
│   └── user.service.ts     # User management
├── store/          # Redux state management
│   ├── index.ts        # Store configuration
│   └── authSlice.ts    # Auth state
├── types/          # TypeScript type definitions
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
└── App.tsx         # Main app component with routing
```

## Key Features

### ✅ Complete Type System
All entities are fully typed in `/src/types/index.ts`:
- Users, Hotels, Rooms, Reservations
- Ratings, Reviews, Facilities
- API responses and errors

### ✅ API Service Layer
Ready-to-use API clients:

```typescript
import { hotelService, authService } from '@/services';

// Login
const { token, user } = await authService.login({ email, password });

// Get hotels
const hotels = await hotelService.getAllHotels({ page: 1, limit: 10 });

// Create reservation
const reservation = await reservationService.createReservation(data);
```

### ✅ State Management
Redux store for global state:
- Authentication state (user, token, isAuthenticated)
- Automatic token persistence
- Protected routes

### ✅ Routing
Complete routing structure:
- Public routes: Home, Hotels, Search
- Auth routes: Login, Register
- Protected routes: Profile, My Reservations
- Admin routes: Dashboard, Management

## Common Tasks

### Making API Calls

```typescript
import { apiService } from '@/services';

// GET request
const data = await apiService.get('/hotels');

// POST request
const result = await apiService.post('/reservations', reservationData);

// File upload
const result = await apiService.uploadFile('/upload', file);
```

### Using Redux

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from '@/store/authSlice';

// In component
const dispatch = useDispatch();
const { user, isAuthenticated } = useSelector((state) => state.auth);

// Dispatch action
dispatch(loginSuccess({ token, user }));
dispatch(logout());
```

### Protected Routes

Routes automatically check authentication:

```typescript
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  } 
/>
```

## Available Scripts

```bash
npm run dev          # Start development server (http://localhost:3001)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code style
npm test             # Run tests
npm run test:watch   # Watch mode for tests
npm run test:coverage # Generate coverage report
```

## Styling

### Tailwind CSS

Use Tailwind utility classes:

```tsx
<div className="flex items-center space-x-4">
  <button className="btn-primary">Click Me</button>
</div>
```

### Predefined Classes

Available in `/src/index.css`:
- `.btn-primary`, `.btn-secondary`, `.btn-outline`
- `.input-field`
- `.card`
- `.badge-primary`, `.badge-success`, etc.

## Authentication Flow

1. User logs in via `/login`
2. Token stored in localStorage
3. Token auto-injected in all API requests
4. Protected routes check for valid token
5. Auto-logout on 401 response

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Deployment

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Environment Variables for Production

Update `.env.production`:
```env
VITE_API_URL=https://api.yourapp.com
```

## Troubleshooting

### Port Already in Use

If port 3001 is in use, update `vite.config.ts`:
```typescript
server: {
  port: 3002, // Change to different port
}
```

### API Connection Issues

Ensure backend is running on http://localhost:3360

Check `.env` file:
```env
VITE_API_URL=http://localhost:3360/api
```

### TypeScript Errors

Run type checking:
```bash
npx tsc --noEmit
```

## Next Steps

1. **Implement UI Components**
   - Create Button, Input, Select components
   - Build HotelCard, HotelList components
   - Add BookingForm component

2. **Complete Pages**
   - Implement LoginPage with form validation
   - Build HotelsPage with filters
   - Create BookingPage flow

3. **Add Custom Hooks**
   - useAuth for authentication
   - useApi for API calls
   - usePagination for lists

4. **Write Tests**
   - Component tests
   - Integration tests
   - E2E tests

## Resources

- **Documentation**: See `README.md` for detailed docs
- **Implementation Summary**: See `IMPLEMENTATION_SUMMARY.md`
- **API Reference**: Backend API documentation
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com

## Getting Help

- Check existing documentation
- Review code comments
- Contact the development team

---

**Happy Coding! 🎉**
