export interface DonationItem {
  id?: string;
  foodName: string;
  quantity: string;
  expiryDate: string;
  category: 'foodbank' | 'composting';
  location: string;
  contact: string;
}

// Mock service implementation
export const donationService = {
  async getDonations(): Promise<DonationItem[]> {
    // In a real app, this would be an API call
    return [];
  },

  async addDonation(donation: Omit<DonationItem, 'id'>): Promise<DonationItem> {
    // In a real app, this would be an API call
    return {
      ...donation,
      id: Math.random().toString(36).substr(2, 9)
    };
  },

  async claimDonation(id: string): Promise<void> {
    // In a real app, this would be an API call
    return Promise.resolve();
  }
};