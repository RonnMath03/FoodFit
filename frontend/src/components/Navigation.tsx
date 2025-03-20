import React from 'react';
import { Box, Flex, Image, Button, Tooltip } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  // Don't show navigation on splash screen or hunger level page
  if (location.pathname === '/' || location.pathname === '/hunger-level') {
    return null;
  }

  return (
    <Box 
      bg="brand.400" 
      px={4}
      py={2}
      position="fixed"
      bottom={4}
      left="50%"
      transform="translateX(-50%)"
      zIndex={1000}
      boxShadow="lg"
      borderRadius="xl"
      width={{ base: "90%", sm: "80%", md: "60%", lg: "50%" }}
      maxWidth="500px"
    >
      <Flex align="center" justify="space-between">
        {/* Left side - Home and Donation */}
        <Flex gap={2} align="center">
          <Tooltip label="Restaurants" placement="top">
            <Button
              as={RouterLink}
              to="/restaurants"
              variant="ghost"
              color="white"
              p={1}
              minW="auto"
              _hover={{ bg: 'whiteAlpha.200' }}
              aria-label="Restaurants"
            >
              <Image 
                src="/images/food.png"
                alt="Restaurant"
                height="30px"
                width="30px"
                objectFit="contain"
              />
            </Button>
          </Tooltip>
          
          <Tooltip label="Donation" placement="top">
            <Button
              as={RouterLink}
              to="/donate"
              variant="ghost"
              color="white"
              p={1}
              minW="auto"
              _hover={{ bg: 'whiteAlpha.200' }}
              aria-label="Donation"
            >
              <Image 
                src="/images/donation.png"
                alt="Donation"
                height="30px"
                width="30px"
                objectFit="contain"
              />
            </Button>
          </Tooltip>
        </Flex>
        
        {/* Center - FoodFit Logo */}
        <Tooltip label="Home" placement="top">
            <Button
              as={RouterLink}
              to="/home"
              variant="ghost"
              color="white"
              p={1}
              minW="auto"
              _hover={{ bg: 'whiteAlpha.200' }}
              aria-label="Home"
            >
              <Image 
                src="/images/logo7.png"
                alt="Home"
                height="35px"
                width="auto"
                objectFit="contain"
              />
            </Button>
          </Tooltip>
        {/* Right side - Cart and Profile */}
        <Flex gap={2} align="center">
          <Tooltip label="Cart" placement="top">
            <Button
              as={RouterLink}
              to="/cart"
              variant="ghost"
              color="white"
              p={1}
              minW="auto"
              _hover={{ bg: 'whiteAlpha.200' }}
              aria-label="Cart"
            >
              <Image 
                src="/images/cart.png"
                alt="Cart"
                height="30px"
                width="30px"
                objectFit="contain"
              />
            </Button>
          </Tooltip>
          
          <Tooltip label="Profile" placement="top">
            <Button
              as={RouterLink}
              to="/profile"
              variant="ghost"
              color="white"
              p={1}
              minW="auto"
              _hover={{ bg: 'whiteAlpha.200' }}
              aria-label="Profile"
            >
              <Image 
                src="/images/profilepic.png"
                alt="Profile"
                height="30px"
                width="30px"
                objectFit="contain"
              />
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navigation;