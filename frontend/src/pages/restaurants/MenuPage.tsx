import React, { useState, useEffect } from 'react';
import { 
  Box, VStack, Heading, Text, SimpleGrid, Button, Divider, HStack,
  Progress, Tooltip, useToast
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useCartStore } from '../../libr/store';
import CaloriesProgressBar from '../../components/CaloriesProgressBar';

const sampleMenu = {
  restaurantName: 'Punjab Dhaba',
  categories: [
    {
      name: 'Starters',
      items: [
        { 
          id: 'a1', 
          name: 'Paneer Tikka', 
          price: 299, 
          calories: 450,
          wastePrediction: {
            percentage: 15,
            feedback: 'Most customers finish this portion'
          }
        },
        { 
          id: 'a2', 
          name: 'Dal Shorba', 
          price: 149, 
          calories: 180,
          wastePrediction: {
            percentage: 10,
            feedback: 'Ideal portion size for one person'
          }
        },
        { 
          id: 'a3', 
          name: 'Veg Spring Roll', 
          price: 199, 
          calories: 280,
          wastePrediction: {
            percentage: 25,
            feedback: 'Consider sharing between two people'
          }
        },
        { 
          id: 'a4', 
          name: 'Chicken 65', 
          price: 349, 
          calories: 320,
          wastePrediction: {
            percentage: 20,
            feedback: 'Portion size good for 2-3 people'
          }
        }
      ]
    },
    {
      name: 'Main Course',
      items: [
        { 
          id: 'm1', 
          name: 'Butter Chicken', 
          price: 399, 
          calories: 550,
          wastePrediction: {
            percentage: 30,
            feedback: 'Large portion, best shared'
          }
        },
        { 
          id: 'm2', 
          name: 'Dal Makhani', 
          price: 299, 
          calories: 340,
          wastePrediction: {
            percentage: 18,
            feedback: 'Good for 2 servings'
          }
        },
        { 
          id: 'm3', 
          name: 'Paneer Butter Masala', 
          price: 349, 
          calories: 480,
          wastePrediction: {
            percentage: 25,
            feedback: 'Recommended for sharing'
          }
        },
        { 
          id: 'm4', 
          name: 'Veg Biryani', 
          price: 299, 
          calories: 460,
          wastePrediction: {
            percentage: 35,
            feedback: 'Large portion size'
          }
        }
      ]
    },
    {
      name: 'Breads',
      items: [
        { 
          id: 'b1', 
          name: 'Butter Naan', 
          price: 49, 
          calories: 180,
          wastePrediction: {
            percentage: 12,
            feedback: 'Single serving size'
          }
        },
        { 
          id: 'b2', 
          name: 'Garlic Roti', 
          price: 39, 
          calories: 140,
          wastePrediction: {
            percentage: 8,
            feedback: 'Perfect individual portion'
          }
        },
        { 
          id: 'b3', 
          name: 'Laccha Paratha', 
          price: 59, 
          calories: 200,
          wastePrediction: {
            percentage: 15,
            feedback: 'Rich and filling'
          }
        },
        { 
          id: 'b4', 
          name: 'Missi Roti', 
          price: 49, 
          calories: 150,
          wastePrediction: {
            percentage: 10,
            feedback: 'Good single portion'
          }
        }
      ]
    }
  ]
};

function MenuPage() {
  const { restaurantId } = useParams();
  const addItem = useCartStore(state => state.addItem);
  const toast = useToast();

  const [consumedCalories, setConsumedCalories] = useState(0);
  const username = localStorage.getItem('currentUser');
  const dailyCalories = parseFloat(localStorage.getItem(`${username}_dailyCalories`) || '900');

  const handleAddToCart = (item) => {
    addItem(item);
    setConsumedCalories(prev => prev + item.calories);
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-right"
    });
  };

  useEffect(() => {
    const storedConsumedCalories = parseFloat(localStorage.getItem(`${username}_consumedCalories`) || '0');
    setConsumedCalories(storedConsumedCalories);
  }, [username]);

  useEffect(() => {
    localStorage.setItem(`${username}_consumedCalories`, consumedCalories.toString());
  }, [consumedCalories, username]);

  const getWasteMeterColor = (percentage) => {
    if (percentage <= 20) return 'green';
    if (percentage <= 50) return 'orange';
    return 'red';
  };

  return (
    <>
      <Box maxW="4xl" mx="auto" bg="white" p={4} sm={8} borderRadius="lg" boxShadow="md">
        <VStack spacing={4} align="stretch">
          <Heading size={{ base: "lg", md: "xl" }} color="brand.700">
            {sampleMenu.restaurantName}
          </Heading>
          
          {sampleMenu.categories.map((category, index) => (
            <Box key={index}>
              <Heading 
                size={{ base: "md", md: "lg" }} 
                color="brand.600" 
                mb={3}
              >
                {category.name}
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {category.items.map((item) => (
                  <Box 
                    key={item.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    _hover={{ shadow: 'sm' }}
                  >
                    <VStack align="stretch" spacing={2}>
                      <Heading size="sm">{item.name}</Heading>
                      <HStack justify="space-between">
                        <Text color="gray.600">₹{item.price}</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.600">
                        {item.calories} calories
                      </Text>
                      
                      <Tooltip label={item.wastePrediction?.feedback || 'Based on customer feedback'}>
                        <Text fontSize="sm" color="gray.600">
                          Leftover Prediction: {item.wastePrediction?.percentage || 0}%
                        </Text>
                      </Tooltip>

                      <Button
                        size="sm"
                        bg="brand.500"
                        color="white"
                        onClick={() => handleAddToCart(item)}
                        _hover={{ bg: 'brand.600' }}
                      >
                        Add to Cart
                      </Button>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
              {index < sampleMenu.categories.length - 1 && <Divider my={4} />}
            </Box>
          ))}
        </VStack>
      </Box>
      
      <CaloriesProgressBar 
        consumedCalories={consumedCalories}
        dailyCalories={dailyCalories}
      />
    </>
  );
}

export default MenuPage;