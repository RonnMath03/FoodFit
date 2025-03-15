import { Box, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

function OrderSuccessAnimation() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ 
        duration: 0.6,
        ease: "easeOut"
      }}
    >
      <VStack
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        spacing={4}
        zIndex={2000}
      >
        <Box
          as={motion.div}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: 0.2,
            duration: 0.5,
            ease: "easeOut"
          }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100">
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#48BB78"
              strokeWidth="4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ 
                duration: 1,
                ease: "easeInOut"
              }}
            />
            <motion.path
              d="M 25 50 L 45 70 L 75 35"
              fill="none"
              stroke="#48BB78"
              strokeWidth="4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ 
                delay: 0.5,
                duration: 0.8,
                ease: "easeOut"
              }}
            />
          </svg>
        </Box>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="green.500"
          as={motion.p}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            delay: 0.8,
            duration: 0.5,
            ease: "easeOut"
          }}
        >
          Order Placed Successfully!
        </Text>
      </VStack>
    </motion.div>
  );
}

export default OrderSuccessAnimation;