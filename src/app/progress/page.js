'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Progress() {
  // Mock data for weight history
  const [weightHistory, setWeightHistory] = useState([
    { date: '2025-03-01', weight: 190 },
    { date: '2025-03-08', weight: 188 },
    { date: '2025-03-15', weight: 185 },
    { date: '2025-03-21', weight: 183 },
  ]);

  // Mock data for calorie history
  const [calorieHistory, setCalorieHistory] = useState([
    { date: '2025-03-15', consumed: 2100, goal: 2200 },
    { date: '2025-03-16', consumed: 1950, goal: 2200 },
    { date: '2025-03-17', consumed: 2250, goal: 2200 },
    { date: '2025-03-18', consumed: 2050, goal: 2200 },
    { date: '2025-03-19', consumed: 1850, goal: 2200 },
    { date: '2025-03-20', consumed: 2150, goal: 2200 },
    { date: '2025-03-21', consumed: 1450, goal: 2200 },
  ]);

  // Mock data for workout history
  const [workoutHistory, setWorkoutHistory] = useState([
    { date: '2025-03-15', type: 'Upper Body', duration: 45, calories: 350 },
    { date: '2025-03-17', type: 'Lower Body', duration: 50, calories: 400 },
    { date: '2025-03-19', type: 'Cardio', duration: 30, calories: 320 },
    { date: '2025-03-21', type: 'Upper Body', duration: 45, calories: 350 },
  ]);

  // Mock data for body measurements
  const [bodyMeasurements, setBodyMeasurements] = useState({
    chest: [{ date: '2025-03-01', value: 42 }, { date: '2025-03-21', value: 41 }],
    waist: [{ date: '2025-03-01', value: 36 }, { date: '2025-03-21', value: 34.5 }],
    hips: [{ date: '2025-03-01', value: 40 }, { date: '2025-03-21', value: 39 }],
    arms: [{ date: '2025-03-01', value: 14 }, { date: '2025-03-21', value: 14.5 }],
    thighs: [{ date: '2025-03-01', value: 24 }, { date: '2025-03-21', value: 23 }],
  });

  // Mock data for achievements
  const [achievements, setAchievements] = useState([
    { id: 1, name: 'First Workout', description: 'Completed your first workout', date: '2025-03-15', icon: '🏋️‍♂️' },
    { id: 2, name: 'Week Streak', description: 'Logged in for 7 consecutive days', date: '2025-03-21', icon: '🔥' },
    { id: 3, name: 'Weight Loss Milestone', description: 'Lost your first 5 pounds', date: '2025-03-21', icon: '⚖️' },
    { id: 4, name: 'Nutrition Master', description: 'Stayed within calorie goals for 5 days', date: '2025-03-20', icon: '🥗' },
  ]);

  // State for active tab
  const [activeTab, setActiveTab] = useState('weight');

  // Calculate weight change
  const weightChange = weightHistory.length >= 2 
    ? weightHistory[weightHistory.length - 1].weight - weightHistory[0].weight 
    : 0;

  // Calculate average calories
  const avgCalories = calorieHistory.reduce((sum, day) => sum + day.consumed, 0) / calorieHistory.length;

  // Calculate workout stats
  const totalWorkouts = workoutHistory.length;
  const totalWorkoutMinutes = workoutHistory.reduce((sum, workout) => sum + workout.duration, 0);
  const totalCaloriesBurned = workoutHistory.reduce((sum, workout) => sum + workout.calories, 0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-16">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Progress Tracking</h1>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {['weight', 'calories', 'workouts', 'measurements', 'achievements'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab 
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Weight Progress */}
        {activeTab === 'weight' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Current Weight</h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {weightHistory[weightHistory.length - 1].weight} lbs
                </p>
              </div>
              <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Weight Change</h3>
                <p className={`text-3xl font-bold ${weightChange <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {weightChange <= 0 ? '' : '+'}
                  {weightChange} lbs
                </p>
              </div>
              <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Goal Weight</h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  170 lbs
                </p>
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weight History</h3>
              <div className="h-64 relative">
                {/* This would be a chart in a real implementation */}
                <div className="absolute inset-0 flex items-end">
                  {weightHistory.map((entry, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="bg-indigo-500 w-4/5" 
                        style={{ 
                          height: `${((entry.weight - 170) / (190 - 170)) * 100}%`,
                          minHeight: '10%'
                        }}
                      ></div>
                      <p className="text-xs mt-1">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <button className="btn-primary">
                  Add Weight Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Calorie Progress */}
        {activeTab === 'calories' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Today's Calories</h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {calorieHistory[calorieHistory.length - 1].consumed} / {calorieHistory[calorieHistory.length - 1].goal}
                </p>
              </div>
              <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Average Daily</h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {Math.round(avgCalories)} cal
                </p>
              </div>
              <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Weekly Deficit</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {Math.round((calorieHistory.reduce((sum, day) => sum + (day.goal - day.consumed), 0) / 3500) * 100) / 100} lbs
                </p>
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Calorie History</h3>
              <div className="h-64 relative">
                {/* This would be a chart in a real implementation */}
                <div className="absolute inset-0 flex items-end">
                  {calorieHistory.map((entry, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="relative w-4/5 flex flex-col items-center">
                        <div 
                          className={`w-full ${entry.consumed <= entry.goal ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ 
                            height: `${(entry.consumed / 3000) * 100}%`,
                            minHeight: '10%'
                          }}
                        ></div>
                        <div 
                          className="absolute border-t-2 border-dashed border-gray-400 w-full"
                          style={{ 
                            bottom: `${(entry.goal / 3000) * 100}%`
                          }}
                        ></div>
                      </div>
                      <p className="text-xs mt-1">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workout Progress */}
        {activeTab === 'workouts' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Workouts</h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {totalWorkouts}
                </p>
              </div>
              <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Time</h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {totalWorkoutMinutes} min
                </p>
              </div>
              <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Calories Burned</h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {totalCaloriesBurned}
                </p>
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workout History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Workout Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Duration
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Calories Burned
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {workoutHistory.map((workout, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {new Date(workout.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {workout.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {workout.duration} min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {workout.calories} cal
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Body Measurements */}
        {activeTab === 'measurements' && (
          <div>
            <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Body Measurements</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Measurement
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Starting
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Current
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {Object.entries(bodyMeasurements).map(([key, values]) => {
                      const start = values[0].value;
                      const current = values[values.length - 1].value;
                      const change = current - start;
                      return (
                        <tr key={key}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                            {key}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {start} in
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {current} in
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`${
                              (key === 'arms' ? change >= 0 : change <= 0) 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {change > 0 ? '+' : ''}{change} in
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-center">
                <button className="btn-primary">
                  Update Measurements
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Achievements */}
        {activeTab === 'achievements' && (
          <div>
            <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Achievements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">{achievement.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{achievement.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
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
            <Link href="/progress" className="nav-link-active flex flex-col items-center py-2">
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
