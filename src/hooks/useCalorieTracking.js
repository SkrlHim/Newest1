'use client';

import { useState, useEffect } from 'react';
import FoodService from '@/services/FoodService';
import MealService from '@/services/MealService';

// Custom hook for food search functionality
export function useFoodSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search for foods when search term changes
  useEffect(() => {
    const searchFoods = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const results = await FoodService.searchFoods(searchTerm);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching foods:', err);
        setError('Failed to search foods. Please try again.');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(searchFoods, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  
  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isLoading,
    error
  };
}

// Custom hook for meal logging functionality
export function useMealLogging(userId, date = new Date().toISOString().split('T')[0]) {
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [calorySummary, setCalorySummary] = useState({
    total_calories: 0,
    total_protein: 0,
    total_carbs: 0,
    total_fat: 0,
    meals: {}
  });
  
  // Fetch meals for the selected date
  const fetchMeals = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const mealEntries = await MealService.getMealsByDate(userId, date);
      
      // Group by meal type
      const groupedMeals = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
      };
      
      mealEntries.forEach(meal => {
        if (groupedMeals[meal.meal_type]) {
          groupedMeals[meal.meal_type] = [...groupedMeals[meal.meal_type], ...meal.foods];
        }
      });
      
      setMeals(groupedMeals);
      
      // Calculate calorie summary
      const summary = await MealService.getDailyCalorieSummary(userId, date);
      setCalorySummary(summary);
    } catch (err) {
      console.error('Error fetching meals:', err);
      setError('Failed to load meals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load meals on initial render and when date changes
  useEffect(() => {
    fetchMeals();
  }, [userId, date]);
  
  // Add food to a meal
  const addFoodToMeal = async (mealType, food, servings = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const foodWithServings = {
        ...food,
        servings
      };
      
      await MealService.logMeal(userId, {
        meal_type: mealType,
        meal_date: date,
        foods: [foodWithServings]
      });
      
      // Refresh meals
      await fetchMeals();
    } catch (err) {
      console.error('Error adding food to meal:', err);
      setError('Failed to add food to meal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Remove food from a meal
  const removeFoodFromMeal = async (mealType, foodId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get meals for this date and type
      const mealEntries = await MealService.getMealsByDate(userId, date);
      const mealEntry = mealEntries.find(meal => meal.meal_type === mealType);
      
      if (mealEntry) {
        // Filter out the food
        const updatedFoods = mealEntry.foods.filter(food => food.id !== foodId);
        
        if (updatedFoods.length > 0) {
          // Update the meal with remaining foods
          await MealService.updateMeal(mealEntry.id, {
            foods: updatedFoods
          });
        } else {
          // Delete the meal if no foods remain
          await MealService.deleteMeal(mealEntry.id);
        }
        
        // Refresh meals
        await fetchMeals();
      }
    } catch (err) {
      console.error('Error removing food from meal:', err);
      setError('Failed to remove food from meal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    meals,
    calorySummary,
    isLoading,
    error,
    addFoodToMeal,
    removeFoodFromMeal,
    refreshMeals: fetchMeals
  };
}

// Custom hook for calorie history and tracking
export function useCalorieTracking(userId, days = 7) {
  const [calorieHistory, setCalorieHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Calculate date range
  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };
  
  // Fetch calorie history
  const fetchCalorieHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { startDate, endDate } = getDateRange();
      const history = await MealService.getCalorieHistory(userId, startDate, endDate);
      setCalorieHistory(history);
    } catch (err) {
      console.error('Error fetching calorie history:', err);
      setError('Failed to load calorie history. Please try again.');
      setCalorieHistory([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load calorie history on initial render
  useEffect(() => {
    fetchCalorieHistory();
  }, [userId, days]);
  
  // Calculate statistics
  const calculateStats = () => {
    if (calorieHistory.length === 0) {
      return {
        averageCalories: 0,
        averageProtein: 0,
        averageCarbs: 0,
        averageFat: 0,
        calorieDeficit: 0,
        daysUnderGoal: 0,
        daysOverGoal: 0
      };
    }
    
    const totalCalories = calorieHistory.reduce((sum, day) => sum + day.calories, 0);
    const totalProtein = calorieHistory.reduce((sum, day) => sum + day.protein, 0);
    const totalCarbs = calorieHistory.reduce((sum, day) => sum + day.carbs, 0);
    const totalFat = calorieHistory.reduce((sum, day) => sum + day.fat, 0);
    const totalGoal = calorieHistory.reduce((sum, day) => sum + day.goal, 0);
    
    const daysUnderGoal = calorieHistory.filter(day => day.calories <= day.goal).length;
    const daysOverGoal = calorieHistory.filter(day => day.calories > day.goal).length;
    
    return {
      averageCalories: Math.round(totalCalories / calorieHistory.length),
      averageProtein: Math.round(totalProtein / calorieHistory.length),
      averageCarbs: Math.round(totalCarbs / calorieHistory.length),
      averageFat: Math.round(totalFat / calorieHistory.length),
      calorieDeficit: Math.round(totalGoal - totalCalories),
      daysUnderGoal,
      daysOverGoal
    };
  };
  
  const stats = calculateStats();
  
  return {
    calorieHistory,
    stats,
    isLoading,
    error,
    refreshHistory: fetchCalorieHistory
  };
}

// Custom hook for managing favorite foods
export function useFavoriteFoods(userId) {
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch favorite foods
  const fetchFavoriteFoods = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const favorites = await FoodService.getFavoriteFoods(userId);
      setFavoriteFoods(favorites);
    } catch (err) {
      console.error('Error fetching favorite foods:', err);
      setError('Failed to load favorite foods. Please try again.');
      setFavoriteFoods([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load favorite foods on initial render
  useEffect(() => {
    fetchFavoriteFoods();
  }, [userId]);
  
  // Toggle favorite status
  const toggleFavorite = async (foodId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const isFavorite = await FoodService.toggleFavorite(userId, foodId);
      
      // Update local state
      if (isFavorite) {
        // Food was added to favorites
        const foodDetails = await FoodService.getFoodDetails(foodId);
        setFavoriteFoods(prev => [...prev, foodDetails]);
      } else {
        // Food was removed from favorites
        setFavoriteFoods(prev => prev.filter(food => food.id !== foodId));
      }
    } catch (err) {
      console.error('Error toggling favorite status:', err);
      setError('Failed to update favorite status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if a food is a favorite
  const isFavorite = (foodId) => {
    return favoriteFoods.some(food => food.id === foodId);
  };
  
  return {
    favoriteFoods,
    isLoading,
    error,
    toggleFavorite,
    isFavorite,
    refreshFavorites: fetchFavoriteFoods
  };
}

// Custom hook for recent foods
export function useRecentFoods(userId) {
  const [recentFoods, setRecentFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch recent foods
  const fetchRecentFoods = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const recent = await FoodService.getRecentFoods(userId);
      setRecentFoods(recent);
    } catch (err) {
      console.error('Error fetching recent foods:', err);
      setError('Failed to load recent foods. Please try again.');
      setRecentFoods([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load recent foods on initial render
  useEffect(() => {
    fetchRecentFoods();
  }, [userId]);
  
  return {
    recentFoods,
    isLoading,
    error,
    refreshRecent: fetchRecentFoods
  };
}

// Custom hook for custom food creation
export function useCustomFood(userId) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Add custom food
  const addCustomFood = async (foodData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newFood = await FoodService.addCustomFood({
        ...foodData,
        created_by: userId
      });
      
      return newFood;
    } catch (err) {
      console.error('Error adding custom food:', err);
      setError('Failed to add custom food. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    addCustomFood,
    isLoading,
    error
  };
}
