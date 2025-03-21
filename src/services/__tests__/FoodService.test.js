// Unit tests for the FoodService
import { FoodService } from '@/services/FoodService';

describe('FoodService', () => {
  // Test searchFood function
  test('searchFood returns matching food items', async () => {
    const results = await FoodService.searchFood('apple');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name.toLowerCase()).toContain('apple');
  });

  // Test getFoodDetails function
  test('getFoodDetails returns correct food item', async () => {
    const foodId = 'food-1'; // Assuming this ID exists in mock data
    const food = await FoodService.getFoodDetails(foodId);
    expect(food).toBeDefined();
    expect(food.id).toBe(foodId);
  });

  // Test addCustomFood function
  test('addCustomFood adds a new food item', async () => {
    const customFood = {
      name: 'Test Custom Food',
      calories: 200,
      protein: 10,
      carbs: 20,
      fat: 5,
      serving_size: '100g'
    };
    
    const result = await FoodService.addCustomFood('user-1', customFood);
    expect(result).toBeDefined();
    expect(result.name).toBe(customFood.name);
    expect(result.calories).toBe(customFood.calories);
  });

  // Test getFavoriteFoods function
  test('getFavoriteFoods returns user favorite foods', async () => {
    const favorites = await FoodService.getFavoriteFoods('user-1');
    expect(Array.isArray(favorites)).toBe(true);
  });

  // Test toggleFavoriteFood function
  test('toggleFavoriteFood toggles favorite status', async () => {
    const foodId = 'food-1';
    const initialStatus = await FoodService.isFavoriteFood('user-1', foodId);
    const result = await FoodService.toggleFavoriteFood('user-1', foodId);
    expect(result.is_favorite).toBe(!initialStatus);
  });
});
