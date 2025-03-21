'use client';

import { useState, useEffect } from 'react';

// This service would handle API calls to the food database
export const FoodService = {
  // Search for foods in the database
  searchFoods: async (query) => {
    try {
      // In a real implementation, this would call an external API
      console.log(`Searching for: ${query}`);
      
      // Mock API response
      return mockFoodSearch(query);
    } catch (error) {
      console.error('Error searching foods:', error);
      throw error;
    }
  },
  
  // Get food details by ID
  getFoodDetails: async (foodId) => {
    try {
      // In a real implementation, this would call an external API
      console.log(`Getting details for food ID: ${foodId}`);
      
      // Mock API response
      return mockFoodDatabase.find(food => food.id === foodId) || null;
    } catch (error) {
      console.error('Error getting food details:', error);
      throw error;
    }
  },
  
  // Add a custom food to the database
  addCustomFood: async (foodData) => {
    try {
      // In a real implementation, this would call an API to add to the database
      console.log('Adding custom food:', foodData);
      
      // Mock implementation
      const newFood = {
        id: `custom-${Date.now()}`,
        name: foodData.name,
        brand: foodData.brand || 'Custom',
        calories: foodData.calories,
        protein: foodData.protein,
        carbs: foodData.carbs,
        fat: foodData.fat,
        fiber: foodData.fiber || 0,
        sugar: foodData.sugar || 0,
        serving_size: foodData.serving_size,
        serving_unit: foodData.serving_unit,
        is_verified: false,
        created_by: 'current-user' // In a real app, this would be the user ID
      };
      
      // Add to mock database
      mockFoodDatabase.push(newFood);
      
      return newFood;
    } catch (error) {
      console.error('Error adding custom food:', error);
      throw error;
    }
  },
  
  // Get user's recent foods
  getRecentFoods: async (userId) => {
    try {
      // In a real implementation, this would call an API to get user's recent foods
      console.log(`Getting recent foods for user: ${userId}`);
      
      // Mock implementation
      return mockRecentFoods;
    } catch (error) {
      console.error('Error getting recent foods:', error);
      throw error;
    }
  },
  
  // Get user's favorite foods
  getFavoriteFoods: async (userId) => {
    try {
      // In a real implementation, this would call an API to get user's favorite foods
      console.log(`Getting favorite foods for user: ${userId}`);
      
      // Mock implementation
      return mockFavoriteFoods;
    } catch (error) {
      console.error('Error getting favorite foods:', error);
      throw error;
    }
  },
  
  // Toggle favorite status for a food
  toggleFavorite: async (userId, foodId) => {
    try {
      // In a real implementation, this would call an API to toggle favorite status
      console.log(`Toggling favorite status for food ID: ${foodId} for user: ${userId}`);
      
      // Mock implementation
      const isFavorite = mockFavoriteFoods.some(food => food.id === foodId);
      
      if (isFavorite) {
        // Remove from favorites
        const index = mockFavoriteFoods.findIndex(food => food.id === foodId);
        if (index !== -1) {
          mockFavoriteFoods.splice(index, 1);
        }
      } else {
        // Add to favorites
        const food = mockFoodDatabase.find(food => food.id === foodId);
        if (food) {
          mockFavoriteFoods.push(food);
        }
      }
      
      return !isFavorite;
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      throw error;
    }
  }
};

// Mock food database
const mockFoodDatabase = [
  {
    id: '1',
    name: 'Apple',
    brand: '',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    fiber: 4.4,
    sugar: 19,
    serving_size: 1,
    serving_unit: 'medium (182g)',
    is_verified: true
  },
  {
    id: '2',
    name: 'Banana',
    brand: '',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
    sugar: 14,
    serving_size: 1,
    serving_unit: 'medium (118g)',
    is_verified: true
  },
  {
    id: '3',
    name: 'Chicken Breast',
    brand: '',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    serving_size: 100,
    serving_unit: 'g',
    is_verified: true
  },
  {
    id: '4',
    name: 'Brown Rice',
    brand: '',
    calories: 215,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    fiber: 3.5,
    sugar: 0.7,
    serving_size: 1,
    serving_unit: 'cup cooked (195g)',
    is_verified: true
  },
  {
    id: '5',
    name: 'Salmon',
    brand: '',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 13,
    fiber: 0,
    sugar: 0,
    serving_size: 100,
    serving_unit: 'g',
    is_verified: true
  },
  {
    id: '6',
    name: 'Greek Yogurt',
    brand: 'Fage',
    calories: 130,
    protein: 18,
    carbs: 7,
    fat: 0,
    fiber: 0,
    sugar: 7,
    serving_size: 170,
    serving_unit: 'g',
    is_verified: true
  },
  {
    id: '7',
    name: 'Avocado',
    brand: '',
    calories: 240,
    protein: 3,
    carbs: 12,
    fat: 22,
    fiber: 10,
    sugar: 1,
    serving_size: 1,
    serving_unit: 'medium (150g)',
    is_verified: true
  },
  {
    id: '8',
    name: 'Egg',
    brand: '',
    calories: 70,
    protein: 6,
    carbs: 0.6,
    fat: 5,
    fiber: 0,
    sugar: 0.6,
    serving_size: 1,
    serving_unit: 'large (50g)',
    is_verified: true
  },
  {
    id: '9',
    name: 'Oatmeal',
    brand: 'Quaker',
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    fiber: 4,
    sugar: 1,
    serving_size: 40,
    serving_unit: 'g dry',
    is_verified: true
  },
  {
    id: '10',
    name: 'Almond Butter',
    brand: '',
    calories: 98,
    protein: 3.4,
    carbs: 3,
    fat: 9,
    fiber: 1.6,
    sugar: 0.7,
    serving_size: 1,
    serving_unit: 'tbsp (16g)',
    is_verified: true
  }
];

// Mock recent foods
const mockRecentFoods = [
  {
    id: '3',
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    serving_size: 100,
    serving_unit: 'g'
  },
  {
    id: '4',
    name: 'Brown Rice',
    calories: 215,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    serving_size: 1,
    serving_unit: 'cup cooked'
  },
  {
    id: '1',
    name: 'Apple',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    serving_size: 1,
    serving_unit: 'medium'
  }
];

// Mock favorite foods
const mockFavoriteFoods = [
  {
    id: '6',
    name: 'Greek Yogurt',
    calories: 130,
    protein: 18,
    carbs: 7,
    fat: 0,
    serving_size: 170,
    serving_unit: 'g'
  },
  {
    id: '5',
    name: 'Salmon',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 13,
    serving_size: 100,
    serving_unit: 'g'
  }
];

// Mock search function
function mockFoodSearch(query) {
  if (!query) return [];
  
  query = query.toLowerCase();
  
  return mockFoodDatabase.filter(food => 
    food.name.toLowerCase().includes(query) || 
    food.brand.toLowerCase().includes(query)
  );
}

export default FoodService;
