'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WorkoutPlans() {
  // Mock data for workout plans
  const [workoutPlans, setWorkoutPlans] = useState([
    {
      id: 1,
      name: 'Weight Loss Beginner',
      description: 'A beginner-friendly workout plan focused on burning calories and building basic strength.',
      goal: 'weight_loss',
      difficulty: 'beginner',
      duration_weeks: 8,
      days_per_week: 3,
      calories_burned: '300-400',
      image: '🏃‍♂️'
    },
    {
      id: 2,
      name: 'Muscle Building Intermediate',
      description: 'Build muscle mass with this intermediate strength training program.',
      goal: 'muscle_gain',
      difficulty: 'intermediate',
      duration_weeks: 12,
      days_per_week: 5,
      calories_burned: '400-500',
      image: '💪'
    },
    {
      id: 3,
      name: 'Full Body Toning',
      description: 'A balanced workout plan to tone muscles and improve overall fitness.',
      goal: 'toning',
      difficulty: 'intermediate',
      duration_weeks: 10,
      days_per_week: 4,
      calories_burned: '350-450',
      image: '⚖️'
    },
    {
      id: 4,
      name: 'HIIT Cardio Blast',
      description: 'High-intensity interval training for maximum calorie burn and cardiovascular health.',
      goal: 'weight_loss',
      difficulty: 'advanced',
      duration_weeks: 6,
      days_per_week: 4,
      calories_burned: '500-600',
      image: '🔥'
    },
    {
      id: 5,
      name: 'Strength & Power Advanced',
      description: 'Advanced strength training program focused on building power and muscle mass.',
      goal: 'muscle_gain',
      difficulty: 'advanced',
      duration_weeks: 16,
      days_per_week: 6,
      calories_burned: '450-550',
      image: '🏋️‍♂️'
    }
  ]);

  // Mock data for today's workout
  const [todayWorkout, setTodayWorkout] = useState({
    name: 'Upper Body Strength',
    day: 'Day 2',
    exercises: [
      { 
        id: 1, 
        name: 'Push-ups', 
        sets: 3, 
        reps: 12, 
        rest: 60,
        instructions: 'Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.',
        muscle_group: 'Chest, Shoulders, Triceps',
        completed: false
      },
      { 
        id: 2, 
        name: 'Dumbbell Rows', 
        sets: 3, 
        reps: 10, 
        rest: 90,
        instructions: 'With a dumbbell in one hand, place opposite knee and hand on bench. Pull dumbbell up to your side, keeping elbow close to body.',
        muscle_group: 'Back, Biceps',
        completed: false
      },
      { 
        id: 3, 
        name: 'Shoulder Press', 
        sets: 3, 
        reps: 8, 
        rest: 90,
        instructions: 'Sit with back supported, hold dumbbells at shoulder height. Press weights overhead until arms are extended.',
        muscle_group: 'Shoulders, Triceps',
        completed: false
      },
      { 
        id: 4, 
        name: 'Tricep Dips', 
        sets: 3, 
        reps: 15, 
        rest: 60,
        instructions: 'Sit on edge of bench/chair, hands gripping edge. Slide off edge, lower body by bending elbows, then push back up.',
        muscle_group: 'Triceps',
        completed: false
      },
      { 
        id: 5, 
        name: 'Bicep Curls', 
        sets: 3, 
        reps: 12, 
        rest: 60,
        instructions: 'Stand with dumbbells at sides, palms forward. Curl weights toward shoulders, keeping elbows close to body.',
        muscle_group: 'Biceps',
        completed: false
      }
    ],
    duration: 45,
    calories: 350
  });

  // State for filters
  const [filters, setFilters] = useState({
    goal: 'all',
    difficulty: 'all'
  });

  // State for active tab
  const [activeTab, setActiveTab] = useState('plans');

  // State for selected exercise
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Filter workout plans based on selected filters
  const filteredWorkoutPlans = workoutPlans.filter(plan => {
    return (filters.goal === 'all' || plan.goal === filters.goal) &&
           (filters.difficulty === 'all' || plan.difficulty === filters.difficulty);
  });

  // Toggle exercise completion
  const toggleExerciseCompletion = (exerciseId) => {
    setTodayWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId ? {...ex, completed: !ex.completed} : ex
      )
    }));
  };

  // Calculate workout completion percentage
  const completionPercentage = Math.round(
    (todayWorkout.exercises.filter(ex => ex.completed).length / todayWorkout.exercises.length) * 100
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-16">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workouts</h1>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeTab === 'plans' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setActiveTab('plans')}
            >
              Plans
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeTab === 'today' 
                  ? 'bg-indigo-600 text-white' 
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Find Your Workout Plan</h2>
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
                    <option value="toning">Toning</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Difficulty</label>
                  <select 
                    className="form-input"
                    value={filters.difficulty}
                    onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Workout Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkoutPlans.map((plan) => (
                <div key={plan.id} className="card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-4xl">{plan.image}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        plan.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        plan.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Duration</p>
                        <p className="font-medium">{plan.duration_weeks} weeks</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Frequency</p>
                        <p className="font-medium">{plan.days_per_week} days/week</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Goal</p>
                        <p className="font-medium capitalize">{plan.goal.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Calories</p>
                        <p className="font-medium">{plan.calories_burned}/workout</p>
                      </div>
                    </div>
                    <button className="w-full btn-secondary">
                      View Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Today's Workout */}
            <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{todayWorkout.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{todayWorkout.day}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{todayWorkout.duration} min</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{todayWorkout.calories} calories</p>
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
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Exercise list */}
              <ul className="space-y-3">
                {todayWorkout.exercises.map((exercise) => (
                  <li 
                    key={exercise.id} 
                    className={`p-3 rounded-lg ${
                      exercise.completed 
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900' 
                        : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exercise.completed}
                          onChange={() => toggleExerciseCompletion(exercise.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <p className={`font-medium ${exercise.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {exercise.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {exercise.sets} sets × {exercise.reps} reps • {exercise.rest}s rest
                          </p>
                        </div>
                      </div>
                      <button 
                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Exercise details (shown when selected) */}
                    {selectedExercise && selectedExercise.id === exercise.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Muscle Groups:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{exercise.muscle_group}</p>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Instructions:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{exercise.instructions}</p>
                        <div className="mt-3 flex justify-end">
                          <button 
                            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            onClick={() => setSelectedExercise(null)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              
              {/* Action buttons */}
              <div className="mt-6 flex justify-between">
                <button className="btn-outline">
                  Skip Workout
                </button>
                <button className="btn-secondary">
                  Complete Workout
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
            <Link href="/workouts" className="nav-link-active flex flex-col items-center py-2">
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
