'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDietTypes, useRecommendedDiets, useTodaysMealPlan, useDietPlans, useCustomDietPlan } from '@/hooks/useDietPlanner';

export default function DietWithHooks() {
  // Mock user ID and profile - in a real app, this would come from authentication and user settings
  const userId = 'user-1';
  const userProfile = {
    goal_type: 'weight_loss',
    activity_level: 'moderately_active',
    gender: 'male',
    age: 35,
    weight: 85, // kg
    height: 178, // cm
    dietary_preferences: ['balanced']
  };
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('today');
  
  // State for custom diet plan form
  const [showCustomPlanForm, setShowCustomPlanForm] = useState(false);
  const [customPlanPreferences, setCustomPlanPreferences] = useState({
    diet_type: 'balanced',
    excluded_ingredients: []
  });
  const [excludedIngredient, setExcludedIngredient] = useState('');
  
  // Use custom hooks
  const { 
    dietTypes, 
    isLoading: isTypesLoading 
  } = useDietTypes();
  
  const { 
    todaysMealPlan, 
    mealStatus, 
    completionPercentage,
    toggleMealCompletion,
    updateMealServings,
    logCompletedMeal,
    isLoading: isTodayLoading 
  } = useTodaysMealPlan(userId);
  
  const { 
    recommendedPlans, 
    isLoading: isRecommendationsLoading 
  } = useRecommendedDiets(userProfile);
  
  const { 
    filteredPlans, 
    filters, 
    updateFilters, 
    isLoading: isPlansLoading 
  } = useDietPlans();
  
  const {
    generateCustomDietPlan,
    assignGeneratedPlan,
    isLoading: isGeneratingPlan
  } = useCustomDietPlan(userId);
  
  // State for meal completion modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [mealNotes, setMealNotes] = useState('');
  
  // Handle meal completion
  const handleCompleteMeal = async () => {
    if (!selectedMeal) return;
    
    try {
      await logCompletedMeal(selectedMeal.type, selectedMeal.id, mealNotes);
      setShowCompletionModal(false);
      setSelectedMeal(null);
      setMealNotes('');
      // In a real app, you would show a success message and update the UI
    } catch (error) {
      console.error('Error completing meal:', error);
    }
  };
  
  // Handle adding excluded ingredient
  const handleAddExcludedIngredient = () => {
    if (!excludedIngredient.trim()) return;
    
    setCustomPlanPreferences(prev => ({
      ...prev,
      excluded_ingredients: [...prev.excluded_ingredients, excludedIngredient.trim()]
    }));
    
    setExcludedIngredient('');
  };
  
  // Handle removing excluded ingredient
  const handleRemoveExcludedIngredient = (ingredient) => {
    setCustomPlanPreferences(prev => ({
      ...prev,
      excluded_ingredients: prev.excluded_ingredients.filter(item => item !== ingredient)
    }));
  };
  
  // Handle generating custom diet plan
  const handleGenerateCustomPlan = async () => {
    try {
      const plan = await generateCustomDietPlan(userProfile, customPlanPreferences);
      
      if (plan) {
        // Assign the plan to the user
        await assignGeneratedPlan(plan.id);
        
        // Close the form and show success message
        setShowCustomPlanForm(false);
        
        // Reset form
        setCustomPlanPreferences({
          diet_type: 'balanced',
          excluded_ingredients: []
        });
        
        // In a real app, you would show a success message and update the UI
        
        // Switch to today's tab to see the new plan
        setActiveTab('today');
      }
    } catch (error) {
      console.error('Error generating custom diet plan:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-16">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Diet Plans</h1>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {['today', 'recommended', 'browse', 'custom'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab 
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'today' ? "Today's Meals" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Today's Meals */}
        {activeTab === 'today' && (
          <div>
            {isTodayLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Loading today's meals...</p>
              </div>
            ) : todaysMealPlan ? (
              <div>
                <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{todaysMealPlan.name}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{todaysMealPlan.day}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {todaysMealPlan.total_calories} cal • {todaysMealPlan.total_protein}g protein • {todaysMealPlan.total_carbs}g carbs • {todaysMealPlan.total_fat}g fat
                      </p>
                      <div className="mt-1 flex items-center">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${completionPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">{completionPercentage}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Meal sections */}
                  {Object.entries(todaysMealPlan.meals).map(([mealType, recipes]) => (
                    recipes.length > 0 && (
                      <div key={mealType} className="mb-6 last:mb-0">
                        <h3 className="font-medium text-gray-900 dark:text-white capitalize mb-3">{mealType}</h3>
                        
                        <div className="space-y-4">
                          {recipes.map((recipe) => (
                            <div 
                              key={recipe.id} 
                              className={`p-3 rounded-lg border ${
                                mealStatus[recipe.id]?.completed 
                                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900' 
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 dark:text-white">{recipe.name}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {recipe.calories * (mealStatus[recipe.id]?.servings || recipe.servings)} cal • 
                                    {recipe.prep_time_minutes + recipe.cook_time_minutes} min
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{recipe.description}</p>
                                </div>
                                <button 
                                  className={`p-2 rounded-full ${
                                    mealStatus[recipe.id]?.completed 
                                      ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400' 
                                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                  }`}
                                  onClick={() => toggleMealCompletion(recipe.id)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                              
                              {mealStatus[recipe.id]?.completed ? (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <label className="text-xs text-gray-500 dark:text-gray-500">Servings</label>
                                      <div className="flex items-center mt-1">
                                        <button 
                                          className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                                          onClick={() => updateMealServings(recipe.id, Math.max(0.5, (mealStatus[recipe.id]?.servings || recipe.servings) - 0.5))}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                          </svg>
                                        </button>
                                        <span className="mx-2 text-sm">{mealStatus[recipe.id]?.servings || recipe.servings}</span>
                                        <button 
                                          className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                                          onClick={() => updateMealServings(recipe.id, (mealStatus[recipe.id]?.servings || recipe.servings) + 0.5)}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                    <button 
                                      className="btn-outline text-sm"
                                      onClick={() => {
                                        setSelectedMeal({ id: recipe.id, type: mealType, name: recipe.name });
                                        setShowCompletionModal(true);
                                      }}
                                    >
                                      Add Notes
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                  <button 
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                    onClick={() => {
                                      // In a real app, this would navigate to the recipe details page
                                      console.log(`View recipe: ${recipe.id}`);
                                    }}
                                  >
                                    View Recipe
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                  
                  {/* Nutrition summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Nutrition Summary</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Calories</div>
                        <div className="text-xl font-semibold text-gray-900 dark:text-white">{todaysMealPlan.total_calories}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Protein</div>
                        <div className="text-xl font-semibold text-gray-900 dark:text-white">{todaysMealPlan.total_protein}g</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Carbs</div>
                        <div className="text-xl font-semibold text-gray-900 dark:text-white">{todaysMealPlan.total_carbs}g</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Fat</div>
                        <div className="text-xl font-semibold text-gray-900 dark:text-white">{todaysMealPlan.total_fat}g</div>
                      </div>
                    </div>
                    
                    {/* Macronutrient breakdown */}
                    <div className="mt-4">
                      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 float-left" 
                          style={{ width: `${(todaysMealPlan.total_protein * 4 / todaysMealPlan.total_calories) * 100}%` }}
                        ></div>
                        <div 
                          className="h-full bg-blue-500 float-left" 
                          style={{ width: `${(todaysMealPlan.total_carbs * 4 / todaysMealPlan.total_calories) * 100}%` }}
                        ></div>
                        <div 
                          className="h-full bg-yellow-500 float-left" 
                          style={{ width: `${(todaysMealPlan.total_fat * 9 / todaysMealPlan.total_calories) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-red-500">Protein ({Math.round((todaysMealPlan.total_protein * 4 / todaysMealPlan.total_calories) * 100)}%)</span>
                        <span className="text-blue-500">Carbs ({Math.round((todaysMealPlan.total_carbs * 4 / todaysMealPlan.total_calories) * 100)}%)</span>
                        <span className="text-yellow-500">Fat ({Math.round((todaysMealPlan.total_fat * 9 / todaysMealPlan.total_calories) * 100)}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Meal Plan Assigned</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">You don't have a meal plan assigned yet. Browse our recommended plans or create a custom plan to get started.</p>
                <button 
                  className="btn-primary"
                  onClick={() => setActiveTab('recommended')}
                >
                  View Recommendations
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recommended Diet Plans */}
        {activeTab === 'recommended' && (
          <div>
            <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommended for You</h2>
              
              {isRecommendationsLoading ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">Loading recommendations...</p>
                </div>
              ) : recommendedPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedPlans.map((plan) => (
                    <div key={plan.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">{plan.name}</h3>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>{plan.daily_calories} cal/day</span>
                          <span>{plan.duration_days} days</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                            {plan.goal_type.replace('_', ' ')}
                          </span>
                          <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full">
                            {plan.diet_type}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mb-4">
                          <span>Protein: {plan.daily_protein}g</span>
                          <span>Carbs: {plan.daily_carbs}g</span>
                          <span>Fat: {plan.daily_fat}g</span>
                        </div>
                        <Link href={`/diet/plan/${plan.id}`} className="btn-outline w-full text-center">
                          View Plan
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">No recommendations available. Please update your profile.</p>
              )}
            </div>
          </div>
        )}

        {/* Browse Diet Plans */}
        {activeTab === 'browse' && (
          <div>
            <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Browse Diet Plans</h2>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal</label>
                  <select
                    className="form-select"
                    value={filters.goal}
                    onChange={(e) => updateFilters({ ...filters, goal: e.target.value })}
                  >
                    <option value="all">All Goals</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Diet Type</label>
                  <select
                    className="form-select"
                    value={filters.dietType}
                    onChange={(e) => updateFilters({ ...filters, dietType: e.target.value })}
                  >
                    <option value="all">All Types</option>
                    {dietTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {isPlansLoading ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">Loading diet plans...</p>
                </div>
              ) : filteredPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPlans.map((plan) => (
                    <div key={plan.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">{plan.name}</h3>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>{plan.daily_calories} cal/day</span>
                          <span>{plan.duration_days} days</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                            {plan.goal_type.replace('_', ' ')}
                          </span>
                          <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full">
                            {plan.diet_type}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mb-4">
                          <span>Protein: {plan.daily_protein}g</span>
                          <span>Carbs: {plan.daily_carbs}g</span>
                          <span>Fat: {plan.daily_fat}g</span>
                        </div>
                        <Link href={`/diet/plan/${plan.id}`} className="btn-outline w-full text-center">
                          View Plan
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">No diet plans match your filters.</p>
              )}
            </div>
          </div>
        )}

        {/* Custom Diet Plan */}
        {activeTab === 'custom' && (
          <div>
            <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Custom Diet Plan</h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create a personalized diet plan based on your preferences and dietary restrictions.
              </p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Diet Type</label>
                  <select
                    className="form-select w-full"
                    value={customPlanPreferences.diet_type}
                    onChange={(e) => setCustomPlanPreferences({...customPlanPreferences, diet_type: e.target.value})}
                  >
                    {dietTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Select the type of diet that best fits your preferences and lifestyle.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excluded Ingredients</label>
                  <div className="flex">
                    <input
                      type="text"
                      className="form-input flex-1"
                      placeholder="Enter ingredient to exclude"
                      value={excludedIngredient}
                      onChange={(e) => setExcludedIngredient(e.target.value)}
                    />
                    <button 
                      className="btn-primary ml-2"
                      onClick={handleAddExcludedIngredient}
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Add ingredients you want to exclude from your diet plan (allergies, dislikes, etc.).
                  </p>
                  
                  {customPlanPreferences.excluded_ingredients.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {customPlanPreferences.excluded_ingredients.map((ingredient, index) => (
                        <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full flex items-center">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{ingredient}</span>
                          <button 
                            className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={() => handleRemoveExcludedIngredient(ingredient)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    className="btn-primary w-full"
                    onClick={handleGenerateCustomPlan}
                    disabled={isGeneratingPlan}
                  >
                    {isGeneratingPlan ? 'Generating Plan...' : 'Generate Custom Diet Plan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Meal Completion Modal */}
      {showCompletionModal && selectedMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Complete {selectedMeal.name}</h3>
            
            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meal Notes (optional)</label>
              <textarea
                id="notes"
                className="form-textarea w-full"
                rows={3}
                placeholder="How did you like it? Any modifications?"
                value={mealNotes}
                onChange={(e) => setMealNotes(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                className="btn-outline"
                onClick={() => setShowCompletionModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleCompleteMeal}
              >
                Complete Meal
              </button>
            </div>
          </div>
        </div>
      )}

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
            <Link href="/food" className="nav-link flex flex-col items-center py-2">
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
            <Link href="/diet" className="nav-link-active flex flex-col items-center py-2">
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
