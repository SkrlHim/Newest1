'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  // Mock data for dashboard
  const [userData, setUserData] = useState({
    name: 'John Doe',
    dailyCalorieGoal: 2200,
    caloriesConsumed: 1450,
    caloriesRemaining: 750,
    currentWeight: 185,
    goalWeight: 170,
    weightLost: 5,
    streakDays: 7
  });

  const [todayWorkout, setTodayWorkout] = useState({
    name: 'Upper Body Strength',
    exercises: [
      { name: 'Push-ups', sets: 3, reps: 12 },
      { name: 'Dumbbell Rows', sets: 3, reps: 10 },
      { name: 'Shoulder Press', sets: 3, reps: 8 }
    ],
    duration: 45
  });

  const [todayMeals, setTodayMeals] = useState([
    { name: 'Breakfast', calories: 450, completed: true },
    { name: 'Lunch', calories: 650, completed: true },
    { name: 'Dinner', calories: 700, completed: false },
    { name: 'Snack', calories: 200, completed: false }
  ]);

  const [recentAchievements, setRecentAchievements] = useState([
    { name: 'Week Streak', description: 'Logged in for 7 consecutive days', icon: '🔥' },
    { name: 'Workout Warrior', description: 'Completed 5 workouts in a week', icon: '💪' }
  ]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300 mr-4">Hello, {userData.name}</span>
            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
              {userData.name.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Calorie Summary */}
        <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Calories</h2>
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1 mb-4 md:mb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Goal</span>
                <span className="text-sm font-medium">{userData.dailyCalorieGoal} cal</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Consumed</span>
                <span className="text-sm font-medium">{userData.caloriesConsumed} cal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Remaining</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">{userData.caloriesRemaining} cal</span>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset={283 * (1 - userData.caloriesConsumed / userData.dailyCalorieGoal)}
                    transform="rotate(-90 50 50)"
                  />
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="16"
                    fontWeight="bold"
                    fill="currentColor"
                  >
                    {Math.round((userData.caloriesConsumed / userData.dailyCalorieGoal) * 100)}%
                  </text>
                </svg>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Link href="/food/log" className="btn-primary">
              Log Food
            </Link>
          </div>
        </div>

        {/* Weight Progress */}
        <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weight Progress</h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current</p>
              <p className="text-xl font-bold">{userData.currentWeight} lbs</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Lost</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">-{userData.weightLost} lbs</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Goal</p>
              <p className="text-xl font-bold">{userData.goalWeight} lbs</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${(userData.weightLost / (userData.currentWeight - userData.goalWeight + userData.weightLost)) * 100}%` }}
            ></div>
          </div>
          <div className="mt-4 flex justify-center">
            <Link href="/progress/weight" className="btn-outline">
              Update Weight
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Workout */}
          <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Workout</h2>
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">{todayWorkout.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{todayWorkout.duration} minutes</p>
            </div>
            <ul className="space-y-2 mb-4">
              {todayWorkout.exercises.map((exercise, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-sm">{exercise.name}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{exercise.sets} sets × {exercise.reps} reps</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-center">
              <Link href="/workouts/today" className="btn-secondary">
                Start Workout
              </Link>
            </div>
          </div>

          {/* Today's Meals */}
          <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Meals</h2>
            <ul className="space-y-3 mb-4">
              {todayMeals.map((meal, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-2 ${meal.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className="text-sm">{meal.name}</span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{meal.calories} cal</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-center">
              <Link href="/diet/today" className="btn-secondary">
                View Meal Plan
              </Link>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Achievements</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h3 className="font-medium text-sm mb-1">{achievement.name}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around">
            <Link href="/dashboard" className="nav-link-active flex flex-col items-center py-2">
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
