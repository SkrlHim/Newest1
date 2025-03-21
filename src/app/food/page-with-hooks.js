'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useFoodSearch, useMealLogging, useFavoriteFoods, useRecentFoods, useCustomFood } from '@/hooks/useCalorieTracking';

export default function FoodTrackingWithHooks() {
  // Mock user ID - in a real app, this would come from authentication
  const userId = 'user-1';
  
  // State for selected meal type
  const [mealType, setMealType] = useState('breakfast');
  
  // State for custom food form
  const [showCustomFoodForm, setShowCustomFoodForm] = useState(false);
  const [customFoodData, setCustomFoodData] = useState({
    name: '',
    brand: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    serving_size: '',
    serving_unit: ''
  });
  
  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Use custom hooks
  const { 
    searchTerm, 
    setSearchTerm, 
    searchResults, 
    isLoading: isSearchLoading 
  } = useFoodSearch();
  
  const { 
    meals, 
    calorySummary, 
    isLoading: isMealLoading, 
    addFoodToMeal, 
    removeFoodFromMeal 
  } = useMealLogging(userId, today);
  
  const { 
    favoriteFoods, 
    toggleFavorite, 
    isFavorite 
  } = useFavoriteFoods(userId);
  
  const { 
    recentFoods 
  } = useRecentFoods(userId);
  
  const { 
    addCustomFood, 
    isLoading: isAddingCustomFood 
  } = useCustomFood(userId);
  
  // Handle custom food form submission
  const handleCustomFoodSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert string values to numbers
      const formattedData = {
        ...customFoodData,
        calories: parseFloat(customFoodData.calories),
        protein: parseFloat(customFoodData.protein),
        carbs: parseFloat(customFoodData.carbs),
        fat: parseFloat(customFoodData.fat),
        serving_size: parseFloat(customFoodData.serving_size)
      };
      
      // Add custom food
      const newFood = await addCustomFood(formattedData);
      
      // Add to current meal
      await addFoodToMeal(mealType, newFood);
      
      // Reset form and hide it
      setCustomFoodData({
        name: '',
        brand: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        serving_size: '',
        serving_unit: ''
      });
      setShowCustomFoodForm(false);
    } catch (error) {
      console.error('Error adding custom food:', error);
    }
  };
  
  // Calculate total calories for each meal
  const mealCalories = {
    breakfast: calorySummary.meals.breakfast ? calorySummary.meals.breakfast.calories : 0,
    lunch: calorySummary.meals.lunch ? calorySummary.meals.lunch.calories : 0,
    dinner: calorySummary.meals.dinner ? calorySummary.meals.dinner.calories : 0,
    snack: calorySummary.meals.snack ? calorySummary.meals.snack.calories : 0,
  };
  
  // Calculate total calories for the day
  const totalCalories = calorySummary.total_calories || 0;
  
  // Daily calorie goal - in a real app, this would come from user settings
  const dailyCalorieGoal = 2200;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-16">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Food Tracking</h1>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300 mr-4">
              <span className="font-medium">{totalCalories}</span> / {dailyCalorieGoal} cal
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Meal Type Selector */}
        <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Meal</h2>
          <div className="grid grid-cols-4 gap-2">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
              <button
                key={type}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  mealType === type 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
                onClick={() => setMealType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Today's Meals Summary */}
        <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Meals</h2>
          
          {isMealLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">Loading meals...</p>
            </div>
          ) : (
            <>
              {Object.entries(meals).map(([type, foods]) => (
                <div key={type} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white capitalize">{type}</h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{mealCalories[type]} cal</span>
                  </div>
                  
                  {foods.length > 0 ? (
                    <ul className="space-y-2">
                      {foods.map((food, index) => (
                        <li key={`${food.id}-${index}`} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          <div>
                            <p className="text-sm font-medium">{food.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {food.serving_size} {food.serving_unit} ({food.calories * (food.servings || 1)} cal)
                            </p>
                          </div>
                          <button 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeFoodFromMeal(type, food.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">No foods added yet</p>
                  )}
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Calories</span>
                  <span className="font-medium">{totalCalories} cal</span>
                </div>
                
                {/* Macronutrient breakdown */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Macronutrients</span>
                    <span>
                      {calorySummary.total_protein || 0}g protein • {calorySummary.total_carbs || 0}g carbs • {calorySummary.total_fat || 0}g fat
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    {totalCalories > 0 && (
                      <>
                        <div 
                          className="h-full bg-red-500 float-left" 
                          style={{ width: `${(calorySummary.total_protein * 4 / totalCalories) * 100}%` }}
                        ></div>
                        <div 
                          className="h-full bg-blue-500 float-left" 
                          style={{ width: `${(calorySummary.total_carbs * 4 / totalCalories) * 100}%` }}
                        ></div>
                        <div 
                          className="h-full bg-yellow-500 float-left" 
                          style={{ width: `${(calorySummary.total_fat * 9 / totalCalories) * 100}%` }}
                        ></div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-red-500">Protein</span>
                    <span className="text-blue-500">Carbs</span>
                    <span className="text-yellow-500">Fat</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Food Search */}
        <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Food to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h2>
          
          <div className="relative mb-4">
            <input
              type="text"
              className="form-input w-full pl-10"
              placeholder="Search for food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {searchTerm ? (
            <div>
              <h3 className="font-medium text-sm mb-2">Search Results</h3>
              {isSearchLoading ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">Searching...</p>
              ) : searchResults.length > 0 ? (
                <ul className="space-y-2 mb-4">
                  {searchResults.map((food) => (
                    <li key={food.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <div>
                        <p className="text-sm font-medium">{food.name}</p>
                        {food.brand && <p className="text-xs text-gray-500">{food.brand}</p>}
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {food.serving_size} {food.serving_unit} ({food.calories} cal)
                        </p>
                      </div>
                      <div className="flex items-center">
                        <button 
                          className={`text-gray-400 hover:text-yellow-500 mr-2 ${isFavorite(food.id) ? 'text-yellow-500' : ''}`}
                          onClick={() => toggleFavorite(food.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={isFavorite(food.id) ? "currentColor" : "none"} stroke="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                        <button 
                          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-1"
                          onClick={() => addFoodToMeal(mealType, food)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">No foods found. Try a different search term or add a custom food.</p>
              )}
              
              <div className="flex justify-center">
                <button 
                  className="btn-outline"
                  onClick={() => setShowCustomFoodForm(true)}
                >
                  Add Custom Food
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Recent Foods */}
              <div className="mb-6">
                <h3 className="font-medium text-sm mb-2">Recent Foods</h3>
                {recentFoods.length > 0 ? (
                  <ul className="space-y-2">
                    {recentFoods.map((food) => (
                      <li key={food.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <div>
                          <p className="text-sm font-medium">{food.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {food.serving_size} {food.serving_unit} ({food.calories} cal)
                          </p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            className={`text-gray-400 hover:text-yellow-500 mr-2 ${isFavorite(food.id) ? 'text-yellow-500' : ''}`}
                            onClick={() => toggleFavorite(food.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={isFavorite(food.id) ? "currentColor" : "none"} stroke="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                          <button 
                            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-1"
                            onClick={() => addFoodToMeal(mealType, food)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">No recent foods</p>
                )}
              </div>
              
              {/* Favorite Foods */}
              <div>
                <h3 className="font-medium text-sm mb-2">Favorite Foods</h3>
                {favoriteFoods.length > 0 ? (
                  <ul className="space-y-2">
                    {favoriteFoods.map((food) => (
                      <li key={food.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <div>
                          <p className="text-sm font-medium">{food.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {food.serving_size} {food.serving_unit} ({food.calories} cal)
                          </p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            className="text-yellow-500 hover:text-gray-400 mr-2"
                            onClick={() => toggleFavorite(food.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                          <button 
                            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-1"
                            onClick={() => addFoodToMeal(mealType, food)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">No favorite foods</p>
                )}
              </div>
              
              <div className="mt-6 flex justify-center">
                <button 
                  className="btn-outline"
                  onClick={() => setShowCustomFoodForm(true)}
                >
                  Add Custom Food
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Custom Food Form Modal */}
        {showCustomFoodForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Custom Food</h3>
              
              <form onSubmit={handleCustomFoodSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="form-label">Food Name</label>
                    <input
                      type="text"
                      id="name"
                      className="form-input"
                      value={customFoodData.name}
                      onChange={(e) => setCustomFoodData({...customFoodData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="brand" className="form-label">Brand (optional)</label>
                    <input
                      type="text"
                      id="brand"
                      className="form-input"
                      value={customFoodData.brand}
                      onChange={(e) => setCustomFoodData({...customFoodData, brand: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="calories" className="form-label">Calories</label>
                      <input
                        type="number"
                        id="calories"
                        className="form-input"
                        value={customFoodData.calories}
                        onChange={(e) => setCustomFoodData({...customFoodData, calories: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="protein" className="form-label">Protein (g)</label>
                      <input
                        type="number"
                        id="protein"
                        className="form-input"
                        value={customFoodData.protein}
                        onChange={(e) => setCustomFoodData({...customFoodData, protein: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="carbs" className="form-label">Carbs (g)</label>
                      <input
                        type="number"
                        id="carbs"
                        className="form-input"
                        value={customFoodData.carbs}
                        onChange={(e) => setCustomFoodData({...customFoodData, carbs: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="fat" className="form-label">Fat (g)</label>
                      <input
                        type="number"
                        id="fat"
                        className="form-input"
                        value={customFoodData.fat}
                        onChange={(e) => setCustomFoodData({...customFoodData, fat: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="serving_size" className="form-label">Serving Size</label>
                      <input
                        type="number"
                        id="serving_size"
                        className="form-input"
                        value={customFoodData.serving_size}
                        onChange={(e) => setCustomFoodData({...customFoodData, serving_size: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="serving_unit" className="form-label">Serving Unit</label>
                      <input
                        type="text"
                        id="serving_unit"
                        className="form-input"
                        value={customFoodData.serving_unit}
                        onChange={(e) => setCustomFoodData({...customFoodData, serving_unit: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setShowCustomFoodForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isAddingCustomFood}
                  >
                    {isAddingCustomFood ? 'Adding...' : 'Add Food'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around">
            <Link href="/dashboard" className="nav-link flex flex-col items-center py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link href="/food" className="nav-link-active flex flex-col items-center py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs mt-1">Food</span>
            </Link>
            <Link href="/workouts" className="nav-link flex flex-col items-center py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs mt-1">Workouts</span>
            </Link>
            <Link href="/diet" className="nav-link flex flex-col items-center py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-xs mt-1">Diet</span>
            </Link>
            <Link href="/progress" className="nav-link flex flex-col items-center py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs mt-1">Progress</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
