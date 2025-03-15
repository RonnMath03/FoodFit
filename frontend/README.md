# Food Ordering and Donation Platform

A React-based platform for food ordering and donation management.

## Project Structure and Developer Responsibilities

### Developer 1: Authentication and Scanner
- **Directory**: `src/pages/auth` and `src/pages/scanner`
- **Components**:
  - Login system
  - User authentication
  - Food scanning functionality
- **Key Files**:
  - `src/pages/auth/LoginPage.tsx`
  - `src/pages/scanner/ScannerPage.tsx`
  - `src/lib/store.ts` (auth state management)

### Developer 2: Restaurant Management
- **Directory**: `src/pages/restaurants`
- **Components**:
  - Restaurant listing
  - Menu management
  - Food item details
- **Key Files**:
  - `src/pages/restaurants/RestaurantListPage.tsx`
  - `src/pages/restaurants/MenuPage.tsx`

### Developer 3: Cart and Donation System
- **Directory**: `src/pages/cart` and `src/pages/donation`
- **Components**:
  - Shopping cart functionality
  - Donation system
  - Payment integration
- **Key Files**:
  - `src/pages/cart/CartPage.tsx`
  - `src/pages/donation/DonationPage.tsx`
  - `src/lib/store.ts` (cart state management)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack
- React 19
- TypeScript
- Chakra UI
- React Router
- React Query
- Zustand (State Management)

## Theme Colors
- Main Color: `#FFA809` (Dark Yellow)
- White: `#FFFFFF`
- Color variations are available in the theme configuration

## Shared Components
- Navigation bar (`src/components/Navigation.tsx`)
- State management (`src/lib/store.ts`)
- Theme configuration (`src/App.tsx`)

## Development Guidelines
1. Follow the existing code style and TypeScript types
2. Use Chakra UI components for consistent styling
3. Maintain state in Zustand stores
4. Use React Query for API calls
5. Follow the routing structure defined in `App.tsx`