import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  Heading,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Select,
  Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../libr/store';

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // State to manage form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState(''); // 'male' or 'female'
  const [dietaryPreference, setDietaryPreference] = useState(''); // 'vegetarian', 'vegan', 'non-vegetarian'
  const [error, setError] = useState('');
  const [calories, setCalories] = useState(null); // To store calculated calories

  // State to toggle between login form and post-login form
  const [showLoginForm, setShowLoginForm] = useState(true);

  useEffect(() => {
    if (username) {
      const savedHeight = localStorage.getItem(`${username}_height`);
      const savedWeight = localStorage.getItem(`${username}_weight`);
      const savedAge = localStorage.getItem(`${username}_age`);
      const savedGender = localStorage.getItem(`${username}_gender`);
      const savedDietaryPreference = localStorage.getItem(`${username}_dietaryPreference`);
      if (savedHeight) setHeight(savedHeight);
      if (savedWeight) setWeight(savedWeight);
      if (savedAge) setAge(savedAge);
      if (savedGender) setGender(savedGender);
      if (savedDietaryPreference) setDietaryPreference(savedDietaryPreference);
    }
  }, [username]);

  // Handle login logic
  const handleLogin = () => {
    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError('Both username and password are required.');
      return;
    }

    // Simulate a successful login
    login({ id: '1', name: username });
    setShowLoginForm(false); // Show the rest of the form
    setError(''); // Clear error message
  };

  const calculateAndNavigate = () => {
    if (!height || !weight || !age || !gender || !dietaryPreference) {
      setError('Please fill in all fields.');
      return;
    }

    // Save user preferences
    localStorage.setItem(`${username}_height`, height);
    localStorage.setItem(`${username}_weight`, weight);
    localStorage.setItem(`${username}_age`, age);
    localStorage.setItem(`${username}_gender`, gender);
    localStorage.setItem(`${username}_dietaryPreference`, dietaryPreference);

    // Calculate BMR in background
    const bmr = gender === 'male'
      ? 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseInt(age) + 5
      : 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseInt(age) - 161;
    const dailyCalories = bmr * 1.2;

    // Store calculated calories
    localStorage.setItem(`${username}_dailyCalories`, dailyCalories.toString());
    localStorage.setItem(`${username}_consumedCalories`, '0');

    // Navigate to restaurants page
    navigate('/restaurants');
  };

  return (
    <Box maxW="md" mx="auto" mt={8} bg="white" p={8} borderRadius="lg" boxShadow="md">
      <VStack spacing={4}>
        <Box mb={4} display="flex" justifyContent="center">
          <Image 
            src="/images/logo5.png"  // Changed from logo5.jpeg to logo5.png
            alt="Logo"
            height="60px"
            objectFit="contain"
          />
        </Box>
        <Heading color="brand.700">Welcome Back</Heading>

        {/* Show Login Form */}
        {showLoginForm ? (
          <>
            {/* Username Field */}
            <FormControl isInvalid={!!error && !username.trim()}>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>

            {/* Password Field */}
            <FormControl isInvalid={!!error && !password.trim()}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            {/* Error Message */}
            {error && (
              <FormErrorMessage textAlign="center" color="red.500">
                {error}
              </FormErrorMessage>
            )}

            {/* Login Button */}
            <Button
              bg="brand.500"
              color="white"
              size="lg"
              width="full"
              onClick={handleLogin}
              _hover={{ bg: 'brand.600' }}
            >
              Login
            </Button>
          </>
        ) : (
          <>
            {/* Height */}
            <FormControl isInvalid={!height && !!error}>
              <FormLabel>Height (in cm)</FormLabel>
              <Input
                type="number"
                placeholder="Enter your height in cm"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </FormControl>

            {/* Weight */}
            <FormControl isInvalid={!weight && !!error}>
              <FormLabel>Weight (in kg)</FormLabel>
              <Input
                type="number"
                placeholder="Enter your weight in kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </FormControl>

            {/* Age */}
            <FormControl isInvalid={!age && !!error}>
              <FormLabel>Age</FormLabel>
              <Input
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </FormControl>

            {/* Gender */}
            <FormControl isInvalid={!gender && !!error}>
              <FormLabel>Gender</FormLabel>
              <RadioGroup value={gender} onChange={setGender}>
                <Stack direction="row">
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {/* Dietary Preference */}
            <FormControl isInvalid={!dietaryPreference && !!error}>
              <FormLabel>Dietary Preference</FormLabel>
              <Select
                placeholder="Select dietary preference"
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
              </Select>
            </FormControl>

            {/* Error Message */}
            {error && (
              <FormErrorMessage textAlign="center" color="red.500">
                {error}
              </FormErrorMessage>
            )}

            {/* Single Button for Navigation */}
            <Button
              bg="brand.500"
              color="white"
              size="lg"
              width="full"
              onClick={calculateAndNavigate}
              _hover={{ bg: 'brand.600' }}
            >
              Continue to Restaurants
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
}

export default LoginPage;