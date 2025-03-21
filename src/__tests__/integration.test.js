// Integration tests for the application
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';
import FoodPage from '@/app/food/page';
import WorkoutsPage from '@/app/workouts/page';
import DietPage from '@/app/diet/page';
import ProgressPage from '@/app/progress/page';

// Mock the hooks
jest.mock('@/hooks/useCalorieTracking', () => ({
  useFoodSearch: jest.fn().mockReturnValue({
    searchResults: [],
    isLoading: false,
    error: null,
    searchFood: jest.fn()
  }),
  useMealLogging: jest.fn().mockReturnValue({
    meals: [],
    isLoading: false,
    error: null,
    logMeal: jest.fn(),
    removeMeal: jest.fn()
  }),
  useCalorieTracking: jest.fn().mockReturnValue({
    calorieHistory: [],
    dailyCalories: 0,
    calorieGoal: 2000,
    isLoading: false,
    error: null
  })
}));

jest.mock('@/hooks/useWorkoutRecommendation', () => ({
  useWorkoutPlans: jest.fn().mockReturnValue({
    filteredPlans: [],
    filters: { goal: 'all', difficulty: 'all' },
    updateFilters: jest.fn(),
    isLoading: false,
    error: null
  }),
  useRecommendedWorkouts: jest.fn().mockReturnValue({
    recommendedPlans: [],
    isLoading: false,
    error: null
  }),
  useTodaysWorkout: jest.fn().mockReturnValue({
    todaysWorkout: null,
    exerciseStatus: {},
    completionPercentage: 0,
    toggleExerciseCompletion: jest.fn(),
    updateExerciseDetails: jest.fn(),
    logCompletedWorkout: jest.fn(),
    isLoading: false
  })
}));

jest.mock('@/hooks/useDietPlanner', () => ({
  useDietTypes: jest.fn().mockReturnValue({
    dietTypes: [],
    isLoading: false,
    error: null
  }),
  useRecommendedDiets: jest.fn().mockReturnValue({
    recommendedPlans: [],
    isLoading: false,
    error: null
  }),
  useTodaysMealPlan: jest.fn().mockReturnValue({
    todaysMealPlan: null,
    mealStatus: {},
    completionPercentage: 0,
    toggleMealCompletion: jest.fn(),
    updateMealServings: jest.fn(),
    logCompletedMeal: jest.fn(),
    isLoading: false
  }),
  useDietPlans: jest.fn().mockReturnValue({
    filteredPlans: [],
    filters: { goal: 'all', dietType: 'all' },
    updateFilters: jest.fn(),
    isLoading: false,
    error: null
  }),
  useCustomDietPlan: jest.fn().mockReturnValue({
    generateCustomDietPlan: jest.fn(),
    assignGeneratedPlan: jest.fn(),
    isLoading: false,
    error: null
  })
}));

describe('Integration Tests', () => {
  // Test Dashboard Page
  test('Dashboard page renders correctly', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  // Test Food Page
  test('Food page renders correctly', () => {
    render(<FoodPage />);
    expect(screen.getByText(/Food Tracking/i)).toBeInTheDocument();
  });

  // Test Workouts Page
  test('Workouts page renders correctly', () => {
    render(<WorkoutsPage />);
    expect(screen.getByText(/Workouts/i)).toBeInTheDocument();
  });

  // Test Diet Page
  test('Diet page renders correctly', () => {
    render(<DietPage />);
    expect(screen.getByText(/Diet Plans/i)).toBeInTheDocument();
  });

  // Test Progress Page
  test('Progress page renders correctly', () => {
    render(<ProgressPage />);
    expect(screen.getByText(/Progress/i)).toBeInTheDocument();
  });

  // Test navigation between pages
  test('Navigation between pages works correctly', async () => {
    render(<DashboardPage />);
    
    // Navigate to Food page
    fireEvent.click(screen.getByText(/Food/i));
    await waitFor(() => {
      expect(screen.getByText(/Food Tracking/i)).toBeInTheDocument();
    });
    
    // Navigate to Workouts page
    fireEvent.click(screen.getByText(/Workouts/i));
    await waitFor(() => {
      expect(screen.getByText(/Workouts/i)).toBeInTheDocument();
    });
    
    // Navigate to Diet page
    fireEvent.click(screen.getByText(/Diet/i));
    await waitFor(() => {
      expect(screen.getByText(/Diet Plans/i)).toBeInTheDocument();
    });
    
    // Navigate to Progress page
    fireEvent.click(screen.getByText(/Progress/i));
    await waitFor(() => {
      expect(screen.getByText(/Progress/i)).toBeInTheDocument();
    });
    
    // Navigate back to Dashboard
    fireEvent.click(screen.getByText(/Home/i));
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
  });
});
