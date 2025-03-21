// Unit tests for the DietService
import DietService from '@/services/DietService';

describe('DietService', () => {
  // Test getDietTypes function
  test('getDietTypes returns all diet types', async () => {
    const dietTypes = await DietService.getDietTypes();
    expect(Array.isArray(dietTypes)).toBe(true);
    expect(dietTypes.length).toBeGreaterThan(0);
    expect(dietTypes[0]).toHaveProperty('id');
    expect(dietTypes[0]).toHaveProperty('name');
    expect(dietTypes[0]).toHaveProperty('description');
  });

  // Test getAllRecipes function
  test('getAllRecipes returns all recipes', async () => {
    const recipes = await DietService.getAllRecipes();
    expect(Array.isArray(recipes)).toBe(true);
    expect(recipes.length).toBeGreaterThan(0);
    expect(recipes[0]).toHaveProperty('id');
    expect(recipes[0]).toHaveProperty('name');
    expect(recipes[0]).toHaveProperty('calories');
  });

  // Test getRecipesByDietType function
  test('getRecipesByDietType returns recipes filtered by diet type', async () => {
    const dietType = 'keto'; // Assuming this diet type exists in mock data
    const recipes = await DietService.getRecipesByDietType(dietType);
    expect(Array.isArray(recipes)).toBe(true);
    if (recipes.length > 0) {
      expect(recipes[0].diet_types).toContain(dietType);
    }
  });

  // Test getRecipesByMealType function
  test('getRecipesByMealType returns recipes filtered by meal type', async () => {
    const mealType = 'breakfast'; // Assuming this meal type exists in mock data
    const recipes = await DietService.getRecipesByMealType(mealType);
    expect(Array.isArray(recipes)).toBe(true);
    if (recipes.length > 0) {
      expect(recipes[0].meal_type).toBe(mealType);
    }
  });

  // Test searchRecipes function
  test('searchRecipes returns recipes matching the query', async () => {
    const query = 'chicken'; // Assuming recipes with chicken exist in mock data
    const recipes = await DietService.searchRecipes(query);
    expect(Array.isArray(recipes)).toBe(true);
    if (recipes.length > 0) {
      const matchesQuery = recipes.some(recipe => 
        recipe.name.toLowerCase().includes(query) || 
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient => ingredient.name.toLowerCase().includes(query))
      );
      expect(matchesQuery).toBe(true);
    }
  });

  // Test getAllDietPlans function
  test('getAllDietPlans returns all diet plans', async () => {
    const plans = await DietService.getAllDietPlans();
    expect(Array.isArray(plans)).toBe(true);
    expect(plans.length).toBeGreaterThan(0);
    expect(plans[0]).toHaveProperty('id');
    expect(plans[0]).toHaveProperty('name');
    expect(plans[0]).toHaveProperty('goal_type');
    expect(plans[0]).toHaveProperty('diet_type');
  });

  // Test getRecommendedDietPlans function
  test('getRecommendedDietPlans returns plans based on user profile', async () => {
    const userProfile = {
      goal_type: 'weight_loss',
      activity_level: 'moderately_active',
      gender: 'male',
      age: 35,
      weight: 85,
      height: 178,
      dietary_preferences: ['balanced']
    };
    const plans = await DietService.getRecommendedDietPlans(userProfile);
    expect(Array.isArray(plans)).toBe(true);
    if (plans.length > 0) {
      expect(plans[0].goal_type).toBe(userProfile.goal_type);
    }
  });

  // Test getTodaysMealPlan function
  test('getTodaysMealPlan returns meal plan for the user', async () => {
    const userId = 'user-1'; // Assuming this ID exists in mock data
    const mealPlan = await DietService.getTodaysMealPlan(userId);
    if (mealPlan) {
      expect(mealPlan).toHaveProperty('name');
      expect(mealPlan).toHaveProperty('meals');
      expect(mealPlan).toHaveProperty('total_calories');
      expect(mealPlan.meals).toHaveProperty('breakfast');
    }
  });

  // Test generateCustomDietPlan function
  test('generateCustomDietPlan creates a custom diet plan', async () => {
    const userProfile = {
      goal_type: 'weight_loss',
      activity_level: 'moderately_active',
      gender: 'male',
      age: 35,
      weight: 85,
      height: 178
    };
    const preferences = {
      diet_type: 'balanced',
      excluded_ingredients: ['peanuts', 'shellfish']
    };
    
    const plan = await DietService.generateCustomDietPlan(userProfile, preferences);
    expect(plan).toBeDefined();
    expect(plan).toHaveProperty('id');
    expect(plan).toHaveProperty('name');
    expect(plan).toHaveProperty('meal_plans');
    expect(plan.diet_type).toBe(preferences.diet_type);
    expect(plan.goal_type).toBe(userProfile.goal_type);
  });
});
