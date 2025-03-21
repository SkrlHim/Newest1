'use client';

import { useState, useEffect } from 'react';
import WorkoutService from '@/services/WorkoutService';

// Custom hook for workout plans
export function useWorkoutPlans() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [filters, setFilters] = useState({
    goal: 'all',
    difficulty: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch all workout plans
  const fetchWorkoutPlans = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const plans = await WorkoutService.getWorkoutPlans();
      setWorkoutPlans(plans);
      
      // Apply current filters
      filterPlans(plans, filters);
    } catch (err) {
      console.error('Error fetching workout plans:', err);
      setError('Failed to load workout plans. Please try again.');
      setWorkoutPlans([]);
      setFilteredPlans([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter plans based on selected filters
  const filterPlans = (plans, filterOptions) => {
    const filtered = plans.filter(plan => {
      return (filterOptions.goal === 'all' || plan.goal_type === filterOptions.goal) &&
             (filterOptions.difficulty === 'all' || plan.difficulty_level === filterOptions.difficulty);
    });
    
    setFilteredPlans(filtered);
  };
  
  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    filterPlans(workoutPlans, newFilters);
  };
  
  // Load workout plans on initial render
  useEffect(() => {
    fetchWorkoutPlans();
  }, []);
  
  return {
    workoutPlans,
    filteredPlans,
    filters,
    updateFilters,
    isLoading,
    error,
    refreshPlans: fetchWorkoutPlans
  };
}

// Custom hook for workout plan details
export function useWorkoutPlanDetails(planId) {
  const [planDetails, setPlanDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch workout plan details
  const fetchPlanDetails = async () => {
    if (!planId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const details = await WorkoutService.getWorkoutPlanDetails(planId);
      setPlanDetails(details);
    } catch (err) {
      console.error('Error fetching workout plan details:', err);
      setError('Failed to load workout plan details. Please try again.');
      setPlanDetails(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load plan details when planId changes
  useEffect(() => {
    fetchPlanDetails();
  }, [planId]);
  
  return {
    planDetails,
    isLoading,
    error,
    refreshDetails: fetchPlanDetails
  };
}

// Custom hook for recommended workout plans
export function useRecommendedWorkouts(userProfile) {
  const [recommendedPlans, setRecommendedPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch recommended workout plans
  const fetchRecommendedPlans = async () => {
    if (!userProfile) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const plans = await WorkoutService.getRecommendedWorkoutPlans(userProfile);
      setRecommendedPlans(plans);
    } catch (err) {
      console.error('Error fetching recommended workout plans:', err);
      setError('Failed to load workout recommendations. Please try again.');
      setRecommendedPlans([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load recommended plans when userProfile changes
  useEffect(() => {
    fetchRecommendedPlans();
  }, [userProfile]);
  
  return {
    recommendedPlans,
    isLoading,
    error,
    refreshRecommendations: fetchRecommendedPlans
  };
}

// Custom hook for today's workout
export function useTodaysWorkout(userId) {
  const [todaysWorkout, setTodaysWorkout] = useState(null);
  const [exerciseStatus, setExerciseStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch today's workout
  const fetchTodaysWorkout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const workout = await WorkoutService.getTodaysWorkout(userId);
      setTodaysWorkout(workout);
      
      // Initialize exercise status
      if (workout && workout.exercises) {
        const status = {};
        workout.exercises.forEach(exercise => {
          status[exercise.id] = {
            completed: false,
            sets_completed: 0,
            reps_completed: 0,
            weight_used: 0
          };
        });
        setExerciseStatus(status);
      }
    } catch (err) {
      console.error('Error fetching today\'s workout:', err);
      setError('Failed to load today\'s workout. Please try again.');
      setTodaysWorkout(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load today's workout on initial render
  useEffect(() => {
    fetchTodaysWorkout();
  }, [userId]);
  
  // Toggle exercise completion
  const toggleExerciseCompletion = (exerciseId) => {
    setExerciseStatus(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        completed: !prev[exerciseId].completed
      }
    }));
  };
  
  // Update exercise details
  const updateExerciseDetails = (exerciseId, details) => {
    setExerciseStatus(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        ...details
      }
    }));
  };
  
  // Calculate completion percentage
  const calculateCompletionPercentage = () => {
    if (!todaysWorkout || !todaysWorkout.exercises || todaysWorkout.exercises.length === 0) {
      return 0;
    }
    
    const completedCount = Object.values(exerciseStatus).filter(status => status.completed).length;
    return Math.round((completedCount / todaysWorkout.exercises.length) * 100);
  };
  
  // Log completed workout
  const logCompletedWorkout = async (notes = '') => {
    if (!todaysWorkout) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare exercise data
      const completedExercises = todaysWorkout.exercises.map(exercise => ({
        id: exercise.id,
        sets_completed: exerciseStatus[exercise.id]?.sets_completed || exercise.sets,
        reps_completed: exerciseStatus[exercise.id]?.reps_completed || exercise.reps,
        weight_used: exerciseStatus[exercise.id]?.weight_used || 0,
        duration_minutes: exercise.duration_minutes || 0,
        notes: ''
      }));
      
      // Log the workout
      const workoutLog = await WorkoutService.logWorkout(userId, {
        date: new Date().toISOString().split('T')[0],
        workout_plan_id: todaysWorkout.plan_id,
        workout_day_id: todaysWorkout.day_id,
        duration_minutes: todaysWorkout.duration,
        calories_burned: todaysWorkout.calories,
        notes,
        exercises: completedExercises
      });
      
      return workoutLog;
    } catch (err) {
      console.error('Error logging completed workout:', err);
      setError('Failed to log workout. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    todaysWorkout,
    exerciseStatus,
    completionPercentage: calculateCompletionPercentage(),
    isLoading,
    error,
    toggleExerciseCompletion,
    updateExerciseDetails,
    logCompletedWorkout,
    refreshWorkout: fetchTodaysWorkout
  };
}

// Custom hook for workout history
export function useWorkoutHistory(userId) {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch workout history
  const fetchWorkoutHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const history = await WorkoutService.getWorkoutHistory(userId);
      setWorkoutHistory(history);
    } catch (err) {
      console.error('Error fetching workout history:', err);
      setError('Failed to load workout history. Please try again.');
      setWorkoutHistory([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load workout history on initial render
  useEffect(() => {
    fetchWorkoutHistory();
  }, [userId]);
  
  // Calculate statistics
  const calculateStats = () => {
    if (workoutHistory.length === 0) {
      return {
        totalWorkouts: 0,
        totalMinutes: 0,
        totalCalories: 0,
        averageDuration: 0
      };
    }
    
    const totalWorkouts = workoutHistory.length;
    const totalMinutes = workoutHistory.reduce((sum, workout) => sum + (workout.duration_minutes || 0), 0);
    const totalCalories = workoutHistory.reduce((sum, workout) => sum + (workout.calories_burned || 0), 0);
    const averageDuration = Math.round(totalMinutes / totalWorkouts);
    
    return {
      totalWorkouts,
      totalMinutes,
      totalCalories,
      averageDuration
    };
  };
  
  const stats = calculateStats();
  
  return {
    workoutHistory,
    stats,
    isLoading,
    error,
    refreshHistory: fetchWorkoutHistory
  };
}

// Custom hook for exercise categories and exercises
export function useExercises() {
  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch exercise categories
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const cats = await WorkoutService.getExerciseCategories();
      setCategories(cats);
      
      // Select first category by default
      if (cats.length > 0 && !selectedCategory) {
        setSelectedCategory(cats[0].id);
      }
    } catch (err) {
      console.error('Error fetching exercise categories:', err);
      setError('Failed to load exercise categories. Please try again.');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch exercises for a category
  const fetchExercisesByCategory = async (categoryId) => {
    if (!categoryId) return;
    
    setIsLoading(true);
    
    try {
      // Check if we already have exercises for this category
      if (!exercises[categoryId]) {
        const exs = await WorkoutService.getExercisesByCategory(categoryId);
        setExercises(prev => ({
          ...prev,
          [categoryId]: exs
        }));
      }
    } catch (err) {
      console.error(`Error fetching exercises for category ${categoryId}:`, err);
      setError('Failed to load exercises. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load categories on initial render
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Load exercises when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchExercisesByCategory(selectedCategory);
    }
  }, [selectedCategory]);
  
  return {
    categories,
    exercises,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    error,
    refreshCategories: fetchCategories,
    refreshExercises: fetchExercisesByCategory
  };
}

// Custom hook for assigning workout plans
export function useWorkoutPlanAssignment(userId) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Assign workout plan to user
  const assignWorkoutPlan = async (planId, startDate = new Date().toISOString().split('T')[0]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await WorkoutService.assignWorkoutPlan(userId, planId, startDate);
      return result;
    } catch (err) {
      console.error('Error assigning workout plan:', err);
      setError('Failed to assign workout plan. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    assignWorkoutPlan,
    isLoading,
    error
  };
}
