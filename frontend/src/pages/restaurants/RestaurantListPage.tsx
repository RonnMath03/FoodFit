import React from 'react';
import { Box, VStack, Heading, SimpleGrid, Text, Button, Image, Tag, HStack, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const sampleRestaurants = [
  { 
    id: '1', 
    name: 'Punjab Dhaba', 
    cuisine: 'North Indian', 
    rating: '4.5',
    image: '/images/punjabi_dhaba.jpg',
    sustainability: {
      accuratePortions: '95%',
      carbonSaved: '120kg'
    },
    dietaryOptions: ['veg', 'non-veg'],
    avgPortionSize: 'Medium-Large',
    delivery: 'Free delivery'
  },
  { 
    id: '2', 
    name: 'Dakshin', 
    cuisine: 'South Indian', 
    rating: '4.3',
    image: '/images/placeholder.jpg',
    sustainability: {
      accuratePortions: '92%',
      carbonSaved: '100kg'
    },
    dietaryOptions: ['veg', 'non-veg'],
    avgPortionSize: 'Medium',
    delivery: 'Free delivery'
  },
  { 
    id: '3', 
    name: 'Biryani House', 
    cuisine: 'Hyderabadi', 
    rating: '4.7',
    image: '/images/placeholder.jpg',
    sustainability: {
      accuratePortions: '94%',
      carbonSaved: '110kg'
    },
    dietaryOptions: ['non-veg'],
    avgPortionSize: 'Large'
  },
  { 
    id: '4', 
    name: 'Chennai Express', 
    cuisine: 'South Indian', 
    rating: '4.4',
    image: '/images/placeholder.jpg',
    sustainability: {
      accuratePortions: '90%',
      carbonSaved: '95kg'
    },
    dietaryOptions: ['veg'],
    avgPortionSize: 'Medium'
  },
  { 
    id: '5', 
    name: 'Gujarat Bhavan', 
    cuisine: 'Gujarati', 
    rating: '4.2',
    image: '/images/placeholder.jpg',
    sustainability: {
      accuratePortions: '93%',
      carbonSaved: '105kg'
    },
    dietaryOptions: ['veg'],
    avgPortionSize: 'Medium'
  },
  { 
    id: '6', 
    name: 'Bengal Kitchen', 
    cuisine: 'Bengali', 
    rating: '4.6',
    image: '/images/placeholder.jpg',
    sustainability: {
      accuratePortions: '91%',
      carbonSaved: '98kg'
    },
    dietaryOptions: ['non-veg'],
    avgPortionSize: 'Medium-Large'
  },
  { 
    id: '7', 
    name: 'Mumbai Local', 
    cuisine: 'Street Food', 
    rating: '4.8',
    image: '/images/placeholder.jpg',
    sustainability: {
      accuratePortions: '89%',
      carbonSaved: '88kg'
    },
    dietaryOptions: ['veg', 'non-veg'],
    avgPortionSize: 'Small'
  },
  { 
    id: '8', 
    name: 'Kerala House', 
    cuisine: 'Kerala', 
    rating: '4.5',
    image: '/images/placeholder.jpg',
    sustainability: {
      accuratePortions: '92%',
      carbonSaved: '102kg'
    },
    dietaryOptions: ['non-veg'],
    avgPortionSize: 'Medium-Large'
  }
];

function RestaurantListPage() {
  const navigate = useNavigate();

  return (
    <Box maxW="4xl" mx="auto" bg="white" p={4} borderRadius="lg" boxShadow="md">
      <Flex align="center" mb={8}>
          <Image 
            src="/images/logo5.png"
            alt="FoodFit Logo"
            height="60px"
            mr={4}
          />
      </Flex>
      <VStack spacing={4} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {sampleRestaurants.map((restaurant) => (
            <Box 
              key={restaurant.id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="sm"
              _hover={{ shadow: 'md' }}
            >
              <Flex direction="column">
                <Image 
                  src={restaurant.image} 
                  alt={restaurant.name} 
                  borderRadius="md" 
                  mb={4}
                  objectFit="cover"
                  height="150px"
                />
                <VStack align="stretch" spacing={2}>
                  <HStack justify="space-between">
                    <Heading size="sm" color="brand.600">
                      {restaurant.name}
                    </Heading>
                    <HStack>
                      <Text color="brand.500" fontSize="sm">
                        ★ {restaurant.rating}
                      </Text>
                      <Tag colorScheme="green" size="sm">
                        {restaurant.sustainability?.accuratePortions || 'N/A'}
                      </Tag>
                    </HStack>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    {restaurant.cuisine}
                  </Text>
                  <HStack spacing={2}>
                    {restaurant.delivery && (
                      <Tag colorScheme="orange" size="sm">
                        {restaurant.delivery}
                      </Tag>
                    )}
                  </HStack>
                  <Button 
                    size="sm"
                    bg="brand.500"
                    color="white"
                    onClick={() => navigate(`/menu/${restaurant.id}`)}
                    _hover={{ bg: 'brand.600' }}
                  >
                    View Menu
                  </Button>
                </VStack>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export default RestaurantListPage;