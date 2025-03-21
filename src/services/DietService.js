'use client';

import { useState, useEffect } from 'react';

// This service handles diet plans and recipe recommendations
export const DietService = {
  // Get all diet types
  getDietTypes: async () => {
    try {
      // In a real implementation, this would call an API
      console.log('Getting diet types');
      
      // Mock implementation
      return mockDietTypes;
    } catch (error) {
      console.error('Error getting diet types:', error);
      throw error;
    }
  },
  
  // Get all recipes
  getAllRecipes: async () => {
    try {
      // In a real implementation, this would call an API
      console.log('Getting all recipes');
      
      // Mock implementation
      return mockRecipes;
    } catch (error) {
      console.error('Error getting all recipes:', error);
      throw error;
    }
  },
  
  // Get recipes by diet type
  getRecipesByDietType: async (dietType) => {
    try {
      // In a real implementation, this would call an API
      console.log(`Getting recipes for diet type: ${dietType}`);
      
      // Mock implementation
      return mockRecipes.filter(recipe => recipe.diet_types.includes(dietType));
    } catch (error) {
      console.error('Error getting recipes by diet type:', error);
      throw error;
    }
  },
  
  // Get recipes by meal type
  getRecipesByMealType: async (mealType) => {
    try {
      // In a real implementation, this would call an API
      console.log(`Getting recipes for meal type: ${mealType}`);
      
      // Mock implementation
      return mockRecipes.filter(recipe => recipe.meal_type === mealType);
    } catch (error) {
      console.error('Error getting recipes by meal type:', error);
      throw error;
    }
  },
  
  // Get recipe details
  getRecipeDetails: async (recipeId) => {
    try {
      // In a real implementation, this would call an API
      console.log(`Getting details for recipe: ${recipeId}`);
      
      // Mock implementation
      const recipe = mockRecipes.find(recipe => recipe.id === recipeId);
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      
      return recipe;
    } catch (error) {
      console.error('Error getting recipe details:', error);
      throw error;
    }
  },
  
  // Search recipes
  searchRecipes: async (query) => {
    try {
      // In a real implementation, this would call an API
      console.log(`Searching recipes for: ${query}`);
      
      // Mock implementation
      if (!query) return [];
      
      query = query.toLowerCase();
      
      return mockRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(query) || 
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient => ingredient.name.toLowerCase().includes(query))
      );
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  },
  
  // Get all diet plans
  getAllDietPlans: async () => {
    try {
      // In a real implementation, this would call an API
      console.log('Getting all diet plans');
      
      // Mock implementation
      return mockDietPlans;
    } catch (error) {
      console.error('Error getting all diet plans:', error);
      throw error;
    }
  },
  
  // Get diet plans filtered by goal and diet type
  getFilteredDietPlans: async (filters) => {
    try {
      // In a real implementation, this would call an API
      console.log('Getting filtered diet plans', filters);
      
      // Mock implementation
      return mockDietPlans.filter(plan => {
        return (filters.goal === 'all' || plan.goal_type === filters.goal) &&
               (filters.dietType === 'all' || plan.diet_type === filters.dietType);
      });
    } catch (error) {
      console.error('Error getting filtered diet plans:', error);
      throw error;
    }
  },
  
  // Get diet plan details
  getDietPlanDetails: async (planId) => {
    try {
      // In a real implementation, this would call an API
      console.log(`Getting details for diet plan: ${planId}`);
      
      // Mock implementation
      const plan = mockDietPlans.find(plan => plan.id === planId);
      
      if (!plan) {
        throw new Error('Diet plan not found');
      }
      
      // Get meal plans for this diet plan
      const mealPlans = mockMealPlans.filter(mp => mp.diet_plan_id === planId);
      
      // Get recipes for each meal plan
      const mealPlansWithRecipes = await Promise.all(mealPlans.map(async (mp) => {
        const mealPlanRecipes = mockMealPlanRecipes.filter(mpr => mpr.meal_plan_id === mp.id);
        
        // Get recipe details for each meal plan recipe
        const recipes = await Promise.all(mealPlanRecipes.map(async (mpr) => {
          const recipe = mockRecipes.find(r => r.id === mpr.recipe_id);
          return {
            ...recipe,
            servings: mpr.servings,
            order_index: mpr.order_index
          };
        }));
        
        // Sort recipes by order_index
        recipes.sort((a, b) => a.order_index - b.order_index);
        
        return {
          ...mp,
          recipes
        };
      }));
      
      // Sort meal plans by day_number
      mealPlansWithRecipes.sort((a, b) => a.day_number - b.day_number);
      
      return {
        ...plan,
        meal_plans: mealPlansWithRecipes
      };
    } catch (error) {
      console.error('Error getting diet plan details:', error);
      throw error;
    }
  },
  
  // Get recommended diet plans based on user profile
  getRecommendedDietPlans: async (userProfile) => {
    try {
      // In a real implementation, this would call an API with recommendation algorithm
      console.log('Getting recommended diet plans for user profile', userProfile);
      
      // Mock implementation of recommendation algorithm
      let recommendedPlans = [];
      
      // Filter by goal
      const goalPlans = mockDietPlans.filter(plan => plan.goal_type === userProfile.goal_type);
      
      // If user has dietary preferences, filter by those
      if (userProfile.dietary_preferences && userProfile.dietary_preferences.length > 0) {
        const dietaryPlans = goalPlans.filter(plan => 
          userProfile.dietary_preferences.includes(plan.diet_type)
        );
        
        if (dietaryPlans.length > 0) {
          // If we have plans matching both goal and dietary preferences, use those
          recommendedPlans = dietaryPlans;
        } else {
          // Otherwise, prioritize goal over dietary preferences
          recommendedPlans = goalPlans;
        }
      } else {
        // No dietary preferences, just use goal plans
        recommendedPlans = goalPlans;
      }
      
      // Calculate calorie needs based on user profile
      const calorieNeeds = calculateCalorieNeeds(userProfile);
      
      // Sort by how close the plan's calorie target is to the user's needs
      recommendedPlans.sort((a, b) => {
        const aDiff = Math.abs(a.daily_calories - calorieNeeds);
        const bDiff = Math.abs(b.daily_calories - calorieNeeds);
        return aDiff - bDiff;
      });
      
      return recommendedPlans.slice(0, 3); // Return top 3 recommendations
    } catch (error) {
      console.error('Error getting recommended diet plans:', error);
      throw error;
    }
  },
  
  // Get today's meal plan for a user
  getTodaysMealPlan: async (userId) => {
    try {
      // In a real implementation, this would call an API
      console.log(`Getting today's meal plan for user: ${userId}`);
      
      // Mock implementation
      
      // Check if user has an active diet plan
      const userDietPlan = mockUserDietPlans.find(
        udp => udp.user_id === userId && udp.is_active
      );
      
      if (!userDietPlan) {
        return null; // No active diet plan
      }
      
      // Get the diet plan
      const dietPlan = mockDietPlans.find(plan => plan.id === userDietPlan.diet_plan_id);
      
      if (!dietPlan) {
        return null; // Plan not found
      }
      
      // Determine which day of the plan we're on
      const startDate = new Date(userDietPlan.start_date);
      const today = new Date();
      const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
      
      // Get meal plans for this diet plan
      const mealPlans = mockMealPlans.filter(mp => mp.diet_plan_id === dietPlan.id);
      
      // Sort by day_number
      mealPlans.sort((a, b) => a.day_number - b.day_number);
      
      // Determine which day to show (cycle through the days)
      const dayIndex = daysSinceStart % mealPlans.length;
      const todaysMealPlan = mealPlans[dayIndex];
      
      // Get recipes for this meal plan
      const mealPlanRecipes = mockMealPlanRecipes.filter(mpr => mpr.meal_plan_id === todaysMealPlan.id);
      
      // Sort by order_index
      mealPlanRecipes.sort((a, b) => a.order_index - b.order_index);
      
      // Get recipe details
      const recipes = mealPlanRecipes.map(mpr => {
        const recipe = mockRecipes.find(r => r.id === mpr.recipe_id);
        return {
          ...recipe,
          servings: mpr.servings,
          completed: false // Default to not completed
        };
      });
      
      // Group recipes by meal type
      const mealsByType = {
        breakfast: recipes.filter(r => r.meal_type === 'breakfast'),
        lunch: recipes.filter(r => r.meal_type === 'lunch'),
        dinner: recipes.filter(r => r.meal_type === 'dinner'),
        snack: recipes.filter(r => r.meal_type === 'snack')
      };
      
      // Calculate total calories and macros
      const totalCalories = recipes.reduce((sum, recipe) => sum + (recipe.calories * recipe.servings), 0);
      const totalProtein = recipes.reduce((sum, recipe) => sum + (recipe.protein * recipe.servings), 0);
      const totalCarbs = recipes.reduce((sum, recipe) => sum + (recipe.carbs * recipe.servings), 0);
      const totalFat = recipes.reduce((sum, recipe) => sum + (recipe.fat * recipe.servings), 0);
      
      return {
        name: dietPlan.name,
        day: `Day ${todaysMealPlan.day_number}`,
        description: todaysMealPlan.description,
        meals: mealsByType,
        total_calories: totalCalories,
        total_protein: totalProtein,
        total_carbs: totalCarbs,
        total_fat: totalFat
      };
    } catch (error) {
      console.error('Error getting today\'s meal plan:', error);
      throw error;
    }
  },
  
  // Log a completed meal
  logMeal: async (userId, mealData) => {
    try {
      // In a real implementation, this would call an API
      console.log(`Logging meal for user: ${userId}`, mealData);
      
      // Mock implementation
      const newMealLog = {
        id: `meal-log-${Date.now()}`,
        user_id: userId,
        meal_date: mealData.date || new Date().toISOString().split('T')[0],
        meal_type: mealData.meal_type,
        recipe_id: mealData.recipe_id,
        servings: mealData.servings || 1,
        calories: mealData.calories,
        protein: mealData.protein,
        carbs: mealData.carbs,
        fat: mealData.fat,
        notes: mealData.notes,
        created_at: new Date().toISOString()
      };
      
      // Add to mock database
      mockUserMealLogs.push(newMealLog);
      
      return newMealLog;
    } catch (error) {
      console.error('Error logging meal:', error);
      throw error;
    }
  },
  
  // Get user's meal history
  getMealHistory: async (userId) => {
    try {
      // In a real implementation, this would call an API
      console.log(`Getting meal history for user: ${userId}`);
      
      // Mock implementation
      const mealLogs = mockUserMealLogs.filter(log => log.user_id === userId);
      
      // Sort by date (most recent first)
      mealLogs.sort((a, b) => new Date(b.meal_date) - new Date(a.meal_date));
      
      // Get additional details for each log
      const logsWithDetails = mealLogs.map(log => {
        // Get recipe name
        const recipe = mockRecipes.find(recipe => recipe.id === log.recipe_id);
        const recipeName = recipe ? recipe.name : 'Custom Meal';
        
        return {
          ...log,
          recipe_name: recipeName
        };
      });
      
      return logsWithDetails;
    } catch (error) {
      console.error('Error getting meal history:', error);
      throw error;
    }
  },
  
  // Assign a diet plan to a user
  assignDietPlan: async (userId, planId, startDate = new Date().toISOString().split('T')[0]) => {
    try {
      // In a real implementation, this would call an API
      console.log(`Assigning diet plan ${planId} to user: ${userId}`);
      
      // First, deactivate any existing active plans
      mockUserDietPlans.forEach(plan => {
        if (plan.user_id === userId && plan.is_active) {
          plan.is_active = false;
          plan.end_date = new Date().toISOString().split('T')[0];
        }
      });
      
      // Create new user diet plan
      const newUserDietPlan = {
        id: `user-diet-plan-${Date.now()}`,
        user_id: userId,
        diet_plan_id: planId,
        start_date: startDate,
        end_date: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to mock database
      mockUserDietPlans.push(newUserDietPlan);
      
      return newUserDietPlan;
    } catch (error) {
      console.error('Error assigning diet plan:', error);
      throw error;
    }
  },
  
  // Generate a custom diet plan based on user preferences
  generateCustomDietPlan: async (userProfile, preferences) => {
    try {
      // In a real implementation, this would call an API with a sophisticated algorithm
      console.log('Generating custom diet plan for user profile', userProfile, preferences);
      
      // Mock implementation of a simple diet plan generator
      
      // Calculate calorie needs
      const calorieNeeds = calculateCalorieNeeds(userProfile);
      
      // Adjust based on goal
      let adjustedCalories = calorieNeeds;
      switch (userProfile.goal_type) {
        case 'weight_loss':
          adjustedCalories = Math.max(1200, calorieNeeds - 500); // 500 calorie deficit, minimum 1200
          break;
        case 'muscle_gain':
          adjustedCalories = calorieNeeds + 300; // 300 calorie surplus
          break;
        case 'maintenance':
        default:
          // No adjustment needed
          break;
      }
      
      // Calculate macronutrient distribution
      let proteinPct, carbsPct, fatPct;
      
      switch (preferences.diet_type) {
        case 'keto':
          proteinPct = 0.25; // 25% protein
          carbsPct = 0.05;   // 5% carbs
          fatPct = 0.70;     // 70% fat
          break;
        case 'low_carb':
          proteinPct = 0.30; // 30% protein
          carbsPct = 0.20;   // 20% carbs
          fatPct = 0.50;     // 50% fat
          break;
        case 'high_protein':
          proteinPct = 0.40; // 40% protein
          carbsPct = 0.30;   // 30% carbs
          fatPct = 0.30;     // 30% fat
          break;
        case 'vegan':
        case 'vegetarian':
          proteinPct = 0.20; // 20% protein
          carbsPct = 0.55;   // 55% carbs
          fatPct = 0.25;     // 25% fat
          break;
        case 'balanced':
        default:
          proteinPct = 0.25; // 25% protein
          carbsPct = 0.50;   // 50% carbs
          fatPct = 0.25;     // 25% fat
          break;
      }
      
      // Calculate grams of each macronutrient
      const proteinCals = adjustedCalories * proteinPct;
      const carbsCals = adjustedCalories * carbsPct;
      const fatCals = adjustedCalories * fatPct;
      
      const proteinGrams = Math.round(proteinCals / 4); // 4 calories per gram of protein
      const carbsGrams = Math.round(carbsCals / 4);     // 4 calories per gram of carbs
      const fatGrams = Math.round(fatCals / 9);         // 9 calories per gram of fat
      
      // Create a new diet plan
      const newPlan = {
        id: `custom-plan-${Date.now()}`,
        name: `Custom ${preferences.diet_type.charAt(0).toUpperCase() + preferences.diet_type.slice(1)} Plan`,
        description: `A custom ${preferences.diet_type} diet plan designed for ${userProfile.goal_type.replace('_', ' ')}.`,
        goal_type: userProfile.goal_type,
        diet_type: preferences.diet_type,
        duration_days: 7,
        daily_calories: adjustedCalories,
        daily_protein: proteinGrams,
        daily_carbs: carbsGrams,
        daily_fat: fatGrams,
        is_custom: true
      };
      
      // Filter recipes based on diet type and excluded ingredients
      let eligibleRecipes = mockRecipes.filter(recipe => 
        recipe.diet_types.includes(preferences.diet_type) &&
        !preferences.excluded_ingredients.some(ingredient => 
          recipe.ingredients.some(ri => ri.name.toLowerCase().includes(ingredient.toLowerCase()))
        )
      );
      
      // If not enough recipes, fall back to all recipes that match the diet type
      if (eligibleRecipes.length < 15) {
        eligibleRecipes = mockRecipes.filter(recipe => 
          recipe.diet_types.includes(preferences.diet_type)
        );
      }
      
      // Create meal plans for 7 days
      const mealPlans = [];
      const mealPlanRecipes = [];
      
      for (let day = 1; day <= 7; day++) {
        // Create meal plan for this day
        const mealPlan = {
          id: `custom-meal-plan-${Date.now()}-${day}`,
          diet_plan_id: newPlan.id,
          day_number: day,
          description: `Day ${day} of your custom plan`,
          created_at: new Date().toISOString()
        };
        
        mealPlans.push(mealPlan);
        
        // Assign recipes to this meal plan
        // For simplicity, we'll just randomly select recipes for each meal type
        
        // Breakfast
        const breakfastRecipes = eligibleRecipes.filter(r => r.meal_type === 'breakfast');
        if (breakfastRecipes.length > 0) {
          const breakfast = breakfastRecipes[Math.floor(Math.random() * breakfastRecipes.length)];
          mealPlanRecipes.push({
            id: `custom-mpr-${Date.now()}-${day}-breakfast`,
            meal_plan_id: mealPlan.id,
            recipe_id: breakfast.id,
            servings: 1,
            order_index: 1,
            created_at: new Date().toISOString()
          });
        }
        
        // Lunch
        const lunchRecipes = eligibleRecipes.filter(r => r.meal_type === 'lunch');
        if (lunchRecipes.length > 0) {
          const lunch = lunchRecipes[Math.floor(Math.random() * lunchRecipes.length)];
          mealPlanRecipes.push({
            id: `custom-mpr-${Date.now()}-${day}-lunch`,
            meal_plan_id: mealPlan.id,
            recipe_id: lunch.id,
            servings: 1,
            order_index: 2,
            created_at: new Date().toISOString()
          });
        }
        
        // Dinner
        const dinnerRecipes = eligibleRecipes.filter(r => r.meal_type === 'dinner');
        if (dinnerRecipes.length > 0) {
          const dinner = dinnerRecipes[Math.floor(Math.random() * dinnerRecipes.length)];
          mealPlanRecipes.push({
            id: `custom-mpr-${Date.now()}-${day}-dinner`,
            meal_plan_id: mealPlan.id,
            recipe_id: dinner.id,
            servings: 1,
            order_index: 3,
            created_at: new Date().toISOString()
          });
        }
        
        // Snack (if calories allow)
        if (adjustedCalories > 1500) {
          const snackRecipes = eligibleRecipes.filter(r => r.meal_type === 'snack');
          if (snackRecipes.length > 0) {
            const snack = snackRecipes[Math.floor(Math.random() * snackRecipes.length)];
            mealPlanRecipes.push({
              id: `custom-mpr-${Date.now()}-${day}-snack`,
              meal_plan_id: mealPlan.id,
              recipe_id: snack.id,
              servings: 1,
              order_index: 4,
              created_at: new Date().toISOString()
            });
          }
        }
      }
      
      // Add to mock database
      mockDietPlans.push(newPlan);
      mockMealPlans.push(...mealPlans);
      mockMealPlanRecipes.push(...mealPlanRecipes);
      
      // Return the complete plan with meal plans and recipes
      return await this.getDietPlanDetails(newPlan.id);
    } catch (error) {
      console.error('Error generating custom diet plan:', error);
      throw error;
    }
  }
};

// Helper function to calculate calorie needs
function calculateCalorieNeeds(userProfile) {
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
  return Math.round(bmr * activityMultiplier);
}

// Mock diet types
const mockDietTypes = [
  { id: 'balanced', name: 'Balanced', description: 'A balanced diet with a mix of all food groups' },
  { id: 'low_carb', name: 'Low Carb', description: 'Reduced carbohydrate intake with higher protein and fat' },
  { id: 'high_protein', name: 'High Protein', description: 'Increased protein intake for muscle building and recovery' },
  { id: 'keto', name: 'Ketogenic', description: 'Very low carb, high fat diet to achieve ketosis' },
  { id: 'vegetarian', name: 'Vegetarian', description: 'Plant-based diet excluding meat but including dairy and eggs' },
  { id: 'vegan', name: 'Vegan', description: 'Plant-based diet excluding all animal products' },
  { id: 'paleo', name: 'Paleo', description: 'Based on foods presumed to be available to paleolithic humans' },
  { id: 'mediterranean', name: 'Mediterranean', description: 'Based on the traditional cuisine of Mediterranean countries' }
];

// Mock recipes
const mockRecipes = [
  {
    id: 1,
    name: 'Greek Yogurt with Berries and Honey',
    description: 'A simple, protein-rich breakfast with fresh berries and a touch of honey.',
    meal_type: 'breakfast',
    diet_types: ['balanced', 'vegetarian', 'high_protein', 'mediterranean'],
    prep_time_minutes: 5,
    cook_time_minutes: 0,
    servings: 1,
    calories: 250,
    protein: 20,
    carbs: 30,
    fat: 5,
    fiber: 3,
    ingredients: [
      { name: 'Greek yogurt', amount: 1, unit: 'cup' },
      { name: 'Mixed berries', amount: 0.5, unit: 'cup' },
      { name: 'Honey', amount: 1, unit: 'teaspoon' },
      { name: 'Almonds', amount: 1, unit: 'tablespoon', optional: true }
    ],
    instructions: [
      'Add Greek yogurt to a bowl.',
      'Top with mixed berries.',
      'Drizzle with honey.',
      'Sprinkle with chopped almonds if desired.'
    ],
    image_url: 'https://example.com/images/greek-yogurt.jpg'
  },
  {
    id: 2,
    name: 'Avocado Toast with Poached Egg',
    description: 'Creamy avocado on whole grain toast topped with a perfectly poached egg.',
    meal_type: 'breakfast',
    diet_types: ['balanced', 'vegetarian', 'high_protein'],
    prep_time_minutes: 5,
    cook_time_minutes: 5,
    servings: 1,
    calories: 350,
    protein: 15,
    carbs: 30,
    fat: 20,
    fiber: 8,
    ingredients: [
      { name: 'Whole grain bread', amount: 1, unit: 'slice' },
      { name: 'Avocado', amount: 0.5, unit: 'medium' },
      { name: 'Egg', amount: 1, unit: 'large' },
      { name: 'Salt', amount: 0.25, unit: 'teaspoon' },
      { name: 'Pepper', amount: 0.25, unit: 'teaspoon' },
      { name: 'Red pepper flakes', amount: 0.25, unit: 'teaspoon', optional: true }
    ],
    instructions: [
      'Toast the bread until golden brown.',
      'Mash the avocado and spread on toast.',
      'Poach the egg in simmering water for 3-4 minutes.',
      'Place the poached egg on top of the avocado toast.',
      'Season with salt, pepper, and red pepper flakes if desired.'
    ],
    image_url: 'https://example.com/images/avocado-toast.jpg'
  },
  {
    id: 3,
    name: 'Keto Breakfast Bowl',
    description: 'A low-carb, high-fat breakfast bowl with eggs, avocado, and bacon.',
    meal_type: 'breakfast',
    diet_types: ['keto', 'low_carb', 'high_protein', 'paleo'],
    prep_time_minutes: 5,
    cook_time_minutes: 10,
    servings: 1,
    calories: 450,
    protein: 25,
    carbs: 5,
    fat: 35,
    fiber: 3,
    ingredients: [
      { name: 'Eggs', amount: 2, unit: 'large' },
      { name: 'Bacon', amount: 2, unit: 'slices' },
      { name: 'Avocado', amount: 0.5, unit: 'medium' },
      { name: 'Spinach', amount: 1, unit: 'cup' },
      { name: 'Butter', amount: 1, unit: 'teaspoon' },
      { name: 'Salt', amount: 0.25, unit: 'teaspoon' },
      { name: 'Pepper', amount: 0.25, unit: 'teaspoon' }
    ],
    instructions: [
      'Cook bacon in a pan until crispy, then set aside.',
      'In the same pan, melt butter and sauté spinach until wilted.',
      'Scramble eggs in the pan with the spinach.',
      'Transfer to a bowl and top with sliced avocado and crumbled bacon.',
      'Season with salt and pepper.'
    ],
    image_url: 'https://example.com/images/keto-breakfast.jpg'
  },
  {
    id: 4,
    name: 'Vegan Overnight Oats',
    description: 'Creamy overnight oats made with plant-based milk and topped with fruits and nuts.',
    meal_type: 'breakfast',
    diet_types: ['vegan', 'vegetarian', 'balanced'],
    prep_time_minutes: 5,
    cook_time_minutes: 0,
    servings: 1,
    calories: 350,
    protein: 10,
    carbs: 55,
    fat: 10,
    fiber: 8,
    ingredients: [
      { name: 'Rolled oats', amount: 0.5, unit: 'cup' },
      { name: 'Almond milk', amount: 0.75, unit: 'cup' },
      { name: 'Chia seeds', amount: 1, unit: 'tablespoon' },
      { name: 'Maple syrup', amount: 1, unit: 'teaspoon' },
      { name: 'Banana', amount: 0.5, unit: 'medium' },
      { name: 'Berries', amount: 0.25, unit: 'cup' },
      { name: 'Walnuts', amount: 1, unit: 'tablespoon' }
    ],
    instructions: [
      'In a jar or container, combine oats, almond milk, chia seeds, and maple syrup.',
      'Stir well, cover, and refrigerate overnight.',
      'In the morning, top with sliced banana, berries, and chopped walnuts.'
    ],
    image_url: 'https://example.com/images/overnight-oats.jpg'
  },
  {
    id: 5,
    name: 'Grilled Chicken Salad',
    description: 'A hearty salad with grilled chicken, mixed greens, and a light vinaigrette.',
    meal_type: 'lunch',
    diet_types: ['balanced', 'high_protein', 'low_carb', 'paleo', 'mediterranean'],
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    servings: 1,
    calories: 400,
    protein: 35,
    carbs: 15,
    fat: 20,
    fiber: 5,
    ingredients: [
      { name: 'Chicken breast', amount: 4, unit: 'ounces' },
      { name: 'Mixed greens', amount: 2, unit: 'cups' },
      { name: 'Cherry tomatoes', amount: 0.5, unit: 'cup' },
      { name: 'Cucumber', amount: 0.5, unit: 'medium' },
      { name: 'Red onion', amount: 0.25, unit: 'small' },
      { name: 'Olive oil', amount: 1, unit: 'tablespoon' },
      { name: 'Lemon juice', amount: 1, unit: 'tablespoon' },
      { name: 'Salt', amount: 0.25, unit: 'teaspoon' },
      { name: 'Pepper', amount: 0.25, unit: 'teaspoon' }
    ],
    instructions: [
      'Season chicken breast with salt and pepper.',
      'Grill chicken for 6-7 minutes per side until cooked through.',
      'Slice cucumber and halve cherry tomatoes.',
      'Thinly slice red onion.',
      'In a large bowl, combine mixed greens, tomatoes, cucumber, and onion.',
      'Whisk together olive oil, lemon juice, salt, and pepper for the dressing.',
      'Slice grilled chicken and place on top of the salad.',
      'Drizzle with dressing and serve.'
    ],
    image_url: 'https://example.com/images/chicken-salad.jpg'
  },
  {
    id: 6,
    name: 'Quinoa Buddha Bowl',
    description: 'A nutritious bowl with quinoa, roasted vegetables, and tahini dressing.',
    meal_type: 'lunch',
    diet_types: ['vegan', 'vegetarian', 'balanced', 'mediterranean'],
    prep_time_minutes: 15,
    cook_time_minutes: 25,
    servings: 1,
    calories: 450,
    protein: 15,
    carbs: 65,
    fat: 15,
    fiber: 12,
    ingredients: [
      { name: 'Quinoa', amount: 0.5, unit: 'cup' },
      { name: 'Sweet potato', amount: 0.5, unit: 'medium' },
      { name: 'Broccoli', amount: 1, unit: 'cup' },
      { name: 'Chickpeas', amount: 0.5, unit: 'cup' },
      { name: 'Avocado', amount: 0.25, unit: 'medium' },
      { name: 'Tahini', amount: 1, unit: 'tablespoon' },
      { name: 'Lemon juice', amount: 1, unit: 'teaspoon' },
      { name: 'Olive oil', amount: 1, unit: 'tablespoon' },
      { name: 'Salt', amount: 0.5, unit: 'teaspoon' },
      { name: 'Pepper', amount: 0.25, unit: 'teaspoon' }
    ],
    instructions: [
      'Cook quinoa according to package instructions.',
      'Preheat oven to 400°F (200°C).',
      'Dice sweet potato and cut broccoli into florets.',
      'Toss vegetables with olive oil, salt, and pepper.',
      'Roast vegetables for 20-25 minutes until tender.',
      'Rinse and drain chickpeas.',
      'Make dressing by whisking together tahini, lemon juice, and 1 tablespoon water.',
      'Assemble bowl with quinoa, roasted vegetables, chickpeas, and sliced avocado.',
      'Drizzle with tahini dressing.'
    ],
    image_url: 'https://example.com/images/buddha-bowl.jpg'
  },
  {
    id: 7,
    name: 'Keto Tuna Salad Lettuce Wraps',
    description: 'Low-carb tuna salad served in crisp lettuce leaves.',
    meal_type: 'lunch',
    diet_types: ['keto', 'low_carb', 'high_protein', 'paleo'],
    prep_time_minutes: 10,
    cook_time_minutes: 0,
    servings: 1,
    calories: 350,
    protein: 30,
    carbs: 5,
    fat: 25,
    fiber: 2,
    ingredients: [
      { name: 'Canned tuna', amount: 1, unit: 'can (5 oz)' },
      { name: 'Mayonnaise', amount: 2, unit: 'tablespoons' },
      { name: 'Celery', amount: 1, unit: 'stalk' },
      { name: 'Red onion', amount: 2, unit: 'tablespoons' },
      { name: 'Dijon mustard', amount: 1, unit: 'teaspoon' },
      { name: 'Lemon juice', amount: 1, unit: 'teaspoon' },
      { name: 'Romaine lettuce leaves', amount: 4, unit: 'large leaves' },
      { name: 'Salt', amount: 0.25, unit: 'teaspoon' },
      { name: 'Pepper', amount: 0.25, unit: 'teaspoon' }
    ],
    instructions: [
      'Drain tuna and place in a bowl.',
      'Finely dice celery and red onion.',
      'Add mayonnaise, mustard, lemon juice, salt, and pepper to the tuna.',
      'Mix well and add celery and onion.',
      'Wash and dry lettuce leaves.',
      'Spoon tuna mixture onto lettuce leaves and serve.'
    ],
    image_url: 'https://example.com/images/tuna-wraps.jpg'
  },
  {
    id: 8,
    name: 'Mediterranean Chickpea Salad',
    description: 'A refreshing salad with chickpeas, cucumber, tomatoes, and feta cheese.',
    meal_type: 'lunch',
    diet_types: ['vegetarian', 'balanced', 'mediterranean'],
    prep_time_minutes: 15,
    cook_time_minutes: 0,
    servings: 1,
    calories: 380,
    protein: 15,
    carbs: 45,
    fat: 18,
    fiber: 12,
    ingredients: [
      { name: 'Chickpeas', amount: 1, unit: 'cup' },
      { name: 'Cucumber', amount: 0.5, unit: 'medium' },
      { name: 'Cherry tomatoes', amount: 0.5, unit: 'cup' },
      { name: 'Red onion', amount: 0.25, unit: 'small' },
      { name: 'Feta cheese', amount: 2, unit: 'tablespoons' },
      { name: 'Kalamata olives', amount: 6, unit: 'olives' },
      { name: 'Olive oil', amount: 1, unit: 'tablespoon' },
      { name: 'Lemon juice', amount: 1, unit: 'tablespoon' },
      { name: 'Oregano', amount: 0.5, unit: 'teaspoon' },
      { name: 'Salt', amount: 0.25, unit: 'teaspoon' },
      { name: 'Pepper', amount: 0.25, unit: 'teaspoon' }
    ],
    instructions: [
      'Rinse and drain chickpeas.',
      'Dice cucumber and halve cherry tomatoes.',
      'Thinly slice red onion.',
      'Combine chickpeas, cucumber, tomatoes, onion, and olives in a bowl.',
      'Whisk together olive oil, lemon juice, oregano, salt, and pepper.',
      'Pour dressing over salad and toss to combine.',
      'Sprinkle with crumbled feta cheese.'
    ],
    image_url: 'https://example.com/images/chickpea-salad.jpg'
  },
  {
    id: 9,
    name: 'Baked Salmon with Roasted Vegetables',
    description: 'Tender baked salmon fillet with a colorful medley of roasted vegetables.',
    meal_type: 'dinner',
    diet_types: ['balanced', 'high_protein', 'low_carb', 'paleo', 'mediterranean'],
    prep_time_minutes: 15,
    cook_time_minutes: 25,
    servings: 1,
    calories: 450,
    protein: 35,
    carbs: 20,
    fat: 25,
    fiber: 6,
    ingredients: [
      { name: 'Salmon fillet', amount: 5, unit: 'ounces' },
      { name: 'Zucchini', amount: 0.5, unit: 'medium' },
      { name: 'Bell pepper', amount: 0.5, unit: 'medium' },
      { name: 'Red onion', amount: 0.25, unit: 'medium' },
      { name: 'Cherry tomatoes', amount: 0.5, unit: 'cup' },
      { name: 'Olive oil', amount: 1, unit: 'tablespoon' },
      { name: 'Lemon', amount: 0.5, unit: 'medium' },
      { name: 'Garlic', amount: 2, unit: 'cloves' },
      { name: 'Dill', amount: 1, unit: 'teaspoon' },
      { name: 'Salt', amount: 0.5, unit: 'teaspoon' },
      { name: 'Pepper', amount: 0.25, unit: 'teaspoon' }
    ],
    instructions: [
      'Preheat oven to 400°F (200°C).',
      'Slice zucchini, bell pepper, and red onion.',
      'Toss vegetables with half the olive oil, salt, and pepper.',
      'Spread vegetables on a baking sheet and roast for 10 minutes.',
      'Place salmon on top of vegetables.',
      'Mince garlic and mix with remaining olive oil, lemon juice, and dill.',
      'Drizzle mixture over salmon.',
      'Return to oven and bake for 12-15 minutes until salmon is cooked through.',
      'Serve with lemon wedges.'
    ],
    image_url: 'https://example.com/images/baked-salmon.jpg'
  },
  {
    id: 10,
    name: 'Vegan Lentil Curry',
    description: 'A hearty and flavorful curry made with lentils, vegetables, and aromatic spices.',
    meal_type: 'dinner',
    diet_types: ['vegan', 'vegetarian', 'balanced'],
    prep_time_minutes: 15,
    cook_time_minutes: 30,
    servings: 2,
    calories: 400,
    protein: 18,
    carbs: 60,
    fat: 10,
    fiber: 15,
    ingredients: [
      { name: 'Red lentils', amount: 1, unit: 'cup' },
      { name: 'Onion', amount: 1, unit: 'medium' },
      { name: 'Garlic', amount: 3, unit: 'cloves' },
      { name: 'Ginger', amount: 1, unit: 'inch piece' },
      { name: 'Carrots', amount: 2, unit: 'medium' },
      { name: 'Spinach', amount: 2, unit: 'cups' },
      { name: 'Coconut milk', amount: 1, unit: 'cup' },
      { name: 'Vegetable broth', amount: 2, unit: 'cups' },
      { name: 'Curry powder', amount: 2, unit: 'tablespoons' },
      { name: 'Turmeric', amount: 1, unit: 'teaspoon' },
      { name: 'Cumin', amount: 1, unit: 'teaspoon' },
      { name: 'Olive oil', amount: 1, unit: 'tablespoon' },
      { name: 'Salt', amount: 1, unit: 'teaspoon' },
      { name: 'Pepper', amount: 0.5, unit: 'teaspoon' }
    ],
    instructions: [
      'Dice onion, mince garlic and ginger, and chop carrots.',
      'Heat olive oil in a large pot over medium heat.',
      'Sauté onion until translucent, about 5 minutes.',
      'Add garlic and ginger, cook for 1 minute.',
      'Add curry powder, turmeric, and cumin, cook for 30 seconds.',
      'Add lentils, carrots, and vegetable broth.',
      'Bring to a boil, then reduce heat and simmer for 20 minutes.',
      'Add coconut milk and spinach, cook for 5 more minutes.',
      'Season with salt and pepper to taste.',
      'Serve with rice or naan bread (optional).'
    ],
    image_url: 'https://example.com/images/lentil-curry.jpg'
  },
  {
    id: 11,
    name: 'Keto Cauliflower Crust Pizza',
    description: 'A low-carb pizza with a crispy cauliflower crust and your favorite toppings.',
    meal_type: 'dinner',
    diet_types: ['keto', 'low_carb', 'vegetarian'],
    prep_time_minutes: 20,
    cook_time_minutes: 25,
    servings: 1,
    calories: 450,
    protein: 25,
    carbs: 10,
    fat: 35,
    fiber: 4,
    ingredients: [
      { name: 'Cauliflower rice', amount: 2, unit: 'cups' },
      { name: 'Mozzarella cheese', amount: 1.5, unit: 'cups' },
      { name: 'Egg', amount: 1, unit: 'large' },
      { name: 'Almond flour', amount: 2, unit: 'tablespoons' },
      { name: 'Italian seasoning', amount: 1, unit: 'teaspoon' },
      { name: 'Garlic powder', amount: 0.5, unit: 'teaspoon' },
      { name: 'Tomato sauce', amount: 0.25, unit: 'cup' },
      { name: 'Bell pepper', amount: 0.25, unit: 'medium' },
      { name: 'Mushrooms', amount: 0.25, unit: 'cup' },
      { name: 'Pepperoni', amount: 10, unit: 'slices', optional: true },
      { name: 'Salt', amount: 0.5, unit: 'teaspoon' },
      { name: 'Pepper', amount: 0.25, unit: 'teaspoon' }
    ],
    instructions: [
      'Preheat oven to 425°F (220°C).',
      'Microwave cauliflower rice for 5 minutes, then let cool.',
      'Place cauliflower in a clean kitchen towel and squeeze out excess moisture.',
      'In a bowl, combine cauliflower, 1 cup mozzarella, egg, almond flour, Italian seasoning, garlic powder, salt, and pepper.',
      'Press mixture onto a parchment-lined baking sheet to form a crust.',
      'Bake for 15 minutes until golden.',
      'Remove from oven, add tomato sauce, remaining cheese, and toppings.',
      'Return to oven and bake for 10 more minutes until cheese is bubbly.',
      'Let cool slightly before slicing.'
    ],
    image_url: 'https://example.com/images/cauliflower-pizza.jpg'
  },
  {
    id: 12,
    name: 'Grilled Steak with Chimichurri',
    description: 'Juicy grilled steak topped with fresh chimichurri sauce.',
    meal_type: 'dinner',
    diet_types: ['high_protein', 'low_carb', 'paleo'],
    prep_time_minutes: 15,
    cook_time_minutes: 15,
    servings: 1,
    calories: 500,
    protein: 40,
    carbs: 5,
    fat: 35,
    fiber: 2,
    ingredients: [
      { name: 'Ribeye steak', amount: 6, unit: 'ounces' },
      { name: 'Parsley', amount: 0.5, unit: 'cup' },
      { name: 'Cilantro', amount: 0.25, unit: 'cup' },
      { name: 'Garlic', amount: 2, unit: 'cloves' },
      { name: 'Red wine vinegar', amount: 1, unit: 'tablespoon' },
      { name: 'Olive oil', amount: 3, unit: 'tablespoons' },
      { name: 'Red pepper flakes', amount: 0.25, unit: 'teaspoon' },
      { name: 'Salt', amount: 1, unit: 'teaspoon' },
      { name: 'Pepper', amount: 0.5, unit: 'teaspoon' }
    ],
    instructions: [
      'Season steak with half the salt and pepper.',
      'Let steak come to room temperature for 30 minutes.',
      'For chimichurri, finely chop parsley, cilantro, and garlic.',
      'Mix herbs and garlic with red wine vinegar, 2 tablespoons olive oil, red pepper flakes, and remaining salt and pepper.',
      'Heat a grill or pan over high heat.',
      'Brush steak with 1 tablespoon olive oil.',
      'Grill steak for 4-5 minutes per side for medium-rare.',
      'Let steak rest for 5 minutes before slicing.',
      'Serve topped with chimichurri sauce.'
    ],
    image_url: 'https://example.com/images/steak-chimichurri.jpg'
  },
  {
    id: 13,
    name: 'Apple with Almond Butter',
    description: 'A simple, nutritious snack combining crisp apple with creamy almond butter.',
    meal_type: 'snack',
    diet_types: ['balanced', 'vegetarian', 'vegan', 'paleo'],
    prep_time_minutes: 2,
    cook_time_minutes: 0,
    servings: 1,
    calories: 200,
    protein: 5,
    carbs: 25,
    fat: 10,
    fiber: 5,
    ingredients: [
      { name: 'Apple', amount: 1, unit: 'medium' },
      { name: 'Almond butter', amount: 1, unit: 'tablespoon' },
      { name: 'Cinnamon', amount: 0.25, unit: 'teaspoon', optional: true }
    ],
    instructions: [
      'Wash and slice the apple.',
      'Serve with almond butter for dipping.',
      'Sprinkle with cinnamon if desired.'
    ],
    image_url: 'https://example.com/images/apple-almond-butter.jpg'
  },
  {
    id: 14,
    name: 'Greek Yogurt with Honey and Walnuts',
    description: 'Creamy Greek yogurt topped with honey and crunchy walnuts.',
    meal_type: 'snack',
    diet_types: ['balanced', 'vegetarian', 'high_protein'],
    prep_time_minutes: 3,
    cook_time_minutes: 0,
    servings: 1,
    calories: 180,
    protein: 15,
    carbs: 15,
    fat: 8,
    fiber: 1,
    ingredients: [
      { name: 'Greek yogurt', amount: 0.75, unit: 'cup' },
      { name: 'Honey', amount: 1, unit: 'teaspoon' },
      { name: 'Walnuts', amount: 1, unit: 'tablespoon' }
    ],
    instructions: [
      'Place Greek yogurt in a bowl.',
      'Drizzle with honey.',
      'Top with chopped walnuts.'
    ],
    image_url: 'https://example.com/images/yogurt-honey.jpg'
  },
  {
    id: 15,
    name: 'Keto Fat Bombs',
    description: 'High-fat, low-carb snack perfect for a quick energy boost.',
    meal_type: 'snack',
    diet_types: ['keto', 'low_carb'],
    prep_time_minutes: 15,
    cook_time_minutes: 0,
    servings: 10,
    calories: 120,
    protein: 2,
    carbs: 1,
    fat: 12,
    fiber: 1,
    ingredients: [
      { name: 'Coconut oil', amount: 0.5, unit: 'cup' },
      { name: 'Almond butter', amount: 0.25, unit: 'cup' },
      { name: 'Cocoa powder', amount: 2, unit: 'tablespoons' },
      { name: 'Erythritol', amount: 2, unit: 'tablespoons' },
      { name: 'Vanilla extract', amount: 0.5, unit: 'teaspoon' },
      { name: 'Salt', amount: 0.25, unit: 'teaspoon' }
    ],
    instructions: [
      'Melt coconut oil in a microwave-safe bowl.',
      'Stir in almond butter until smooth.',
      'Add cocoa powder, erythritol, vanilla, and salt. Mix well.',
      'Pour mixture into silicone molds or a lined mini muffin tin.',
      'Freeze for at least 30 minutes until solid.',
      'Store in the refrigerator or freezer.'
    ],
    image_url: 'https://example.com/images/fat-bombs.jpg'
  }
];

// Mock diet plans
const mockDietPlans = [
  {
    id: 1,
    name: 'Weight Loss Balanced Plan',
    description: 'A balanced diet plan designed for sustainable weight loss.',
    goal_type: 'weight_loss',
    diet_type: 'balanced',
    duration_days: 28,
    daily_calories: 1800,
    daily_protein: 100,
    daily_carbs: 180,
    daily_fat: 60
  },
  {
    id: 2,
    name: 'Muscle Building High Protein',
    description: 'A high protein diet plan designed to support muscle growth and recovery.',
    goal_type: 'muscle_gain',
    diet_type: 'high_protein',
    duration_days: 28,
    daily_calories: 2500,
    daily_protein: 180,
    daily_carbs: 250,
    daily_fat: 70
  },
  {
    id: 3,
    name: 'Keto Weight Loss',
    description: 'A ketogenic diet plan for rapid weight loss through ketosis.',
    goal_type: 'weight_loss',
    diet_type: 'keto',
    duration_days: 28,
    daily_calories: 1600,
    daily_protein: 120,
    daily_carbs: 20,
    daily_fat: 120
  },
  {
    id: 4,
    name: 'Vegan Maintenance',
    description: 'A plant-based diet plan for maintaining weight and overall health.',
    goal_type: 'maintenance',
    diet_type: 'vegan',
    duration_days: 28,
    daily_calories: 2000,
    daily_protein: 80,
    daily_carbs: 280,
    daily_fat: 60
  },
  {
    id: 5,
    name: 'Mediterranean Lifestyle',
    description: 'A Mediterranean diet plan for heart health and longevity.',
    goal_type: 'maintenance',
    diet_type: 'mediterranean',
    duration_days: 28,
    daily_calories: 2200,
    daily_protein: 90,
    daily_carbs: 250,
    daily_fat: 80
  }
];

// Mock meal plans
const mockMealPlans = [
  // Weight Loss Balanced Plan - Day 1
  {
    id: 1,
    diet_plan_id: 1,
    day_number: 1,
    description: 'Day 1 of your balanced weight loss plan',
    created_at: '2025-03-01T00:00:00Z'
  },
  // Weight Loss Balanced Plan - Day 2
  {
    id: 2,
    diet_plan_id: 1,
    day_number: 2,
    description: 'Day 2 of your balanced weight loss plan',
    created_at: '2025-03-01T00:00:00Z'
  },
  // Muscle Building High Protein - Day 1
  {
    id: 3,
    diet_plan_id: 2,
    day_number: 1,
    description: 'Day 1 of your muscle building plan',
    created_at: '2025-03-01T00:00:00Z'
  },
  // Keto Weight Loss - Day 1
  {
    id: 4,
    diet_plan_id: 3,
    day_number: 1,
    description: 'Day 1 of your keto weight loss plan',
    created_at: '2025-03-01T00:00:00Z'
  },
  // Vegan Maintenance - Day 1
  {
    id: 5,
    diet_plan_id: 4,
    day_number: 1,
    description: 'Day 1 of your vegan maintenance plan',
    created_at: '2025-03-01T00:00:00Z'
  }
];

// Mock meal plan recipes
const mockMealPlanRecipes = [
  // Weight Loss Balanced Plan - Day 1
  {
    id: 1,
    meal_plan_id: 1,
    recipe_id: 1, // Greek Yogurt with Berries
    servings: 1,
    order_index: 1, // Breakfast
    created_at: '2025-03-01T00:00:00Z'
  },
  {
    id: 2,
    meal_plan_id: 1,
    recipe_id: 5, // Grilled Chicken Salad
    servings: 1,
    order_index: 2, // Lunch
    created_at: '2025-03-01T00:00:00Z'
  },
  {
    id: 3,
    meal_plan_id: 1,
    recipe_id: 9, // Baked Salmon with Roasted Vegetables
    servings: 1,
    order_index: 3, // Dinner
    created_at: '2025-03-01T00:00:00Z'
  },
  {
    id: 4,
    meal_plan_id: 1,
    recipe_id: 13, // Apple with Almond Butter
    servings: 1,
    order_index: 4, // Snack
    created_at: '2025-03-01T00:00:00Z'
  },
  
  // Muscle Building High Protein - Day 1
  {
    id: 5,
    meal_plan_id: 3,
    recipe_id: 2, // Avocado Toast with Poached Egg
    servings: 1,
    order_index: 1, // Breakfast
    created_at: '2025-03-01T00:00:00Z'
  },
  {
    id: 6,
    meal_plan_id: 3,
    recipe_id: 5, // Grilled Chicken Salad
    servings: 1.5, // Larger portion
    order_index: 2, // Lunch
    created_at: '2025-03-01T00:00:00Z'
  },
  {
    id: 7,
    meal_plan_id: 3,
    recipe_id: 12, // Grilled Steak with Chimichurri
    servings: 1,
    order_index: 3, // Dinner
    created_at: '2025-03-01T00:00:00Z'
  },
  {
    id: 8,
    meal_plan_id: 3,
    recipe_id: 14, // Greek Yogurt with Honey and Walnuts
    servings: 1,
    order_index: 4, // Snack
    created_at: '2025-03-01T00:00:00Z'
  },
  
  // Keto Weight Loss - Day 1
  {
    id: 9,
    meal_plan_id: 4,
    recipe_id: 3, // Keto Breakfast Bowl
    servings: 1,
    order_index: 1, // Breakfast
    created_at: '2025-03-01T00:00:00Z'
  },
  {
    id: 10,
    meal_plan_id: 4,
    recipe_id: 7, // Keto Tuna Salad Lettuce Wraps
    servings: 1,
    order_index: 2, // Lunch
    created_at: '2025-03-01T00:00:00Z'
  },
  {
    id: 11,
    meal_plan_id: 4,
    recipe_id: 11, // Keto Cauliflower Crust Pizza
    servings: 1,
    order_index: 3, // Dinner
    created_at: '2025-03-01T00:00:00Z'
  },
  {
    id: 12,
    meal_plan_id: 4,
    recipe_id: 15, // Keto Fat Bombs
    servings: 2,
    order_index: 4, // Snack
    created_at: '2025-03-01T00:00:00Z'
  },
  
  // Vegan Maintenance - Day 1
  {
    id: 13,
    meal_plan_id: 5,
    recipe_id: 4, // Vegan Overnight Oats
    servings: 1,
    order_index: 1, // Breakfast
    created_at: '2025-03-01T00:00:00Z'
  },
  {
    id: 14,
    meal_plan_id: 5,
    recipe_id: 6, // Quinoa Buddha Bowl
    servings: 1,
    order_index: 2, // Lunch
    created_at: '2025-03-01T00:00:00Z'
  },
  {
    id: 15,
    meal_plan_id: 5,
    recipe_id: 10, // Vegan Lentil Curry
    servings: 1,
    order_index: 3, // Dinner
    created_at: '2025-03-01T00:00:00Z'
  },
  {
    id: 16,
    meal_plan_id: 5,
    recipe_id: 13, // Apple with Almond Butter
    servings: 1,
    order_index: 4, // Snack
    created_at: '2025-03-01T00:00:00Z'
  }
];

// Mock user diet plans
const mockUserDietPlans = [
  {
    id: 'user-diet-plan-1',
    user_id: 'user-1',
    diet_plan_id: 1, // Weight Loss Balanced Plan
    start_date: '2025-03-15',
    end_date: null,
    is_active: true,
    created_at: '2025-03-15T10:00:00Z',
    updated_at: '2025-03-15T10:00:00Z'
  }
];

// Mock user meal logs
const mockUserMealLogs = [
  {
    id: 'meal-log-1',
    user_id: 'user-1',
    meal_date: '2025-03-20',
    meal_type: 'breakfast',
    recipe_id: 1, // Greek Yogurt with Berries
    servings: 1,
    calories: 250,
    protein: 20,
    carbs: 30,
    fat: 5,
    notes: 'Added extra berries',
    created_at: '2025-03-20T08:30:00Z'
  },
  {
    id: 'meal-log-2',
    user_id: 'user-1',
    meal_date: '2025-03-20',
    meal_type: 'lunch',
    recipe_id: 5, // Grilled Chicken Salad
    servings: 1,
    calories: 400,
    protein: 35,
    carbs: 15,
    fat: 20,
    notes: '',
    created_at: '2025-03-20T12:45:00Z'
  },
  {
    id: 'meal-log-3',
    user_id: 'user-1',
    meal_date: '2025-03-21',
    meal_type: 'breakfast',
    recipe_id: 2, // Avocado Toast with Poached Egg
    servings: 1,
    calories: 350,
    protein: 15,
    carbs: 30,
    fat: 20,
    notes: '',
    created_at: '2025-03-21T08:15:00Z'
  }
];

export default DietService;
