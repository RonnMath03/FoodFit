import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Image,
  useColorModeValue,
  Button
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Mock statistics - in a real app, these would come from an API
  const stats = {
    foodSaved: "127.5 kg",
    percentageReduction: "32%",
    moneySaved: "₹4,280",
    monthlySaving: "₹1,150"
  };

  return (
    <Box maxW="4xl" mx="auto" py={8} px={4}>
      {/* Welcome Header */}
      <Flex align="center" mb={8}>
        <Image 
          src="/images/logo5.png"
          alt="FoodFit Logo"
          height="60px"
          mr={4}
        />
      </Flex>

      {/* Stats Section */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={10}>
        <Box 
          bg={bgColor} 
          p={6} 
          borderRadius="lg" 
          boxShadow="md"
          borderLeft="4px solid"
          borderLeftColor="green.400"
        >
          <Stat>
            <StatLabel fontSize="lg" color="gray.600">Food Waste Reduced</StatLabel>
            <StatNumber fontSize="3xl" color="green.500">{stats.foodSaved}</StatNumber>
            <StatHelpText>
              <Text as="span" color="green.500" fontWeight="bold">
                ↓ {stats.percentageReduction}
              </Text> from average consumption
            </StatHelpText>
          </Stat>
        </Box>
        
        <Box 
          bg={bgColor} 
          p={6} 
          borderRadius="lg" 
          boxShadow="md"
          borderLeft="4px solid"
          borderLeftColor="brand.400"
        >
          <Stat>
            <StatLabel fontSize="lg" color="gray.600">Money Saved</StatLabel>
            <StatNumber fontSize="3xl" color="brand.500">{stats.moneySaved}</StatNumber>
            <StatHelpText>
              <Text as="span" color="brand.500" fontWeight="bold">
                ~ {stats.monthlySaving}
              </Text> per month
            </StatHelpText>
          </Stat>
        </Box>
      </SimpleGrid>

      {/* Navigation Boxes */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box 
          bg={bgColor}
          p={6}
          borderRadius="lg"
          boxShadow="md"
          _hover={{ transform: "translateY(-4px)", boxShadow: "lg", transition: "all 0.3s ease" }}
          cursor="pointer"
          onClick={() => navigate("/restaurants")}
          border="1px"
          borderColor={borderColor}
        >
          <VStack spacing={4} align="center">
            <Image 
              src="/images/rt.jpg" 
              alt="Restaurants"
              Size="80px"
            />
            <Heading size="md" color="brand.600">Find Restaurants</Heading>
            <Text color="gray.600" textAlign="center">
              Explore restaurants with portion-optimized meals tailored to your hunger level
            </Text>
            <Button 
              colorScheme="brand"
              size="md"
              width="full"
            >
              Browse Restaurants
            </Button>
          </VStack>
        </Box>

        <Box 
          bg={bgColor}
          p={6}
          borderRadius="lg"
          boxShadow="md"
          _hover={{ transform: "translateY(-4px)", boxShadow: "lg", transition: "all 0.3s ease" }}
          cursor="pointer"
          onClick={() => navigate("/donate")}
          border="1px"
          borderColor={borderColor}
        >
          <VStack spacing={4} align="center">
            <Image 
              src="/images/fb.jpg" 
              alt="Donations"
              Size="80px"
            />
            <Heading size="md" color="brand.600">Food Donations</Heading>
            <Text color="gray.600" textAlign="center">
              Donate excess food or find available donations to reduce food waste
            </Text>
            <Button 
              colorScheme="brand"
              size="md"
              width="full"
            >
              Explore Donations
            </Button>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default HomePage;