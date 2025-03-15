import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  HStack, 
  Button, 
  Divider,
  SimpleGrid,
  Badge,
  useToast,
  Progress,
  Tooltip,
  AlertDialog, 
  AlertDialogOverlay, 
  AlertDialogContent,
  AlertDialogHeader, 
  AlertDialogBody, 
  AlertDialogFooter,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useCartStore } from '../../libr/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import OrderSuccessAnimation from '../../components/OrderSuccessAnimation';

function CartPage() {
  const toast = useToast();
  const { items, removeItem, updateQuantity } = useCartStore();
  const username = localStorage.getItem('currentUser');
  const dailyCalories = parseFloat(localStorage.getItem(`${username}_dailyCalories`) || '900'); // Changed from '500' to '900'
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast({
      title: "Item removed",
      description: `${name} has been removed from your cart`,
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "bottom-right"
    });
  };

  const handleQuantityChange = (id: string, newQuantity: number, name: string) => {
    if (newQuantity < 1) {
      handleRemoveItem(id, name);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  const totalCalories = items.reduce((total, item) => {
    return total + (item.calories * (item.quantity || 1));
  }, 0);

  const totalAmount = items.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);

  const caloriesPercentage = (totalCalories / dailyCalories) * 100;
  const remainingCalories = dailyCalories - totalCalories;
  const isExceedingCalories = totalCalories > dailyCalories;

  const handleCheckout = () => {
    if (isExceedingCalories) {
      onOpen();
    } else {
      setShowSummary(true);
    }
  };

  const handleConfirmOrder = () => {
    setShowSummary(false);
    setShowSuccess(true);
    
    // Navigate to restaurant menu after animation completes
    setTimeout(() => {
      navigate('/restaurants');  // Changed from /checkout to /restaurants
    }, 2000);
  };

  return (
    <>
      <AnimatePresence>
        {showSuccess && <OrderSuccessAnimation />}
      </AnimatePresence>

      <Box maxW="4xl" mx="auto" bg="white" p={4} borderRadius="lg" boxShadow="md">
        <VStack spacing={4} align="stretch">
          <Heading size="lg" color="brand.700">Your Cart</Heading>
          
          {/* Calories Progress Bar */}
          <Box p={4} borderWidth="1px" borderRadius="md">
            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <Text>Current Calorie Target:</Text>  {/* Changed from "Daily" to "Current" */}
                <Text fontWeight="bold">{Math.round(dailyCalories)} cal</Text>
              </HStack>
              <Tooltip label={`${Math.round(remainingCalories)} calories remaining`}>
                <Progress 
                  value={caloriesPercentage} 
                  colorScheme={caloriesPercentage > 90 ? 'red' : 'green'}
                  size="lg"
                  borderRadius="full"
                />
              </Tooltip>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  Consumed: {Math.round(totalCalories)} cal
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Remaining: {Math.round(remainingCalories)} cal
                </Text>
              </HStack>
            </VStack>
          </Box>

          {items.length === 0 ? (
            <Text color="gray.500">Your cart is empty</Text>
          ) : (
            <>
              <SimpleGrid columns={1} spacing={4}>
                {items.map((item) => (
                  <Box
                    as={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    key={item.id} 
                    p={4} 
                    borderWidth="1px" 
                    borderRadius="md"
                    _hover={{ shadow: 'sm' }}
                  >
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Heading size="sm">{item.name}</Heading>
                        <Text fontSize="sm" color="gray.600">
                          {item.portion} • {item.calories} calories per serving
                        </Text>
                        <Text color="brand.600">₹{item.price} × {item.quantity || 1} = ₹{item.price * (item.quantity || 1)}</Text>
                      </VStack>
                      <VStack spacing={2}>
                        <HStack>
                          <Button 
                            size="sm" 
                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1, item.name)}
                            isDisabled={item.quantity === 1}
                          >
                            -
                          </Button>
                          <Text fontWeight="medium" minW="2rem" textAlign="center">
                            {item.quantity || 1}
                          </Text>
                          <Button 
                            size="sm" 
                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1, item.name)}
                          >
                            +
                          </Button>
                        </HStack>
                        <Button 
                          size="sm" 
                          colorScheme="red" 
                          variant="ghost"
                          onClick={() => handleRemoveItem(item.id, item.name)}
                        >
                          Remove
                        </Button>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>

              <Divider my={4} />

              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <Text>Total Calories:</Text>
                  <Badge colorScheme="purple" p={2} borderRadius="md">
                    {totalCalories} calories
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text>Total Amount:</Text>
                  <Text fontWeight="bold" color="brand.600">₹{totalAmount}</Text>
                </HStack>
              </VStack>

              <Button 
                size="lg" 
                bg="brand.500" 
                color="white" 
                mt={4}
                onClick={handleCheckout}
                _hover={{ bg: 'brand.600' }}
              >
                Proceed to Checkout
              </Button>
            </>
          )}
        </VStack>

        {/* Order Summary Modal */}
        <Modal isOpen={showSummary} onClose={() => setShowSummary(false)} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Order Summary</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                {items.map((item) => (
                  <HStack key={item.id} justify="space-between">
                    <Text>{item.name} × {item.quantity}</Text>
                    <Text>₹{item.price * (item.quantity || 1)}</Text>
                  </HStack>
                ))}
                
                <Divider />
                
                <Box p={4} bg="gray.50" borderRadius="md">
                  <VStack spacing={2} align="stretch">
                    <HStack justify="space-between">
                      <Text>Total Items:</Text>
                      <Text>{items.reduce((acc, item) => acc + (item.quantity || 1), 0)}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Total Amount:</Text>
                      <Text fontWeight="bold">₹{totalAmount}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Total Calories:</Text>
                      <Text color={isExceedingCalories ? "red.500" : "green.500"}>
                        {totalCalories} / {dailyCalories} cal
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={() => setShowSummary(false)}>
                Back
              </Button>
              <Button 
                colorScheme="brand" 
                onClick={handleConfirmOrder}
                bg="brand.500"
                _hover={{ bg: 'brand.600' }}
              >
                Confirm Order
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Calorie Warning Dialog */}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Exceeding Daily Calorie Limit
              </AlertDialogHeader>

              <AlertDialogBody>
                Your order exceeds your daily calorie target by{' '}
                {Math.round(totalCalories - dailyCalories)} calories. 
                Are you sure you want to continue?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  colorScheme="red" 
                  onClick={() => {
                    onClose();
                    showOrderSummary();
                  }} 
                  ml={3}
                >
                  Continue Anyway
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </>
  );
}

export default CartPage;