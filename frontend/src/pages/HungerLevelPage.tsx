import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  Slider, 
  SliderTrack, 
  SliderFilledTrack, 
  SliderThumb, 
  Text,
  Button,
  HStack,
  Flex,
  Icon,
  Image
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const HungerLevelPage = () => {
  const [hungerLevel, setHungerLevel] = useState(3);
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/restaurants');
  };

  const handleComfortFood = () => {
    // Navigate to restaurants with comfort food parameter
    navigate('/restaurants?type=comfort');
  };

  // Mapping hunger levels to emojis
  const hungerEmojis = {
    1: '😌', // Not hungry
    2: '🙂', // Slightly hungry
    3: '😐', // Moderately hungry
    4: '😖', // Very hungry
    5: '😫', // Extremely hungry
  };

  return (
    <Box
      width="100%"
      height="100vh"
      backgroundColor="white"
      display="flex"
      alignItems="top"
      justifyContent="center"
      overflow="hidden"
      px={4}
    >
      <VStack spacing={4} width="100%" maxWidth="500px">
        <Image 
          src="/images/logo5.png"
          alt="FoodFit Logo" 
          width="230px"
          mb={2}
        />
        
        <Text fontSize="2xl" fontWeight="bold">
          How hungry are you?
        </Text>
        
        <Box width="100%" padding={2}>
          <Slider
            aria-label="hunger-level"
            defaultValue={3}
            min={1}
            max={5}
            step={1}
            onChange={(val) => setHungerLevel(val)}
          >
            <SliderTrack>
              <SliderFilledTrack backgroundColor="#FFD700" />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          
          <HStack justifyContent="space-between" mt={2} width="100%">
            <Text fontSize="sm">Not Hungry</Text>
            <Text fontSize="sm">Extremely Hungry</Text>
          </HStack>
          
          <Text textAlign="center" mt={4} fontSize="3xl">
            {hungerEmojis[hungerLevel as keyof typeof hungerEmojis]}
          </Text>
          <Text textAlign="center" mt={1} mb={2}>
            Level: {hungerLevel}
          </Text>
        </Box>
        
        <Button
          backgroundColor="#FFD700"
          color="black"
          size="lg"
          width="200px"
          _hover={{ backgroundColor: "#E6C200" }}
          onClick={handleContinue}
          mb={4}
        >
          Continue
        </Button>
        
        <Flex 
          direction="column" 
          alignItems="center" 
          backgroundColor="rgba(255, 240, 245, 0.9)"
          borderRadius="lg"
          p={4}
          width="100%"
          maxWidth="350px"
          boxShadow="0 2px 8px rgba(0,0,0,0.1)"
          border="1px solid rgba(255,200,220,0.3)"
        >
          <Text fontSize="md" mb={3} fontWeight="500" color="gray.700" align="center">
            Feeling stressed or need a mood boost?
          </Text>
          <Button
            backgroundColor="brand.500"
            color="white"
            size="lg"
            width="100%"
            height="60px"
            _hover={{ backgroundColor: "brand.600", transform: "translateY(-2px)" }}
            _active={{ transform: "translateY(0)" }}
            onClick={handleComfortFood}
            borderRadius="md"
            transition="all 0.2s"
            boxShadow="0 4px 6px rgba(0,0,0,0.1)"
          >
            <HStack spacing={3}>
              <Flex>
                <Text fontSize="xl" mx={1}>🍕</Text>
              </Flex>
              <Text fontWeight="bold">Comfort Food</Text>
              <Flex>
                <Text fontSize="xl" mx={1}>🍕</Text>
              </Flex>
            </HStack>
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default HungerLevelPage;