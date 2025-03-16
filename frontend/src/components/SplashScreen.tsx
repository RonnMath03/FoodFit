import React, { useEffect } from 'react';
import { Box, Image } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/hunger-level');
    }, 6000); // Increased to 6 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      width="100vw"
      height="100vh"
      backgroundColor="brand.500"
      display="flex"
      alignItems="center"
      justifyContent="center"
      animation={`${fadeIn} 2s ease-in-out`}
      padding={0}
      overflow="hidden"
      position="fixed"
      top="0"
      left="0"
    >
      <Image
        src="images/translogo.png"
        alt="FoodFit Logo"
        maxWidth={{ base: "80%", md: "500px" }}
        width="auto"
        height="auto"
        objectFit="contain"
        animation={`${scaleIn} 2s ease-in-out`}
        quality={95}
        loading="eager"
      />
    </Box>
  );
};

export default SplashScreen;