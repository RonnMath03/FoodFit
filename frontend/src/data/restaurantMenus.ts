export const restaurantMenus = {
  '1': {  // Punjab Dhaba
    restaurantName: 'Punjab Dhaba',
    categories: [
      {
        name: 'Main Course',
        items: [
          { id: '1_1', name: 'Butter Chicken', price: 320, calories: 550, portion: 'Regular', wastePrediction: { percentage: 15, feedback: 'Moderate portion size' } },
          { id: '1_2', name: 'Dal Makhani', price: 280, calories: 450, portion: 'Regular', wastePrediction: { percentage: 10, feedback: 'Popular choice' } }
        ]
      }
    ]
  },
  '2': {  // Dakshin
    restaurantName: 'Dakshin',
    categories: [
      {
        name: 'South Indian Specials',
        items: [
          { id: '2_1', name: 'Masala Dosa', price: 180, calories: 350, portion: 'Large', wastePrediction: { percentage: 5, feedback: 'Popular size' } },
          { id: '2_2', name: 'Idli Sambar', price: 150, calories: 250, portion: 'Regular', wastePrediction: { percentage: 8, feedback: 'Well-portioned' } }
        ]
      }
    ]
  },
  '3': {  // Biryani House
    restaurantName: 'Biryani House',
    categories: [
      {
        name: 'Biryani Specials',
        items: [
          { id: '3_1', name: 'Hyderabadi Biryani', price: 350, calories: 650, portion: 'Regular', wastePrediction: { percentage: 12, feedback: 'Filling portion' } },
          { id: '3_2', name: 'Chicken 65', price: 280, calories: 450, portion: 'Medium', wastePrediction: { percentage: 10, feedback: 'Good sharing size' } }
        ]
      }
    ]
  },
  '4': {  // Chennai Express
    restaurantName: 'Chennai Express',
    categories: [
      {
        name: 'Traditional',
        items: [
          { id: '4_1', name: 'Filter Coffee', price: 60, calories: 120, portion: 'Regular', wastePrediction: { percentage: 2, feedback: 'Perfect size' } },
          { id: '4_2', name: 'Uttapam', price: 160, calories: 300, portion: 'Regular', wastePrediction: { percentage: 7, feedback: 'Good portion' } }
        ]
      }
    ]
  },
  '5': {  // Gujarat Bhavan
    restaurantName: 'Gujarat Bhavan',
    categories: [
      {
        name: 'Thali',
        items: [
          { id: '5_1', name: 'Gujarati Thali', price: 250, calories: 800, portion: 'Full', wastePrediction: { percentage: 15, feedback: 'Large portion' } },
          { id: '5_2', name: 'Dhokla', price: 120, calories: 200, portion: 'Regular', wastePrediction: { percentage: 5, feedback: 'Perfect snack size' } }
        ]
      }
    ]
  }
};