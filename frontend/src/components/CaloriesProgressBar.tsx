import React from 'react';
import { Box, Progress, Text, VStack } from '@chakra-ui/react';

interface CaloriesProgressBarProps {
  consumedCalories: number;
  dailyCalories: number;
}

function CaloriesProgressBar({ consumedCalories, dailyCalories }: CaloriesProgressBarProps) {
  const percentage = (consumedCalories / dailyCalories) * 100;
  
  return (
    <Box
      position="fixed"
      top="20" // Changed from bottom to top
      right="4"
      bg="white"
      p={4}
      borderRadius="lg"
      boxShadow="lg"
      width="300px"
      zIndex={1000}
      transition="all 0.3s" // Added smooth transition
      opacity={consumedCalories > 0 ? 1 : 0} // Hide when no calories consumed
      transform={consumedCalories > 0 ? "translateY(0)" : "translateY(-20px)"} // Slide in from top
    >
      <VStack spacing={2} align="stretch">
        <Text fontSize="sm" fontWeight="medium">
          Calories: {Math.round(consumedCalories)} / {Math.round(dailyCalories)}
        </Text>
        <Progress 
          value={percentage} 
          colorScheme={percentage > 100 ? 'red' : 'green'}
          borderRadius="full"
          size="sm"
        />
      </VStack>
    </Box>
  );
}

export default CaloriesProgressBar;