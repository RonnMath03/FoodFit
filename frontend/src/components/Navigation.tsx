import React from 'react';
import { Box, Flex, Link as ChakraLink, Image, Button } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../libr/store';

function Navigation() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Don't show navigation on login page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <Box 
      bg="brand.500" 
      px={6} 
      py={3}  // Changed back to original padding
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      boxShadow="sm"
    >
      <Flex align="center" justify="space-between">
        <Flex gap={6} align="center">
          {/* Remove isAuthenticated condition temporarily for testing */}
          <>
            <Button
              as={RouterLink}
              to="/restaurants"
              variant="ghost"
              color="white"
              fontSize="lg"  // Changed from md to lg
              fontWeight="bold"  // Changed from semibold to bold
              _hover={{ 
                bg: 'whiteAlpha.200',
                textDecoration: 'none'
              }}
            >
              Restaurants
            </Button>
            <Button
              as={RouterLink}
              to="/donate"
              variant="ghost"
              color="white"
              fontSize="lg"  // Changed from md to lg
              fontWeight="bold"  // Changed from semibold to bold
              _hover={{ 
                bg: 'whiteAlpha.200',
                textDecoration: 'none'
              }}
            >
              Donation
            </Button>
            <Button
              as={RouterLink}
              to="/cart"
              variant="ghost"
              color="white"
              p={2}
              _hover={{ 
                bg: 'whiteAlpha.200',
                textDecoration: 'none'
              }}
            >
              <Image 
                src="/images/cart2.png"  // Changed from cart.png to cart2.png
                alt="Cart"
                height="43px"
                width="43px"
                objectFit="contain"
              />
            </Button>
          </>
        </Flex>
        <Image 
          src="/images/translogo.png"
          alt="Logo"
          height="40px"  // Restored to original size
          width="auto"
          objectFit="contain"
        />
      </Flex>
    </Box>
  );
}

export default Navigation;