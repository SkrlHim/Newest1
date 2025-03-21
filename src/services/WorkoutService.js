'use client';

import { useState, useEffect } from 'react';

// This service handles workout recommendations and exercise database
export const WorkoutService = {
  // Get all exercise categories
  getExerciseCategories: async () => {
    try {
      // In a real implementation, this would call an API
      console.log('Getting exercise categories');
      
      // Mock implementation
      return mockExerciseCategories;
    } catch (error) {
      console.error('Error getting exercise categories:', error);
      throw error;
    }
  },
  
  // Get exercises by category
  getExercisesByCategory: async (categoryId) => {
    try {
      // In a real implementation, this would call an API
      console.log(`Getting exercises for category: ${categoryId}`);
      
      // Mock implementation
      return mockExercises.filter(exercise => exercise.category_id === categoryId);
    } catch (error) {
      console.error('Error getting exercises by category:', error);
      throw error;
    }
  },
  
  // Get exercise details
  getExerciseDetails: async (exerciseId) => {
    try {
      // In a real implementation, this would call an API
      console.log(`Getting details for exercise: ${exerciseId}`);
      
      // Mock implementation
      return mockExercises.find(exercise => exercise.id === exerciseId);
    } catch (error) {
      console.error('Error getting exercise details:', error);
      throw error;
    }
  },
  
  // Get all workout plans
  getWorkoutPlans: async () => {
    try {
      // In a real implementation, this would call an API
      console.log('Getting workout plans');
      
      // Mock implementation
      return mockWorkoutPlans;
    } catch (error) {
      console.error('Error getting workout plans:', error);
      throw error;
    }
  },
  
  // Get workout plans filtered by goal and difficulty
  getFilteredWorkoutPlans: async (filters) => {
    try {
      // In a real implementation, this would call an API
      console.log('Getting filtered workout plans', filters);
      
      // Mock implementation
      return mockWorkoutPlans.filter(plan => {
        return (filters.goal === 'all' || plan.goal_type === filters.goal) &&
               (filters.difficulty === 'all' || plan.difficulty_level === filters.difficulty);
      });
    } catch (error) {
      console.error('Error getting filtered workout plans:', error);
      throw error;
    }
  },
  
  // Get workout plan details
  getWorkoutPlanDetails: async (planId) => {
    try {
      // In a real implementation, this would call an API
      console.log(`Getting details for workout plan: ${planId}`);
      
      // Mock implementation
      const plan = mockWorkoutPlans.find(plan => plan.id === planId);
      
      if (!plan) {
        throw new Error('Workout plan not found');
      }
      
      // Get workout days for this plan
      const days = mockWorkoutDays.filter(day => day.workout_plan_id === planId);
      
      // Get exercises for each day
      const daysWithExercises = await Promise.all(days.map(async (day) => {
        const workoutExercises = mockWorkoutExercises.filter(we => we.workout_day_id === day.id);
        
        // Get exercise details for each workout exercise
        const exercises = await Promise.all(workoutExercises.map(async (we) => {
          const exercise = mockExercises.find(ex => ex.id === we.exercise_id);
          return {
            ...exercise,
            sets: we.sets,
            reps: we.reps,
            duration_minutes: we.duration_minutes,
            rest_seconds: we.rest_seconds,
            notes: we.notes,
            order_index: we.order_index
          };
        }));
        
        // Sort exercises by order_index
        exercises.sort((a, b) => a.order_index - b.order_index);
        
        return {
          ...day,
          exercises
        };
      }));
      
      // Sort days by day_number
      daysWithExercises.sort((a, b) => a.day_number - b.day_number);
      
      return {
        ...plan,
        days: daysWithExercises
      };
    } catch (error) {
      console.error('Error getting workout plan details:', error);
      throw error;
    }
  },
  
  // Get recommended workout plans based on user profile
  getRecommendedWorkoutPlans: async (userProfile) => {
    try {
      // In a real implementation, this would call an API with recommendation algorithm
      console.log('Getting recommended workout plans for user profile', userProfile);
      
      // Mock implementation of recommendation algorithm
      let recommendedPlans = [];
      
      // Filter by goal
      const goalPlans = mockWorkoutPlans.filter(plan => plan.goal_type === userProfile.goal_type);
      
      // Determine appropriate difficulty level based on activity level
      let difficultyLevel;
      switch (userProfile.activity_level) {
        case 'sedentary':
        case 'lightly_active':
          difficultyLevel = 'beginner';
          break;
        case 'moderately_active':
          difficultyLevel = 'intermediate';
          break;
        case 'very_active':
        case 'extremely_active':
          difficultyLevel = 'advanced';
          break;
        default:
          difficultyLevel = 'beginner';
      }
      
      // Get plans matching both goal and difficulty
      const matchingPlans = goalPlans.filter(plan => plan.difficulty_level === difficultyLevel);
      
      if (matchingPlans.length > 0) {
        // If we have exact matches, use those
        recommendedPlans = matchingPlans;
      } else {
        // Otherwise, prioritize goal over difficulty
        recommendedPlans = goalPlans;
      }
      
      // Sort by relevance (in a real app, this would use more sophisticated algorithm)
      // For now, just sort by matching difficulty first
      recommendedPlans.sort((a, b) => {
        if (a.difficulty_level === difficultyLevel && b.difficulty_level !== difficultyLevel) {
          return -1;
        }
        if (a.difficulty_level !== difficultyLevel && b.difficulty_level === difficultyLevel) {
          return 1;
        }
        return 0;
      });
      
      return recommendedPlans.slice(0, 3); // Return top 3 recommendations
    } catch (error) {
      console.error('Error getting recommended workout plans:', error);
      throw error;
    }
  },
  
  // Get today's workout for a user
  getTodaysWorkout: async (userId) => {
    try {
      // In a real implementation, this would call an API
      console.log(`Getting today's workout for user: ${userId}`);
      
      // Mock implementation
      
      // Check if user has an active workout plan
      const userWorkoutPlan = mockUserWorkoutPlans.find(
        uwp => uwp.user_id === userId && uwp.is_active
      );
      
      if (!userWorkoutPlan) {
        return null; // No active workout plan
      }
      
      // Get the workout plan
      const workoutPlan = mockWorkoutPlans.find(plan => plan.id === userWorkoutPlan.workout_plan_id);
      
      if (!workoutPlan) {
        return null; // Plan not found
      }
      
      // Determine which day of the plan we're on
      const startDate = new Date(userWorkoutPlan.start_date);
      const today = new Date();
      const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
      
      // Get workout days for this plan
      const workoutDays = mockWorkoutDays.filter(day => day.workout_plan_id === workoutPlan.id);
      
      // Sort by day_number
      workoutDays.sort((a, b) => a.day_number - b.day_number);
      
      // Determine which day to show (cycle through the days)
      const dayIndex = daysSinceStart % workoutDays.length;
      const todaysWorkoutDay = workoutDays[dayIndex];
      
      // Get exercises for this day
      const workoutExercises = mockWorkoutExercises.filter(we => we.workout_day_id === todaysWorkoutDay.id);
      
      // Sort by order_index
      workoutExercises.sort((a, b) => a.order_index - b.order_index);
      
      // Get exercise details
      const exercises = workoutExercises.map(we => {
        const exercise = mockExercises.find(ex => ex.id === we.exercise_id);
        return {
          ...exercise,
          sets: we.sets,
          reps: we.reps,
          duration_minutes: we.duration_minutes,
          rest_seconds: we.rest_seconds,
          notes: we.notes,
          completed: false // Default to not completed
        };
      });
      
      // Calculate total duration and calories
      const totalDuration = exercises.reduce((sum, ex) => sum + (ex.duration_minutes || 0), 0);
      const totalCalories = exercises.reduce((sum, ex) => {
        const duration = ex.duration_minutes || 0;
        const caloriesPerMinute = ex.calories_per_minute || 5; // Default to 5 cal/min if not specified
        return sum + (duration * caloriesPerMinute);
      }, 0);
      
      return {
        name: workoutPlan.name,
        day: `Day ${todaysWorkoutDay.day_number}`,
        focus_area: todaysWorkoutDay.focus_area,
        exercises,
        duration: totalDuration,
        calories: totalCalories
      };
    } catch (error) {
      console.error('Error getting today\'s workout:', error);
      throw error;
    }
  },
  
  // Log a completed workout
  logWorkout: async (userId, workoutData) => {
    try {
      // In a real implementation, this would call an API
      console.log(`Logging workout for user: ${userId}`, workoutData);
      
      // Mock implementation
      const newWorkoutLog = {
        id: `workout-log-${Date.now()}`,
        user_id: userId,
        workout_date: workoutData.date || new Date().toISOString().split('T')[0],
        workout_plan_id: workoutData.workout_plan_id,
        workout_day_id: workoutData.workout_day_id,
        duration_minutes: workoutData.duration_minutes,
        calories_burned: workoutData.calories_burned,
        notes: workoutData.notes,
        created_at: new Date().toISOString()
      };
      
      // Add to mock database
      mockUserWorkoutLogs.push(newWorkoutLog);
      
      // Log individual exercises
      if (workoutData.exercises && workoutData.exercises.length > 0) {
        workoutData.exercises.forEach(exercise => {
          const exerciseLog = {
            id: `exercise-log-${Date.now()}-${exercise.id}`,
            user_workout_log_id: newWorkoutLog.id,
            exercise_id: exercise.id,
            sets_completed: exercise.sets_completed,
            reps_completed: exercise.reps_completed,
            weight_used: exercise.weight_used,
            duration_minutes: exercise.duration_minutes,
            notes: exercise.notes,
            created_at: new Date().toISOString()
          };
          
          // Add to mock database
          mockExerciseLogs.push(exerciseLog);
        });
      }
      
      return newWorkoutLog;
    } catch (error) {
      console.error('Error logging workout:', error);
      throw error;
    }
  },
  
  // Get user's workout history
  getWorkoutHistory: async (userId) => {
    try {
      // In a real implementation, this would call an API
      console.log(`Getting workout history for user: ${userId}`);
      
      // Mock implementation
      const workoutLogs = mockUserWorkoutLogs.filter(log => log.user_id === userId);
      
      // Sort by date (most recent first)
      workoutLogs.sort((a, b) => new Date(b.workout_date) - new Date(a.workout_date));
      
      // Get additional details for each log
      const logsWithDetails = workoutLogs.map(log => {
        // Get workout plan name
        const plan = mockWorkoutPlans.find(plan => plan.id === log.workout_plan_id);
        const planName = plan ? plan.name : 'Custom Workout';
        
        // Get workout day focus
        const day = mockWorkoutDays.find(day => day.id === log.workout_day_id);
        const focusArea = day ? day.focus_area : '';
        
        return {
          ...log,
          workout_name: planName,
          focus_area: focusArea
        };
      });
      
      return logsWithDetails;
    } catch (error) {
      console.error('Error getting workout history:', error);
      throw error;
    }
  },
  
  // Assign a workout plan to a user
  assignWorkoutPlan: async (userId, planId, startDate = new Date().toISOString().split('T')[0]) => {
    try {
      // In a real implementation, this would call an API
      console.log(`Assigning workout plan ${planId} to user: ${userId}`);
      
      // First, deactivate any existing active plans
      mockUserWorkoutPlans.forEach(plan => {
        if (plan.user_id === userId && plan.is_active) {
          plan.is_active = false;
          plan.end_date = new Date().toISOString().split('T')[0];
        }
      });
      
      // Create new user workout plan
      const newUserWorkoutPlan = {
        id: `user-workout-plan-${Date.now()}`,
        user_id: userId,
        workout_plan_id: planId,
        start_date: startDate,
        end_date: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to mock database
      mockUserWorkoutPlans.push(newUserWorkoutPlan);
      
      return newUserWorkoutPlan;
    } catch (error) {
      console.error('Error assigning workout plan:', error);
      throw error;
    }
  }
};

// Mock exercise categories
const mockExerciseCategories = [
  { id: 1, name: 'Strength', description: 'Exercises focused on building muscle strength and size' },
  { id: 2, name: 'Cardio', description: 'Exercises focused on cardiovascular health and endurance' },
  { id: 3, name: 'Flexibility', description: 'Exercises focused on improving range of motion and flexibility' },
  { id: 4, name: 'HIIT', description: 'High-Intensity Interval Training for efficient calorie burning' },
  { id: 5, name: 'Mobility', description: 'Exercises focused on joint health and movement patterns' }
];

// Mock exercises
const mockExercises = [
  {
    id: 1,
    name: 'Push-ups',
    category_id: 1,
    description: 'A classic bodyweight exercise that targets the chest, shoulders, and triceps.',
    difficulty_level: 'beginner',
    muscle_group: 'Chest, Shoulders, Triceps',
    equipment_needed: 'None',
    instructions: 'Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.',
    video_url: 'https://example.com/videos/pushups.mp4',
    calories_per_minute: 8
  },
  {
    id: 2,
    name: 'Squats',
    category_id: 1,
    description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes.',
    difficulty_level: 'beginner',
    muscle_group: 'Quadriceps, Hamstrings, Glutes',
    equipment_needed: 'None (bodyweight) or Barbell/Dumbbells',
    instructions: 'Stand with feet shoulder-width apart. Lower your body by bending your knees and hips, as if sitting in a chair. Keep your back straight and chest up. Return to standing position.',
    video_url: 'https://example.com/videos/squats.mp4',
    calories_per_minute: 8
  },
  {
    id: 3,
    name: 'Dumbbell Rows',
    category_id: 1,
    description: 'An upper body pulling exercise that targets the back and biceps.',
    difficulty_level: 'beginner',
    muscle_group: 'Back, Biceps',
    equipment_needed: 'Dumbbells, Bench',
    instructions: 'Place one knee and hand on a bench, with the other foot on the floor. Hold a dumbbell in your free hand, arm extended. Pull the dumbbell up to your side, keeping your elbow close to your body. Lower and repeat.',
    video_url: 'https://example.com/videos/dumbbell-rows.mp4',
    calories_per_minute: 7
  },
  {
    id: 4,
    name: 'Shoulder Press',
    category_id: 1,
    description: 'An upper body pushing exercise that targets the shoulders and triceps.',
    difficulty_level: 'intermediate',
    muscle_group: 'Shoulders, Triceps',
    equipment_needed: 'Dumbbells or Barbell',
    instructions: 'Sit or stand with weights at shoulder height. Press the weights overhead until arms are fully extended. Lower back to shoulder height and repeat.',
    video_url: 'https://example.com/videos/shoulder-press.mp4',
    calories_per_minute: 7
  },
  {
    id: 5,
    name: 'Deadlifts',
    category_id: 1,
    description: 'A compound exercise that targets the lower back, hamstrings, and glutes.',
    difficulty_level: 'intermediate',
    muscle_group: 'Lower Back, Hamstrings, Glutes',
    equipment_needed: 'Barbell',
    instructions: 'Stand with feet hip-width apart, barbell over midfoot. Bend at hips and knees to grip the bar. Keeping back straight, lift the bar by extending hips and knees. Return the bar to the floor by hinging at the hips and bending the knees.',
    video_url: 'https://example.com/videos/deadlifts.mp4',
    calories_per_minute: 9
  },
  {
    id: 6,
    name: 'Bench Press',
    category_id: 1,
    description: 'A compound exercise that targets the chest, shoulders, and triceps.',
    difficulty_level: 'intermediate',
    muscle_group: 'Chest, Shoulders, Triceps',
    equipment_needed: 'Barbell, Bench',
    instructions: 'Lie on a bench with feet flat on the floor. Grip the barbell with hands slightly wider than shoulder-width. Lower the bar to your chest, then press it back up to the starting position.',
    video_url: 'https://example.com/videos/bench-press.mp4',
    calories_per_minute: 8
  },
  {
    id: 7,
    name: 'Pull-ups',
    category_id: 1,
    description: 'A bodyweight exercise that targets the back, biceps, and shoulders.',
    difficulty_level: 'intermediate',
    muscle_group: 'Back, Biceps, Shoulders',
    equipment_needed: 'Pull-up Bar',
    instructions: 'Hang from a pull-up bar with hands slightly wider than shoulder-width, palms facing away. Pull your body up until your chin is over the bar, then lower back to the starting position.',
    video_url: 'https://example.com/videos/pull-ups.mp4',
    calories_per_minute: 10
  },
  {
    id: 8,
    name: 'Lunges',
    category_id: 1,
    description: 'A unilateral exercise that targets the quadriceps, hamstrings, and glutes.',
    difficulty_level: 'beginner',
    muscle_group: 'Quadriceps, Hamstrings, Glutes',
    equipment_needed: 'None (bodyweight) or Dumbbells',
    instructions: 'Stand with feet hip-width apart. Step forward with one leg and lower your body until both knees are bent at 90-degree angles. Push back up to the starting position and repeat with the other leg.',
    video_url: 'https://example.com/videos/lunges.mp4',
    calories_per_minute: 8
  },
  {
    id: 9,
    name: 'Plank',
    category_id: 1,
    description: 'A core exercise that targets the abdominals and lower back.',
    difficulty_level: 'beginner',
    muscle_group: 'Core, Shoulders',
    equipment_needed: 'None',
    instructions: 'Start in a push-up position, then bend your elbows and rest your weight on your forearms. Keep your body in a straight line from head to heels. Hold the position.',
    video_url: 'https://example.com/videos/plank.mp4',
    calories_per_minute: 5
  },
  {
    id: 10,
    name: 'Tricep Dips',
    category_id: 1,
    description: 'An upper body exercise that targets the triceps.',
    difficulty_level: 'beginner',
    muscle_group: 'Triceps, Shoulders',
    equipment_needed: 'Bench or Chair',
    instructions: 'Sit on the edge of a bench or chair, hands gripping the edge beside your hips. Slide your butt off the edge and lower your body by bending your elbows. Push back up to the starting position.',
    video_url: 'https://example.com/videos/tricep-dips.mp4',
    calories_per_minute: 7
  },
  {
    id: 11,
    name: 'Running',
    category_id: 2,
    description: 'A cardiovascular exercise that improves endurance and burns calories.',
    difficulty_level: 'beginner',
    muscle_group: 'Legs, Core',
    equipment_needed: 'Running Shoes',
    instructions: 'Start with a warm-up walk, then gradually increase to a jogging pace. Maintain good posture with shoulders relaxed and arms swinging naturally.',
    video_url: 'https://example.com/videos/running.mp4',
    calories_per_minute: 10
  },
  {
    id: 12,
    name: 'Cycling',
    category_id: 2,
    description: 'A low-impact cardiovascular exercise that targets the legs.',
    difficulty_level: 'beginner',
    muscle_group: 'Quadriceps, Hamstrings, Calves',
    equipment_needed: 'Bicycle or Stationary Bike',
    instructions: 'Adjust the seat height so your leg is slightly bent at the bottom of the pedal stroke. Maintain a steady cadence and adjust resistance as needed.',
    video_url: 'https://example.com/videos/cycling.mp4',
    calories_per_minute: 8
  },
  {
    id: 13,
    name: 'Jumping Jacks',
    category_id: 2,
    description: 'A full-body cardiovascular exercise.',
    difficulty_level: 'beginner',
    muscle_group: 'Full Body',
    equipment_needed: 'None',
    instructions: 'Stand with feet together and arms at your sides. Jump while spreading your feet and raising your arms overhead. Jump again to return to the starting position.',
    video_url: 'https://example.com/videos/jumping-jacks.mp4',
    calories_per_minute: 8
  },
  {
    id: 14,
    name: 'Burpees',
    category_id: 4,
    description: 'A high-intensity full-body exercise that combines a squat, push-up, and jump.',
    difficulty_level: 'intermediate',
    muscle_group: 'Full Body',
    equipment_needed: 'None',
    instructions: 'Start standing, then squat down and place hands on the floor. Jump feet back into a plank position, perform a push-up, jump feet forward to hands, then explosively jump up with arms overhead.',
    video_url: 'https://example.com/videos/burpees.mp4',
    calories_per_minute: 12
  },
  {
    id: 15,
    name: 'Mountain Climbers',
    category_id: 4,
    description: 'A dynamic exercise that targets the core, shoulders, and legs.',
    difficulty_level: 'intermediate',
    muscle_group: 'Core, Shoulders, Legs',
    equipment_needed: 'None',
    instructions: 'Start in a plank position. Rapidly alternate bringing knees toward chest, as if running in place in a plank position.',
    video_url: 'https://example.com/videos/mountain-climbers.mp4',
    calories_per_minute: 10
  }
];

// Mock workout plans
const mockWorkoutPlans = [
  {
    id: 1,
    name: 'Weight Loss Beginner',
    description: 'A beginner-friendly workout plan focused on burning calories and building basic strength.',
    goal_type: 'weight_loss',
    difficulty_level: 'beginner',
    duration_weeks: 8,
    days_per_week: 3
  },
  {
    id: 2,
    name: 'Muscle Building Intermediate',
    description: 'Build muscle mass with this intermediate strength training program.',
    goal_type: 'muscle_gain',
    difficulty_level: 'intermediate',
    duration_weeks: 12,
    days_per_week: 5
  },
  {
    id: 3,
    name: 'Full Body Toning',
    description: 'A balanced workout plan to tone muscles and improve overall fitness.',
    goal_type: 'toning',
    difficulty_level: 'intermediate',
    duration_weeks: 10,
    days_per_week: 4
  },
  {
    id: 4,
    name: 'HIIT Cardio Blast',
    description: 'High-intensity interval training for maximum calorie burn and cardiovascular health.',
    goal_type: 'weight_loss',
    difficulty_level: 'advanced',
    duration_weeks: 6,
    days_per_week: 4
  },
  {
    id: 5,
    name: 'Strength & Power Advanced',
    description: 'Advanced strength training program focused on building power and muscle mass.',
    goal_type: 'muscle_gain',
    difficulty_level: 'advanced',
    duration_weeks: 16,
    days_per_week: 6
  }
];

// Mock workout days
const mockWorkoutDays = [
  { id: 1, workout_plan_id: 1, day_number: 1, focus_area: 'Full Body' },
  { id: 2, workout_plan_id: 1, day_number: 3, focus_area: 'Cardio' },
  { id: 3, workout_plan_id: 1, day_number: 5, focus_area: 'Full Body' },
  
  { id: 4, workout_plan_id: 2, day_number: 1, focus_area: 'Chest & Triceps' },
  { id: 5, workout_plan_id: 2, day_number: 2, focus_area: 'Back & Biceps' },
  { id: 6, workout_plan_id: 2, day_number: 3, focus_area: 'Legs' },
  { id: 7, workout_plan_id: 2, day_number: 4, focus_area: 'Shoulders & Arms' },
  { id: 8, workout_plan_id: 2, day_number: 5, focus_area: 'Full Body' },
  
  { id: 9, workout_plan_id: 3, day_number: 1, focus_area: 'Upper Body' },
  { id: 10, workout_plan_id: 3, day_number: 2, focus_area: 'Lower Body' },
  { id: 11, workout_plan_id: 3, day_number: 4, focus_area: 'Upper Body' },
  { id: 12, workout_plan_id: 3, day_number: 5, focus_area: 'Lower Body' },
  
  { id: 13, workout_plan_id: 4, day_number: 1, focus_area: 'HIIT' },
  { id: 14, workout_plan_id: 4, day_number: 3, focus_area: 'HIIT' },
  { id: 15, workout_plan_id: 4, day_number: 5, focus_area: 'HIIT' },
  { id: 16, workout_plan_id: 4, day_number: 6, focus_area: 'Active Recovery' },
  
  { id: 17, workout_plan_id: 5, day_number: 1, focus_area: 'Chest' },
  { id: 18, workout_plan_id: 5, day_number: 2, focus_area: 'Back' },
  { id: 19, workout_plan_id: 5, day_number: 3, focus_area: 'Legs' },
  { id: 20, workout_plan_id: 5, day_number: 4, focus_area: 'Shoulders' },
  { id: 21, workout_plan_id: 5, day_number: 5, focus_area: 'Arms' },
  { id: 22, workout_plan_id: 5, day_number: 6, focus_area: 'Core & Cardio' }
];

// Mock workout exercises (connecting workout days to exercises)
const mockWorkoutExercises = [
  // Weight Loss Beginner - Day 1 (Full Body)
  { id: 1, workout_day_id: 1, exercise_id: 1, sets: 3, reps: 10, rest_seconds: 60, order_index: 1 }, // Push-ups
  { id: 2, workout_day_id: 1, exercise_id: 2, sets: 3, reps: 12, rest_seconds: 60, order_index: 2 }, // Squats
  { id: 3, workout_day_id: 1, exercise_id: 8, sets: 3, reps: 10, rest_seconds: 60, order_index: 3 }, // Lunges
  { id: 4, workout_day_id: 1, exercise_id: 9, sets: 3, duration_minutes: 1, rest_seconds: 30, order_index: 4 }, // Plank
  
  // Weight Loss Beginner - Day 2 (Cardio)
  { id: 5, workout_day_id: 2, exercise_id: 11, duration_minutes: 20, order_index: 1 }, // Running
  { id: 6, workout_day_id: 2, exercise_id: 13, sets: 3, reps: 30, rest_seconds: 30, order_index: 2 }, // Jumping Jacks
  
  // Weight Loss Beginner - Day 3 (Full Body)
  { id: 7, workout_day_id: 3, exercise_id: 3, sets: 3, reps: 12, rest_seconds: 60, order_index: 1 }, // Dumbbell Rows
  { id: 8, workout_day_id: 3, exercise_id: 10, sets: 3, reps: 12, rest_seconds: 60, order_index: 2 }, // Tricep Dips
  { id: 9, workout_day_id: 3, exercise_id: 2, sets: 3, reps: 15, rest_seconds: 60, order_index: 3 }, // Squats
  { id: 10, workout_day_id: 3, exercise_id: 15, sets: 3, duration_minutes: 1, rest_seconds: 30, order_index: 4 }, // Mountain Climbers
  
  // Muscle Building Intermediate - Day 1 (Chest & Triceps)
  { id: 11, workout_day_id: 4, exercise_id: 6, sets: 4, reps: 8, rest_seconds: 90, order_index: 1 }, // Bench Press
  { id: 12, workout_day_id: 4, exercise_id: 1, sets: 3, reps: 12, rest_seconds: 60, order_index: 2 }, // Push-ups
  { id: 13, workout_day_id: 4, exercise_id: 10, sets: 3, reps: 15, rest_seconds: 60, order_index: 3 }, // Tricep Dips
  
  // Upper Body Strength (example for today's workout)
  { id: 50, workout_day_id: 9, exercise_id: 1, sets: 3, reps: 12, rest_seconds: 60, order_index: 1 }, // Push-ups
  { id: 51, workout_day_id: 9, exercise_id: 3, sets: 3, reps: 10, rest_seconds: 90, order_index: 2 }, // Dumbbell Rows
  { id: 52, workout_day_id: 9, exercise_id: 4, sets: 3, reps: 8, rest_seconds: 90, order_index: 3 }, // Shoulder Press
  { id: 53, workout_day_id: 9, exercise_id: 10, sets: 3, reps: 15, rest_seconds: 60, order_index: 4 }, // Tricep Dips
  { id: 54, workout_day_id: 9, exercise_id: 7, sets: 3, reps: 8, rest_seconds: 90, order_index: 5 } // Pull-ups
];

// Mock user workout plans
const mockUserWorkoutPlans = [
  {
    id: 'user-workout-plan-1',
    user_id: 'user-1',
    workout_plan_id: 3, // Full Body Toning
    start_date: '2025-03-15',
    end_date: null,
    is_active: true,
    created_at: '2025-03-15T10:00:00Z',
    updated_at: '2025-03-15T10:00:00Z'
  }
];

// Mock user workout logs
const mockUserWorkoutLogs = [
  {
    id: 'workout-log-1',
    user_id: 'user-1',
    workout_date: '2025-03-15',
    workout_plan_id: 3,
    workout_day_id: 9,
    duration_minutes: 45,
    calories_burned: 350,
    notes: 'Felt good, increased weight on shoulder press',
    created_at: '2025-03-15T18:30:00Z'
  },
  {
    id: 'workout-log-2',
    user_id: 'user-1',
    workout_date: '2025-03-17',
    workout_plan_id: 3,
    workout_day_id: 10,
    duration_minutes: 50,
    calories_burned: 400,
    notes: 'Legs are sore, but pushed through',
    created_at: '2025-03-17T19:00:00Z'
  },
  {
    id: 'workout-log-3',
    user_id: 'user-1',
    workout_date: '2025-03-19',
    workout_plan_id: 3,
    workout_day_id: 9,
    duration_minutes: 30,
    calories_burned: 320,
    notes: 'Short on time, did a condensed version',
    created_at: '2025-03-19T17:45:00Z'
  }
];

// Mock exercise logs
const mockExerciseLogs = [
  // For workout-log-1
  {
    id: 'exercise-log-1',
    user_workout_log_id: 'workout-log-1',
    exercise_id: 1,
    sets_completed: 3,
    reps_completed: 12,
    weight_used: null,
    duration_minutes: null,
    notes: 'Felt strong',
    created_at: '2025-03-15T18:30:00Z'
  },
  {
    id: 'exercise-log-2',
    user_workout_log_id: 'workout-log-1',
    exercise_id: 3,
    sets_completed: 3,
    reps_completed: 10,
    weight_used: 15,
    duration_minutes: null,
    notes: null,
    created_at: '2025-03-15T18:30:00Z'
  },
  {
    id: 'exercise-log-3',
    user_workout_log_id: 'workout-log-1',
    exercise_id: 4,
    sets_completed: 3,
    reps_completed: 8,
    weight_used: 20,
    duration_minutes: null,
    notes: 'Increased weight from 15 to 20',
    created_at: '2025-03-15T18:30:00Z'
  }
];

export default WorkoutService;
