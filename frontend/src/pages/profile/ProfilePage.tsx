import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Image,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  Grid,
  GridItem,
  Divider,
  Button,
  useColorModeValue
} from '@chakra-ui/react';

const ProfilePage = () => {
  // Mock user data - in a real app, this would come from API or context
  const user = {
    name: "Aditya Sharma",
    age: 28,
    gender: "Male",
    weight: 72.5, // kg
    height: 175, // cm
    activityLevel: "Moderately Active",
    dietaryPreference: "Vegetarian",
    tdee: 2450, // Total Daily Energy Expenditure
    avgWastePercentage: 18,
    carbonSaved: "42kg"
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box maxW="4xl" mx="auto" py={8} px={4}>
      {/* Profile Header */}
      <Flex 
        direction={{ base: 'column', md: 'row' }}
        bg={bgColor}
        p={6}
        borderRadius="lg"
        boxShadow="md"
        mb={6}
        align="center"
      >
        <Image
          src="public\images\profilepic1.png"
          alt="Profile"
          boxSize={{ base: '100px', md: '120px' }}
          borderRadius="full"
          border="3px solid"
          borderColor="brand.500"
          mr={{ base: 0, md: 6 }}
          mb={{ base: 4, md: 0 }}
        />
        
        <VStack align={{ base: 'center', md: 'start' }} spacing={3} flex="1">
          <Heading size="xl" color="brand.700">{user.name}</Heading>
          <Flex wrap="wrap" gap={4}>
            <Text color="gray.600">{user.age} years</Text>
            <Text color="gray.600">•</Text>
            <Text color="gray.600">{user.gender}</Text>
            <Text color="gray.600">•</Text>
            <Text color="gray.600">{user.dietaryPreference}</Text>
          </Flex>
        </VStack>
      </Flex>

      {/* Body Stats */}
      <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" mb={6}>
        <Heading size="md" mb={4} color="brand.600">Body Statistics</Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
          <Stat>
            <StatLabel>Height</StatLabel>
            <StatNumber>{user.height} cm</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Weight</StatLabel>
            <StatNumber>{user.weight} kg</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Activity Level</StatLabel>
            <StatNumber fontSize="lg">{user.activityLevel}</StatNumber>
          </Stat>
        </Grid>
      </Box>

      {/* Nutrition Stats */}
      <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" mb={6}>
        <Heading size="md" mb={4} color="brand.600">Nutrition Information</Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          <Stat>
            <StatLabel>Daily Calorie Target</StatLabel>
            <StatNumber>{user.tdee} kcal</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Food Waste Reduction</StatLabel>
            <StatNumber>{user.carbonSaved}</StatNumber>
          </Stat>
        </Grid>
      </Box>
      
      {/* Account Actions */}
      <Button
        colorScheme="brand"
        size="lg"
        width="100%"
        mb={4}
      >
        Edit Profile
      </Button>
    </Box>
  );
};

export default ProfilePage;