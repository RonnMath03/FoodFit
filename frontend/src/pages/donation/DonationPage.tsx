import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Card,
  CardBody,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Badge,
  FormControl,
  FormLabel,
  Input,
  Select,
  Divider,
} from '@chakra-ui/react';
import { donationService, DonationItem } from '../../services/donationService';

function DonationPage() {
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    expiryDate: '',
    category: 'foodbank' as 'foodbank' | 'composting',
    location: '',
    contact: ''
  });
  const toast = useToast();

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    const data = await donationService.getDonations();
    setDonations(data);
  };

  const handleViewDetails = (donation: DonationItem) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  const handleClaim = async (id: string) => {
    try {
      await donationService.claimDonation(id);
      setDonations(donations.filter(donation => donation.id !== id));
      setIsModalOpen(false);
      toast({
        title: 'Successfully claimed!',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Failed to claim donation',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newDonation = await donationService.addDonation(formData);
      setDonations([...donations, newDonation]);
      setFormData({
        foodName: '',
        quantity: '',
        expiryDate: '',
        category: 'foodbank',
        location: '',
        contact: ''
      });
      toast({
        title: 'Donation added successfully!',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Failed to add donation',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Box width="100%" p={6} borderWidth={1} borderRadius="lg" bg="white">
          <Heading size="md" mb={4}>Add New Donation</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Food Item Name</FormLabel>
                <Input
                  name="foodName"
                  value={formData.foodName}
                  onChange={handleInputChange}
                  placeholder="Enter food item name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Quantity</FormLabel>
                <Input
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 kg, 3 packets"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Expiry Date</FormLabel>
                <Input
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="foodbank">Food Bank</option>
                  <option value="composting">Composting</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Pickup Location</FormLabel>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter pickup location"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Contact Information</FormLabel>
                <Input
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Enter contact details"
                />
              </FormControl>

              <Button type="submit" colorScheme="brand" width="full">
                Add Donation
              </Button>
            </VStack>
          </form>
        </Box>

        <Divider />

        <Box width="100%">
          <Heading size="md" mb={4}>Available Donations</Heading>
          <VStack spacing={4} align="stretch">
            {donations.map((donation) => (
              <Card key={donation.id}>
                <CardBody>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Badge colorScheme={donation.category === 'foodbank' ? 'green' : 'orange'} mb={2}>
                        {donation.category}
                      </Badge>
                      <Text fontSize="lg" fontWeight="semibold">{donation.foodName}</Text>
                      <Text>Quantity: {donation.quantity}</Text>
                    </Box>
                    <Button
                      colorScheme="brand"
                      onClick={() => handleViewDetails(donation)}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </Box>
      </VStack>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Donation Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedDonation && (
              <VStack align="stretch" spacing={3}>
                <Text><strong>Food Item:</strong> {selectedDonation.foodName}</Text>
                <Text><strong>Quantity:</strong> {selectedDonation.quantity}</Text>
                <Text><strong>Expiry Date:</strong> {selectedDonation.expiryDate}</Text>
                <Text><strong>Category:</strong> {selectedDonation.category}</Text>
                <Text><strong>Location:</strong> {selectedDonation.location}</Text>
                <Text><strong>Contact:</strong> {selectedDonation.contact}</Text>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="brand"
              mr={3}
              onClick={() => selectedDonation && handleClaim(selectedDonation.id!)}
            >
              Claim Donation
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default DonationPage;