// Unit tests for the WorkoutService
import { WorkoutService } from '@/services/WorkoutService';

describe('WorkoutService', () => {
  // Test getExerciseCategories function
  test('getExerciseCategories returns all exercise categories', async () => {
    const categories = await WorkoutService.getExerciseCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty('id');
    expect(categories[0]).toHaveProperty('name');
  });

  // Test getExercises function
  test('getExercises returns exercises filtered by category', async () => {
    const categoryId = 'strength'; // Assuming this ID exists in mock data
    const exercises = await WorkoutService.getExercises(categoryId);
    expect(Array.isArray(exercises)).toBe(true);
    if (exercises.length > 0) {
      expect(exercises[0].category_id).toBe(categoryId);
    }
  });

  // Test getWorkoutPlans function
  test('getWorkoutPlans returns all workout plans', async () => {
    const plans = await WorkoutService.getWorkoutPlans();
    expect(Array.isArray(plans)).toBe(true);
    expect(plans.length).toBeGreaterThan(0);
    expect(plans[0]).toHaveProperty('id');
    expect(plans[0]).toHaveProperty('name');
    expect(plans[0]).toHaveProperty('goal_type');
  });

  // Test getFilteredWorkoutPlans function
  test('getFilteredWorkoutPlans returns plans filtered by goal and difficulty', async () => {
    const filters = {
      goal: 'weight_loss',
      difficulty: 'beginner'
    };
    const plans = await WorkoutService.getFilteredWorkoutPlans(filters);
    expect(Array.isArray(plans)).toBe(true);
    if (plans.length > 0) {
      expect(plans[0].goal_type).toBe(filters.goal);
      expect(plans[0].difficulty_level).toBe(filters.difficulty);
    }
  });

  // Test getRecommendedWorkoutPlans function
  test('getRecommendedWorkoutPlans returns plans based on user profile', async () => {
    const userProfile = {
      goal_type: 'weight_loss',
      activity_level: 'moderately_active',
      gender: 'male',
      age: 35,
      weight: 85,
      height: 178
    };
    const plans = await WorkoutService.getRecommendedWorkoutPlans(userProfile);
    expect(Array.isArray(plans)).toBe(true);
    if (plans.length > 0) {
      expect(plans[0].goal_type).toBe(userProfile.goal_type);
    }
  });

  // Test getTodaysWorkout function
  test('getTodaysWorkout returns workout for the user', async () => {
    const userId = 'user-1'; // Assuming this ID exists in mock data
    const workout = await WorkoutService.getTodaysWorkout(userId);
    if (workout) {
      expect(workout).toHaveProperty('name');
      expect(workout).toHaveProperty('exercises');
      expect(Array.isArray(workout.exercises)).toBe(true);
    }
  });
});
