'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DietPlans() {
  // Mock data for diet plans
  const [dietPlans, setDietPlans] = useState([
    {
      id: 1,
      name: 'Weight Loss Meal Plan',
      description: 'A calorie-controlled meal plan designed for steady weight loss with balanced nutrition.',
      diet_type: 'Standard Balanced',
      calorie_range: '1500-1800',
      goal: 'weight_loss',
      image: '🥗',
      macros: { carbs: 40, protein: 30, fat: 30 }
    },
    {
      id: 2,
      name: 'Keto Diet Plan',
      description: 'High fat, low carb diet designed to achieve ketosis for effective weight loss.',
      diet_type: 'Keto',
      calorie_range: '1800-2200',
      goal: 'weight_loss',
      image: '🥑',
      macros: { carbs: 5, protein: 25, fat: 70 }
    },
    {
      id: 3,
      name: 'Muscle Building Plan',
      description: 'High protein meal plan designed to support muscle growth and recovery.',
      diet_type: 'Standard Balanced',
      calorie_range: '2500-3000',
      goal: 'muscle_gain',
      image: '🍗',
      macros: { carbs: 40, protein: 40, fat: 20 }
    },
    {
      id: 4,
      name: 'Vegan Weight Loss',
      description: 'Plant-based meal plan for weight loss with complete protein sources.',
      diet_type: 'Vegan',
      calorie_range: '1600-1900',
      goal: 'weight_loss',
      image: '🥦',
      macros: { carbs: 55, protein: 25, fat: 20 }
    },
    {
      id: 5,
      name: 'Mediterranean Diet',
      description: 'Heart-healthy diet based on traditional foods from Mediterranean countries.',
      diet_type: 'Mediterranean',
      calorie_range: '2000-2400',
      goal: 'maintenance',
      image: '🫒',
      macros: { carbs: 50, protein: 20, fat: 30 }
    }
  ]);

  // Mock data for today's meals
  const [todayMeals, setTodayMeals] = useState({
    breakfast: {
      name: 'Greek Yogurt Parfait',
      calories: 320,
      protein: 22,
      carbs: 40,
      fat: 8,
      ingredients: [
        { name: 'Greek Yogurt', amount: '1 cup' },
        { name: 'Mixed Berries', amount: '1/2 cup' },
        { name: 'Granola', amount: '1/4 cup' },
        { name: 'Honey', amount: '1 tsp' }
      ],
      instructions: 'Layer yogurt, berries, and granola in a bowl. Drizzle with honey.',
      completed: true
    },
    lunch: {
      name: 'Grilled Chicken Salad',
      calories: 450,
      protein: 35,
      carbs: 25,
      fat: 22,
      ingredients: [
        { name: 'Chicken Breast', amount: '4 oz' },
        { name: 'Mixed Greens', amount: '2 cups' },
        { name: 'Cherry Tomatoes', amount: '1/2 cup' },
        { name: 'Cucumber', amount: '1/2 cup' },
        { name: 'Avocado', amount: '1/4' },
        { name: 'Olive Oil', amount: '1 tbsp' },
        { name: 'Balsamic Vinegar', amount: '1 tbsp' }
      ],
      instructions: 'Grill chicken and slice. Toss with greens and vegetables. Dress with olive oil and vinegar.',
      completed: true
    },
    dinner: {
      name: 'Baked Salmon with Quinoa',
      calories: 520,
      protein: 40,
      carbs: 35,
      fat: 25,
      ingredients: [
        { name: 'Salmon Fillet', amount: '5 oz' },
        { name: 'Quinoa', amount: '1/2 cup' },
        { name: 'Broccoli', amount: '1 cup' },
        { name: 'Lemon', amount: '1/2' },
        { name: 'Olive Oil', amount: '1 tbsp' },
        { name: 'Garlic', amount: '2 cloves' },
        { name: 'Dill', amount: '1 tsp' }
      ],
      instructions: 'Season salmon with garlic, dill, and lemon. Bake at 400°F for 15 minutes. Serve with cooked quinoa and steamed broccoli.',
      completed: false
    },
    snack: {
      name: 'Apple with Almond Butter',
      calories: 200,
      protein: 5,
      carbs: 25,
      fat: 10,
      ingredients: [
        { name: 'Apple', amount: '1 medium' },
        { name: 'Almond Butter', amount: '1 tbsp' }
      ],
      instructions: 'Slice apple and serve with almond butter for dipping.',
      completed: false
    }
  });

  // State for filters
  const [filters, setFilters] = useState({
    goal: 'all',
    diet_type: 'all'
  });

  // State for active tab
  const [activeTab, setActiveTab] = useState('plans');

  // State for selected meal
  const [selectedMeal, setSelectedMeal] = useState(null);

  // Filter diet plans based on selected filters
  const filteredDietPlans = dietPlans.filter(plan => {
    return (filters.goal === 'all' || plan.goal === filters.goal) &&
           (filters.diet_type === 'all' || plan.diet_type === filters.diet_type);
  });

  // Toggle meal completion
  const toggleMealCompletion = (mealType) => {
    setTodayMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        completed: !prev[mealType].completed
      }
    }));
  };

  // Calculate total calories and macros for the day
  const dailyTotals = Object.values(todayMeals).reduce(
    (totals, meal) => {
      return {
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Calculate completion percentage
  const completionPercentage = Math.round(
    (Object.values(todayMeals).filter(meal => meal.completed).length / Object.values(todayMeals).length) * 100
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-16">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Diet Plans</h1>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeTab === 'plans' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setActiveTab('plans')}
            >
              Plans
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeTab === 'today' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setActiveTab('today')}
            >
              Today
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'plans' ? (
          <>
            {/* Filters */}
            <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Find Your Diet Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Goal</label>
                  <select 
                    className="form-input"
                    value={filters.goal}
                    onChange={(e) => setFilters({...filters, goal: e.target.value})}
                  >
                    <option value="all">All Goals</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Diet Type</label>
                  <select 
                    className="form-input"
                    value={filters.diet_type}
                    onChange={(e) => setFilters({...filters, diet_type: e.target.value})}
                  >
                    <option value="all">All Types</option>
                    <option value="Standard Balanced">Standard Balanced</option>
                    <option value="Keto">Keto</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Paleo">Paleo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Diet Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDietPlans.map((plan) => (
                <div key={plan.id} className="card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-4xl">{plan.image}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        plan.goal === 'weight_loss' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        plan.goal === 'muscle_gain' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {plan.goal.replace('_', ' ').charAt(0).toUpperCase() + plan.goal.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Diet Type</p>
                        <p className="font-medium">{plan.diet_type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Calories</p>
                        <p className="font-medium">{plan.calorie_range} cal/day</p>
                      </div>
                    </div>
                    
                    {/* Macronutrient breakdown */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Macronutrient Ratio</p>
                      <div className="flex h-4 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-500" 
                          style={{ width: `${plan.macros.carbs}%` }}
                          title={`Carbs: ${plan.macros.carbs}%`}
                        ></div>
                        <div 
                          className="bg-red-500" 
                          style={{ width: `${plan.macros.protein}%` }}
                          title={`Protein: ${plan.macros.protein}%`}
                        ></div>
                        <div 
                          className="bg-yellow-500" 
                          style={{ width: `${plan.macros.fat}%` }}
                          title={`Fat: ${plan.macros.fat}%`}
                        ></div>
                      </div>
                      <div className="flex text-xs mt-1 justify-between">
                        <span>Carbs: {plan.macros.carbs}%</span>
                        <span>Protein: {plan.macros.protein}%</span>
                        <span>Fat: {plan.macros.fat}%</span>
                      </div>
                    </div>
                    
                    <button className="w-full btn-primary">
                      View Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Today's Meal Plan */}
            <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Meal Plan</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{dailyTotals.calories} calories</p>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Macronutrient summary */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Carbs</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{dailyTotals.carbs}g</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {Math.round((dailyTotals.carbs * 4 / dailyTotals.calories) * 100)}%
                  </p>
                </div>
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Protein</p>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">{dailyTotals.protein}g</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {Math.round((dailyTotals.protein * 4 / dailyTotals.calories) * 100)}%
                  </p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Fat</p>
                  <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{dailyTotals.fat}g</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {Math.round((dailyTotals.fat * 9 / dailyTotals.calories) * 100)}%
                  </p>
                </div>
              </div>
              
              {/* Meal list */}
              <div className="space-y-4">
                {Object.entries(todayMeals).map(([mealType, meal]) => (
                  <div 
                    key={mealType} 
                    className={`p-3 rounded-lg ${
                      meal.completed 
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900' 
                        : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={meal.completed}
                          onChange={() => toggleMealCompletion(mealType)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <p className={`font-medium ${meal.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}: {meal.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {meal.calories} cal • {meal.protein}g protein • {meal.carbs}g carbs • {meal.fat}g fat
                          </p>
                        </div>
                      </div>
                      <button 
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        onClick={() => setSelectedMeal(mealType)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Meal details (shown when selected) */}
                    {selectedMeal === mealType && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ingredients:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 mb-2 list-disc pl-5">
                          {meal.ingredients.map((ingredient, index) => (
                            <li key={index}>
                              {ingredient.name} - {ingredient.amount}
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Instructions:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{meal.instructions}</p>
                        <div className="mt-3 flex justify-end">
                          <button 
                            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            onClick={() => setSelectedMeal(null)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Action buttons */}
              <div className="mt-6 flex justify-between">
                <button className="btn-outline">
                  Generate Shopping List
                </button>
                <button className="btn-primary">
                  Log All Meals
                </button>
              </div>
            </div>
          </>
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
