'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWorkoutPlans, useRecommendedWorkouts, useTodaysWorkout } from '@/hooks/useWorkoutRecommendation';

export default function WorkoutsWithHooks() {
  // Mock user ID and profile - in a real app, this would come from authentication and user settings
  const userId = 'user-1';
  const userProfile = {
    goal_type: 'weight_loss',
    activity_level: 'moderately_active',
    gender: 'male',
    age: 35,
    weight: 85, // kg
    height: 178 // cm
  };
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('today');
  
  // Use custom hooks
  const { 
    todaysWorkout, 
    exerciseStatus, 
    completionPercentage,
    toggleExerciseCompletion,
    updateExerciseDetails,
    logCompletedWorkout,
    isLoading: isTodayLoading 
  } = useTodaysWorkout(userId);
  
  const { 
    recommendedPlans, 
    isLoading: isRecommendationsLoading 
  } = useRecommendedWorkouts(userProfile);
  
  const { 
    filteredPlans, 
    filters, 
    updateFilters, 
    isLoading: isPlansLoading 
  } = useWorkoutPlans();
  
  // State for workout completion modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState('');
  
  // Handle workout completion
  const handleCompleteWorkout = async () => {
    try {
      await logCompletedWorkout(workoutNotes);
      setShowCompletionModal(false);
      setWorkoutNotes('');
      // In a real app, you would show a success message and update the UI
    } catch (error) {
      console.error('Error completing workout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-16">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workouts</h1>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {['today', 'recommended', 'browse'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab 
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'today' ? "Today's Workout" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Today's Workout */}
        {activeTab === 'today' && (
          <div>
            {isTodayLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Loading today's workout...</p>
              </div>
            ) : todaysWorkout ? (
              <div>
                <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{todaysWorkout.name}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{todaysWorkout.day} - {todaysWorkout.focus_area}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{todaysWorkout.duration} min • {todaysWorkout.calories} cal</p>
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
                  
                  <div className="space-y-4">
                    {todaysWorkout.exercises.map((exercise) => (
                      <div 
                        key={exercise.id} 
                        className={`p-3 rounded-lg border ${
                          exerciseStatus[exercise.id]?.completed 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900' 
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">{exercise.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {exercise.sets && exercise.reps 
                                ? `${exercise.sets} sets × ${exercise.reps} reps` 
                                : exercise.duration_minutes 
                                  ? `${exercise.duration_minutes} minutes` 
                                  : 'Complete exercise'}
                              {exercise.rest_seconds ? ` • ${exercise.rest_seconds}s rest` : ''}
                            </p>
                            {exercise.notes && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{exercise.notes}</p>
                            )}
                          </div>
                          <button 
                            className={`p-2 rounded-full ${
                              exerciseStatus[exercise.id]?.completed 
                                ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                            onClick={() => toggleExerciseCompletion(exercise.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        
                        {exerciseStatus[exercise.id]?.completed && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-xs text-gray-500 dark:text-gray-500">Sets</label>
                                <input
                                  type="number"
                                  className="form-input w-full mt-1 text-sm"
                                  value={exerciseStatus[exercise.id]?.sets_completed || exercise.sets || 0}
                                  onChange={(e) => updateExerciseDetails(exercise.id, { sets_completed: parseInt(e.target.value) })}
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 dark:text-gray-500">Reps</label>
                                <input
                                  type="number"
                                  className="form-input w-full mt-1 text-sm"
                                  value={exerciseStatus[exercise.id]?.reps_completed || exercise.reps || 0}
                                  onChange={(e) => updateExerciseDetails(exercise.id, { reps_completed: parseInt(e.target.value) })}
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 dark:text-gray-500">Weight (kg)</label>
                                <input
                                  type="number"
                                  className="form-input w-full mt-1 text-sm"
                                  value={exerciseStatus[exercise.id]?.weight_used || 0}
                                  onChange={(e) => updateExerciseDetails(exercise.id, { weight_used: parseInt(e.target.value) })}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <button 
                      className="btn-primary"
                      onClick={() => setShowCompletionModal(true)}
                      disabled={completionPercentage === 0}
                    >
                      Complete Workout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Workout Scheduled</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">You don't have a workout scheduled for today. Browse our recommended workouts to get started.</p>
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

        {/* Recommended Workouts */}
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
                          <span>{plan.duration_weeks} weeks</span>
                          <span>{plan.days_per_week} days/week</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                            {plan.goal_type.replace('_', ' ')}
                          </span>
                          <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full">
                            {plan.difficulty_level}
                          </span>
                        </div>
                        <Link href={`/workouts/plan/${plan.id}`} className="btn-outline w-full text-center">
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

        {/* Browse Workouts */}
        {activeTab === 'browse' && (
          <div>
            <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Browse Workout Plans</h2>
              
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
                    <option value="toning">Toning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                  <select
                    className="form-select"
                    value={filters.difficulty}
                    onChange={(e) => updateFilters({ ...filters, difficulty: e.target.value })}
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              
              {isPlansLoading ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">Loading workout plans...</p>
                </div>
              ) : filteredPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPlans.map((plan) => (
                    <div key={plan.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">{plan.name}</h3>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>{plan.duration_weeks} weeks</span>
                          <span>{plan.days_per_week} days/week</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                            {plan.goal_type.replace('_', ' ')}
                          </span>
                          <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full">
                            {plan.difficulty_level}
                          </span>
                        </div>
                        <Link href={`/workouts/plan/${plan.id}`} className="btn-outline w-full text-center">
                          View Plan
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">No workout plans match your filters.</p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Workout Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Complete Workout</h3>
            
            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workout Notes (optional)</label>
              <textarea
                id="notes"
                className="form-textarea w-full"
                rows={3}
                placeholder="How did you feel? Any achievements or challenges?"
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
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
                onClick={handleCompleteWorkout}
              >
                Complete Workout
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
