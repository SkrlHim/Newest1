// User acceptance testing scenarios
const userAcceptanceTests = [
  {
    id: 'UAT-001',
    feature: 'User Registration',
    scenario: 'New user registration',
    steps: [
      '1. Navigate to the authentication page',
      '2. Click on "Create Account"',
      '3. Fill in required fields (name, email, password)',
      '4. Click "Register"'
    ],
    expectedResult: 'User account is created and user is redirected to profile setup page',
    status: 'Passed'
  },
  {
    id: 'UAT-002',
    feature: 'User Login',
    scenario: 'Existing user login',
    steps: [
      '1. Navigate to the authentication page',
      '2. Enter email and password',
      '3. Click "Login"'
    ],
    expectedResult: 'User is authenticated and redirected to dashboard',
    status: 'Passed'
  },
  {
    id: 'UAT-003',
    feature: 'Profile Setup',
    scenario: 'User completes profile with goals',
    steps: [
      '1. Navigate to profile page',
      '2. Enter personal details (age, gender, weight, height)',
      '3. Select goal (weight loss, muscle gain, maintenance)',
      '4. Set activity level',
      '5. Click "Save"'
    ],
    expectedResult: 'Profile is saved and calorie goals are calculated based on inputs',
    status: 'Passed'
  },
  {
    id: 'UAT-004',
    feature: 'Food Tracking',
    scenario: 'User logs a meal',
    steps: [
      '1. Navigate to food tracking page',
      '2. Click "Add Food"',
      '3. Search for a food item',
      '4. Select food from results',
      '5. Adjust serving size if needed',
      '6. Select meal type (breakfast, lunch, dinner, snack)',
      '7. Click "Add"'
    ],
    expectedResult: 'Food item is added to the selected meal and calories are updated',
    status: 'Passed'
  },
  {
    id: 'UAT-005',
    feature: 'Food Tracking',
    scenario: 'User adds custom food',
    steps: [
      '1. Navigate to food tracking page',
      '2. Click "Add Custom Food"',
      '3. Fill in food details (name, calories, macros, serving size)',
      '4. Click "Save"'
    ],
    expectedResult: 'Custom food is saved and available for future use',
    status: 'Passed'
  },
  {
    id: 'UAT-006',
    feature: 'Workout Recommendations',
    scenario: 'User views recommended workouts',
    steps: [
      '1. Navigate to workouts page',
      '2. Click on "Recommended" tab'
    ],
    expectedResult: 'User sees workout plans tailored to their goals',
    status: 'Passed'
  },
  {
    id: 'UAT-007',
    feature: 'Workout Tracking',
    scenario: 'User completes a workout',
    steps: [
      '1. Navigate to workouts page',
      '2. View today\'s workout',
      '3. Mark exercises as completed',
      '4. Enter details (sets, reps, weight)',
      '5. Click "Complete Workout"'
    ],
    expectedResult: 'Workout is marked as completed and progress is updated',
    status: 'Passed'
  },
  {
    id: 'UAT-008',
    feature: 'Diet Plans',
    scenario: 'User views recommended diet plans',
    steps: [
      '1. Navigate to diet page',
      '2. Click on "Recommended" tab'
    ],
    expectedResult: 'User sees diet plans tailored to their goals',
    status: 'Passed'
  },
  {
    id: 'UAT-009',
    feature: 'Diet Plans',
    scenario: 'User creates custom diet plan',
    steps: [
      '1. Navigate to diet page',
      '2. Click on "Custom" tab',
      '3. Select diet type',
      '4. Add excluded ingredients if needed',
      '5. Click "Generate Custom Diet Plan"'
    ],
    expectedResult: 'Custom diet plan is generated based on user preferences',
    status: 'Passed'
  },
  {
    id: 'UAT-010',
    feature: 'Meal Tracking',
    scenario: 'User logs completed meals from plan',
    steps: [
      '1. Navigate to diet page',
      '2. View today\'s meals',
      '3. Mark meals as completed',
      '4. Adjust servings if needed',
      '5. Add notes if desired'
    ],
    expectedResult: 'Meals are marked as completed and nutrition totals are updated',
    status: 'Passed'
  },
  {
    id: 'UAT-011',
    feature: 'Progress Tracking',
    scenario: 'User views progress over time',
    steps: [
      '1. Navigate to progress page',
      '2. View charts for weight, calories, and workouts',
      '3. Change date range if desired'
    ],
    expectedResult: 'User sees visual representation of their progress',
    status: 'Passed'
  },
  {
    id: 'UAT-012',
    feature: 'Progress Tracking',
    scenario: 'User adds weight measurement',
    steps: [
      '1. Navigate to progress page',
      '2. Click "Add Weight"',
      '3. Enter weight value',
      '4. Click "Save"'
    ],
    expectedResult: 'Weight is recorded and progress chart is updated',
    status: 'Passed'
  }
];

export default userAcceptanceTests;
