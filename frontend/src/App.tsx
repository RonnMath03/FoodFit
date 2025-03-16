import React from 'react';
import { ChakraProvider, Box, extendTheme } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RestaurantListPage from './pages/restaurants/RestaurantListPage';
import MenuPage from './pages/restaurants/MenuPage';
import CartPage from './pages/cart/CartPage';
import DonationPage from './pages/donation/DonationPage';
import SplashScreen from './components/SplashScreen';
import HungerLevelPage from './pages/HungerLevelPage';

const queryClient = new QueryClient();

const theme = extendTheme({
  colors: {
    brand: {
      50: '#FFF3D6',
      100: '#FFE4AD',
      200: '#FFD584',
      300: '#FFC65B',
      400: '#FFB732',
      500: '#FFA809', // Main color - darker yellow
      600: '#E69500',
      700: '#CC8400',
      800: '#B37300',
      900: '#996200',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'white',
      },
    },
  },
});

function Navigation() {
  const location = useLocation();
  
  if (location.pathname === '/') {
    return null;
  }

  return (
    <Box 
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg="brand.500"
      px={6}
      py={3}
      zIndex={1000}
    >
      {/* Navigation content will be handled in Navigation component */}
    </Box>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Router>
          <Box minH="100vh">
            <Navigation />
            <Box p={4} mt="60px">
              <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/restaurants" element={<RestaurantListPage />} />
                <Route path="/menu/:restaurantId" element={<MenuPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/donate" element={<DonationPage />} />
                <Route path="/hunger-level" element={<HungerLevelPage />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;