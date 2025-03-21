'use client';

import { useState, useEffect } from 'react';
import DietService from '@/services/DietService';

// Custom hook for diet types
export function useDietTypes() {
  const [dietTypes, setDietTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch all diet types
  const fetchDietTypes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const types = await DietService.getDietTypes();
      setDietTypes(types);
    } catch (err) {
      console.error('Error fetching diet types:', err);
      setError('Failed to load diet types. Please try again.');
      setDietTypes([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load diet types on initial render
  useEffect(() => {
    fetchDietTypes();
  }, []);
  
  return {
    dietTypes,
    isLoading,
    error,
    refreshDietTypes: fetchDietTypes
  };
}

// Custom hook for recipes
export function useRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [filters, setFilters] = useState({
    dietType: 'all',
    mealType: 'all',
    searchTerm: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch all recipes
  const fetchRecipes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const allRecipes = await DietService.getAllRecipes();
      setRecipes(allRecipes);
      
      // Apply current filters
      filterRecipes(allRecipes, filters);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to load recipes. Please try again.');
      setRecipes([]);
      setFilteredRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter recipes based on selected filters
  const filterRecipes = (recipeList, filterOptions) => {
    let filtered = [...recipeList];
    
    // Filter by diet type
    if (filterOptions.dietType !== 'all') {
      filtered = filtered.filter(recipe => 
        recipe.diet_types.includes(filterOptions.dietType)
      );
    }
    
    // Filter by meal type
    if (filterOptions.mealType !== 'all') {
      filtered = filtered.filter(recipe => 
        recipe.meal_type === filterOptions.mealType
      );
    }
    
    // Filter by search term
    if (filterOptions.searchTerm) {
      const term = filterOptions.searchTerm.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.name.toLowerCase().includes(term) || 
        recipe.description.toLowerCase().includes(term) ||
        recipe.ingredients.some(ingredient => 
          ingredient.name.toLowerCase().includes(term)
        )
      );
    }
    
    setFilteredRecipes(filtered);
  };
  
  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    filterRecipes(recipes, newFilters);
  };
  
  // Search recipes
  const searchRecipes = async (query) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await DietService.searchRecipes(query);
      return results;
    } catch (err) {
      console.error('Error searching recipes:', err);
      setError('Failed to search recipes. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load recipes on initial render
  useEffect(() => {
    fetchRecipes();
  }, []);
  
  return {
    recipes,
    filteredRecipes,
    filters,
    updateFilters,
    searchRecipes,
    isLoading,
    error,
    refreshRecipes: fetchRecipes
  };
}

// Custom hook for recipe details
export function useRecipeDetails(recipeId) {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch recipe details
  const fetchRecipeDetails = async () => {
    if (!recipeId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const details = await DietService.getRecipeDetails(recipeId);
      setRecipeDetails(details);
    } catch (err) {
      console.error('Error fetching recipe details:', err);
      setError('Failed to load recipe details. Please try again.');
      setRecipeDetails(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load recipe details when recipeId changes
  useEffect(() => {
    fetchRecipeDetails();
  }, [recipeId]);
  
  return {
    recipeDetails,
    isLoading,
    error,
    refreshDetails: fetchRecipeDetails
  };
}

// Custom hook for diet plans
export function useDietPlans() {
  const [dietPlans, setDietPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [filters, setFilters] = useState({
    goal: 'all',
    dietType: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch all diet plans
  const fetchDietPlans = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const plans = await DietService.getAllDietPlans();
      setDietPlans(plans);
      
      // Apply current filters
      filterPlans(plans, filters);
    } catch (err) {
      console.error('Error fetching diet plans:', err);
      setError('Failed to load diet plans. Please try again.');
      setDietPlans([]);
      setFilteredPlans([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter plans based on selected filters
  const filterPlans = (plans, filterOptions) => {
    const filtered = plans.filter(plan => {
      return (filterOptions.goal === 'all' || plan.goal_type === filterOptions.goal) &&
             (filterOptions.dietType === 'all' || plan.diet_type === filterOptions.dietType);
    });
    
    setFilteredPlans(filtered);
  };
  
  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    filterPlans(dietPlans, newFilters);
  };
  
  // Load diet plans on initial render
  useEffect(() => {
    fetchDietPlans();
  }, []);
  
  return {
    dietPlans,
    filteredPlans,
    filters,
    updateFilters,
    isLoading,
    error,
    refreshPlans: fetchDietPlans
  };
}

// Custom hook for diet plan details
export function useDietPlanDetails(planId) {
  const [planDetails, setPlanDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch diet plan details
  const fetchPlanDetails = async () => {
    if (!planId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const details = await DietService.getDietPlanDetails(planId);
      setPlanDetails(details);
    } catch (err) {
      console.error('Error fetching diet plan details:', err);
      setError('Failed to load diet plan details. Please try again.');
      setPlanDetails(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load plan details when planId changes
  useEffect(() => {
    fetchPlanDetails();
  }, [planId]);
  
  return {
    planDetails,
    isLoading,
    error,
    refreshDetails: fetchPlanDetails
  };
}

// Custom hook for recommended diet plans
export function useRecommendedDiets(userProfile) {
  const [recommendedPlans, setRecommendedPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch recommended diet plans
  const fetchRecommendedPlans = async () => {
    if (!userProfile) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const plans = await DietService.getRecommendedDietPlans(userProfile);
      setRecommendedPlans(plans);
    } catch (err) {
      console.error('Error fetching recommended diet plans:', err);
      setError('Failed to load diet recommendations. Please try again.');
      setRecommendedPlans([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load recommended plans when userProfile changes
  useEffect(() => {
    fetchRecommendedPlans();
  }, [userProfile]);
  
  return {
    recommendedPlans,
    isLoading,
    error,
    refreshRecommendations: fetchRecommendedPlans
  };
}

// Custom hook for today's meal plan
export function useTodaysMealPlan(userId) {
  const [todaysMealPlan, setTodaysMealPlan] = useState(null);
  const [mealStatus, setMealStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch today's meal plan
  const fetchTodaysMealPlan = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const mealPlan = await DietService.getTodaysMealPlan(userId);
      setTodaysMealPlan(mealPlan);
      
      // Initialize meal status
      if (mealPlan) {
        const status = {};
        Object.values(mealPlan.meals).flat().forEach(recipe => {
          status[recipe.id] = {
            completed: false,
            servings: recipe.servings || 1
          };
        });
        setMealStatus(status);
      }
    } catch (err) {
      console.error('Error fetching today\'s meal plan:', err);
      setError('Failed to load today\'s meal plan. Please try again.');
      setTodaysMealPlan(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load today's meal plan on initial render
  useEffect(() => {
    fetchTodaysMealPlan();
  }, [userId]);
  
  // Toggle meal completion
  const toggleMealCompletion = (recipeId) => {
    setMealStatus(prev => ({
      ...prev,
      [recipeId]: {
        ...prev[recipeId],
        completed: !prev[recipeId].completed
      }
    }));
  };
  
  // Update meal servings
  const updateMealServings = (recipeId, servings) => {
    setMealStatus(prev => ({
      ...prev,
      [recipeId]: {
        ...prev[recipeId],
        servings
      }
    }));
  };
  
  // Calculate completion percentage
  const calculateCompletionPercentage = () => {
    if (!todaysMealPlan) {
      return 0;
    }
    
    const allRecipes = Object.values(todaysMealPlan.meals).flat();
    if (allRecipes.length === 0) {
      return 0;
    }
    
    const completedCount = Object.values(mealStatus).filter(status => status.completed).length;
    return Math.round((completedCount / allRecipes.length) * 100);
  };
  
  // Log completed meal
  const logCompletedMeal = async (mealType, recipeId, notes = '') => {
    if (!todaysMealPlan) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const recipe = Object.values(todaysMealPlan.meals)
        .flat()
        .find(r => r.id === recipeId);
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      
      const servings = mealStatus[recipeId]?.servings || recipe.servings || 1;
      
      // Log the meal
      const mealLog = await DietService.logMeal(userId, {
        date: new Date().toISOString().split('T')[0],
        meal_type: mealType,
        recipe_id: recipeId,
        servings,
        calories: recipe.calories * servings,
        protein: recipe.protein * servings,
        carbs: recipe.carbs * servings,
        fat: recipe.fat * servings,
        notes
      });
      
      return mealLog;
    } catch (err) {
      console.error('Error logging completed meal:', err);
      setError('Failed to log meal. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    todaysMealPlan,
    mealStatus,
    completionPercentage: calculateCompletionPercentage(),
    isLoading,
    error,
    toggleMealCompletion,
    updateMealServings,
    logCompletedMeal,
    refreshMealPlan: fetchTodaysMealPlan
  };
}

// Custom hook for meal history
export function useMealHistory(userId) {
  const [mealHistory, setMealHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch meal history
  const fetchMealHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const history = await DietService.getMealHistory(userId);
      setMealHistory(history);
    } catch (err) {
      console.error('Error fetching meal history:', err);
      setError('Failed to load meal history. Please try again.');
      setMealHistory([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load meal history on initial render
  useEffect(() => {
    fetchMealHistory();
  }, [userId]);
  
  // Calculate statistics
  const calculateStats = () => {
    if (mealHistory.length === 0) {
      return {
        totalMeals: 0,
        totalCalories: 0,
        avgCaloriesPerDay: 0,
        avgProtein: 0,
        avgCarbs: 0,
        avgFat: 0
      };
    }
    
    const totalMeals = mealHistory.length;
    const totalCalories = mealHistory.reduce((sum, meal) => sum + meal.calories, 0);
    const totalProtein = mealHistory.reduce((sum, meal) => sum + meal.protein, 0);
    const totalCarbs = mealHistory.reduce((sum, meal) => sum + meal.carbs, 0);
    const totalFat = mealHistory.reduce((sum, meal) => sum + meal.fat, 0);
    
    // Group by date to calculate average per day
    const mealsByDate = mealHistory.reduce((acc, meal) => {
      if (!acc[meal.meal_date]) {
        acc[meal.meal_date] = { calories: 0 };
      }
      acc[meal.meal_date].calories += meal.calories;
      return acc;
    }, {});
    
    const uniqueDays = Object.keys(mealsByDate).length;
    const avgCaloriesPerDay = uniqueDays > 0 ? Math.round(totalCalories / uniqueDays) : 0;
    
    return {
      totalMeals,
      totalCalories,
      avgCaloriesPerDay,
      avgProtein: Math.round(totalProtein / totalMeals),
      avgCarbs: Math.round(totalCarbs / totalMeals),
      avgFat: Math.round(totalFat / totalMeals)
    };
  };
  
  const stats = calculateStats();
  
  return {
    mealHistory,
    stats,
    isLoading,
    error,
    refreshHistory: fetchMealHistory
  };
}

// Custom hook for diet plan assignment
export function useDietPlanAssignment(userId) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Assign diet plan to user
  const assignDietPlan = async (planId, startDate = new Date().toISOString().split('T')[0]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await DietService.assignDietPlan(userId, planId, startDate);
      return result;
    } catch (err) {
      console.error('Error assigning diet plan:', err);
      setError('Failed to assign diet plan. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    assignDietPlan,
    isLoading,
    error
  };
}

// Custom hook for custom diet plan generation
export function useCustomDietPlan(userId) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Generate custom diet plan
  const generateCustomDietPlan = async (userProfile, preferences) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const plan = await DietService.generateCustomDietPlan(userProfile, preferences);
      return plan;
    } catch (err) {
      console.error('Error generating custom diet plan:', err);
      setError('Failed to generate custom diet plan. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Assign the generated plan to the user
  const assignGeneratedPlan = async (planId) => {
    try {
      return await DietService.assignDietPlan(userId, planId);
    } catch (err) {
      console.error('Error assigning generated diet plan:', err);
      setError('Failed to assign diet plan. Please try again.');
      return null;
    }
  };
  
  return {
    generateCustomDietPlan,
    assignGeneratedPlan,
    isLoading,
    error
  };
}
