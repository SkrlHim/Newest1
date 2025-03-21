'use client';

import { useState, useEffect } from 'react';
import FoodService from '@/services/FoodService';

// This service handles meal logging and calorie tracking
export const MealService = {
  // Log a meal entry
  logMeal: async (userId, mealData) => {
    try {
      // In a real implementation, this would call an API to save to the database
      console.log(`Logging meal for user: ${userId}`, mealData);
      
      // Mock implementation
      const newMeal = {
        id: `meal-${Date.now()}`,
        user_id: userId,
        meal_type: mealData.meal_type,
        meal_date: mealData.meal_date || new Date().toISOString().split('T')[0],
        foods: mealData.foods.map(food => ({
          ...food,
          id: food.id,
          servings: food.servings || 1
        })),
        created_at: new Date().toISOString()
      };
      
      // Add to mock database
      mockMealEntries.push(newMeal);
      
      // Update recent foods
      mealData.foods.forEach(food => {
        if (!mockRecentFoods.some(recentFood => recentFood.id === food.id)) {
          mockRecentFoods.unshift(food);
          if (mockRecentFoods.length > 10) {
            mockRecentFoods.pop();
          }
        }
      });
      
      return newMeal;
    } catch (error) {
      console.error('Error logging meal:', error);
      throw error;
    }
  },
  
  // Get user's meals for a specific date
  getMealsByDate: async (userId, date) => {
    try {
      // In a real implementation, this would call an API to get meals from the database
      console.log(`Getting meals for user: ${userId} on date: ${date}`);
      
      // Mock implementation
      return mockMealEntries.filter(
        meal => meal.user_id === userId && meal.meal_date === date
      );
    } catch (error) {
      console.error('Error getting meals by date:', error);
      throw error;
    }
  },
  
  // Get user's meals for a date range
  getMealsByDateRange: async (userId, startDate, endDate) => {
    try {
      // In a real implementation, this would call an API to get meals from the database
      console.log(`Getting meals for user: ${userId} from ${startDate} to ${endDate}`);
      
      // Mock implementation
      return mockMealEntries.filter(
        meal => meal.user_id === userId && 
               meal.meal_date >= startDate && 
               meal.meal_date <= endDate
      );
    } catch (error) {
      console.error('Error getting meals by date range:', error);
      throw error;
    }
  },
  
  // Update a meal entry
  updateMeal: async (mealId, mealData) => {
    try {
      // In a real implementation, this would call an API to update the database
      console.log(`Updating meal: ${mealId}`, mealData);
      
      // Mock implementation
      const mealIndex = mockMealEntries.findIndex(meal => meal.id === mealId);
      
      if (mealIndex !== -1) {
        mockMealEntries[mealIndex] = {
          ...mockMealEntries[mealIndex],
          ...mealData,
          updated_at: new Date().toISOString()
        };
        
        return mockMealEntries[mealIndex];
      }
      
      throw new Error('Meal not found');
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  },
  
  // Delete a meal entry
  deleteMeal: async (mealId) => {
    try {
      // In a real implementation, this would call an API to delete from the database
      console.log(`Deleting meal: ${mealId}`);
      
      // Mock implementation
      const mealIndex = mockMealEntries.findIndex(meal => meal.id === mealId);
      
      if (mealIndex !== -1) {
        mockMealEntries.splice(mealIndex, 1);
        return true;
      }
      
      throw new Error('Meal not found');
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  },
  
  // Calculate daily calorie summary
  getDailyCalorieSummary: async (userId, date) => {
    try {
      // In a real implementation, this would call an API to calculate from the database
      console.log(`Calculating daily calorie summary for user: ${userId} on date: ${date}`);
      
      // Get meals for the date
      const meals = await this.getMealsByDate(userId, date);
      
      // Calculate totals
      const summary = {
        total_calories: 0,
        total_protein: 0,
        total_carbs: 0,
        total_fat: 0,
        meals: {}
      };
      
      // Group by meal type
      meals.forEach(meal => {
        if (!summary.meals[meal.meal_type]) {
          summary.meals[meal.meal_type] = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            foods: []
          };
        }
        
        meal.foods.forEach(food => {
          const calories = food.calories * food.servings;
          const protein = food.protein * food.servings;
          const carbs = food.carbs * food.servings;
          const fat = food.fat * food.servings;
          
          summary.total_calories += calories;
          summary.total_protein += protein;
          summary.total_carbs += carbs;
          summary.total_fat += fat;
          
          summary.meals[meal.meal_type].calories += calories;
          summary.meals[meal.meal_type].protein += protein;
          summary.meals[meal.meal_type].carbs += carbs;
          summary.meals[meal.meal_type].fat += fat;
          
          summary.meals[meal.meal_type].foods.push({
            ...food,
            total_calories: calories
          });
        });
      });
      
      return summary;
    } catch (error) {
      console.error('Error calculating daily calorie summary:', error);
      throw error;
    }
  },
  
  // Get calorie history for a date range
  getCalorieHistory: async (userId, startDate, endDate) => {
    try {
      // In a real implementation, this would call an API to get from the database
      console.log(`Getting calorie history for user: ${userId} from ${startDate} to ${endDate}`);
      
      // Mock implementation
      const history = [];
      
      // Create a date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      const current = new Date(start);
      
      while (current <= end) {
        const dateString = current.toISOString().split('T')[0];
        
        // Get meals for this date
        const meals = mockMealEntries.filter(
          meal => meal.user_id === userId && meal.meal_date === dateString
        );
        
        // Calculate totals
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        
        meals.forEach(meal => {
          meal.foods.forEach(food => {
            totalCalories += food.calories * food.servings;
            totalProtein += food.protein * food.servings;
            totalCarbs += food.carbs * food.servings;
            totalFat += food.fat * food.servings;
          });
        });
        
        history.push({
          date: dateString,
          calories: totalCalories,
          protein: totalProtein,
          carbs: totalCarbs,
          fat: totalFat,
          goal: 2200 // This would come from user settings in a real app
        });
        
        // Move to next day
        current.setDate(current.getDate() + 1);
      }
      
      return history;
    } catch (error) {
      console.error('Error getting calorie history:', error);
      throw error;
    }
  },
  
  // Calculate calorie goal based on user profile and goals
  calculateCalorieGoal: (userProfile) => {
    // Mifflin-St Jeor Equation for BMR
    let bmr;
    
    if (userProfile.gender === 'male') {
      bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;
    } else {
      bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age - 161;
    }
    
    // Activity multiplier
    let activityMultiplier;
    switch (userProfile.activity_level) {
      case 'sedentary':
        activityMultiplier = 1.2;
        break;
      case 'lightly_active':
        activityMultiplier = 1.375;
        break;
      case 'moderately_active':
        activityMultiplier = 1.55;
        break;
      case 'very_active':
        activityMultiplier = 1.725;
        break;
      case 'extremely_active':
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.2;
    }
    
    // TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityMultiplier;
    
    // Adjust based on goal
    let calorieGoal;
    switch (userProfile.goal_type) {
      case 'weight_loss':
        calorieGoal = tdee - 500; // 500 calorie deficit for ~1lb/week loss
        break;
      case 'muscle_gain':
        calorieGoal = tdee + 300; // 300 calorie surplus for muscle gain
        break;
      case 'maintenance':
        calorieGoal = tdee;
        break;
      default:
        calorieGoal = tdee;
    }
    
    // Ensure minimum healthy calorie intake
    const minCalories = userProfile.gender === 'male' ? 1500 : 1200;
    return Math.max(Math.round(calorieGoal), minCalories);
  }
};

// Mock meal entries
const mockMealEntries = [
  {
    id: 'meal-1',
    user_id: 'user-1',
    meal_type: 'breakfast',
    meal_date: '2025-03-21',
    foods: [
      {
        id: '6',
        name: 'Greek Yogurt',
        calories: 130,
        protein: 18,
        carbs: 7,
        fat: 0,
        serving_size: 170,
        serving_unit: 'g',
        servings: 1
      },
      {
        id: '1',
        name: 'Apple',
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
        serving_size: 1,
        serving_unit: 'medium',
        servings: 1
      }
    ],
    created_at: '2025-03-21T08:30:00Z'
  },
  {
    id: 'meal-2',
    user_id: 'user-1',
    meal_type: 'lunch',
    meal_date: '2025-03-21',
    foods: [
      {
        id: '3',
        name: 'Chicken Breast',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        serving_size: 100,
        serving_unit: 'g',
        servings: 1.5
      },
      {
        id: '4',
        name: 'Brown Rice',
        calories: 215,
        protein: 5,
        carbs: 45,
        fat: 1.8,
        serving_size: 1,
        serving_unit: 'cup cooked',
        servings: 1
      }
    ],
    created_at: '2025-03-21T12:45:00Z'
  },
  {
    id: 'meal-3',
    user_id: 'user-1',
    meal_type: 'breakfast',
    meal_date: '2025-03-20',
    foods: [
      {
        id: '9',
        name: 'Oatmeal',
        calories: 150,
        protein: 5,
        carbs: 27,
        fat: 3,
        serving_size: 40,
        serving_unit: 'g dry',
        servings: 1
      },
      {
        id: '2',
        name: 'Banana',
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4,
        serving_size: 1,
        serving_unit: 'medium',
        servings: 1
      }
    ],
    created_at: '2025-03-20T08:15:00Z'
  },
  {
    id: 'meal-4',
    user_id: 'user-1',
    meal_type: 'lunch',
    meal_date: '2025-03-20',
    foods: [
      {
        id: '5',
        name: 'Salmon',
        calories: 206,
        protein: 22,
        carbs: 0,
        fat: 13,
        serving_size: 100,
        serving_unit: 'g',
        servings: 1
      },
      {
        id: '7',
        name: 'Avocado',
        calories: 240,
        protein: 3,
        carbs: 12,
        fat: 22,
        serving_size: 1,
        serving_unit: 'medium',
        servings: 0.5
      }
    ],
    created_at: '2025-03-20T13:00:00Z'
  },
  {
    id: 'meal-5',
    user_id: 'user-1',
    meal_type: 'dinner',
    meal_date: '2025-03-20',
    foods: [
      {
        id: '3',
        name: 'Chicken Breast',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        serving_size: 100,
        serving_unit: 'g',
        servings: 1.5
      },
      {
        id: '4',
        name: 'Brown Rice',
        calories: 215,
        protein: 5,
        carbs: 45,
        fat: 1.8,
        serving_size: 1,
        serving_unit: 'cup cooked',
        servings: 1
      }
    ],
    created_at: '2025-03-20T19:30:00Z'
  }
];

// Reference to mockRecentFoods from FoodService
const mockRecentFoods = [];

export default MealService;
