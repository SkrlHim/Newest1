// Wireframes for Health and Wellness App

// This file contains wireframe descriptions for the main screens of our app
// These will guide our UI implementation

export const wireframes = {
  // Main app screens
  screens: [
    {
      name: "Login/Registration",
      description: "User authentication screens",
      elements: [
        "Login form with email/password fields",
        "Registration form with username, email, password fields",
        "Social login options",
        "Password recovery link"
      ]
    },
    {
      name: "Dashboard",
      description: "Main app dashboard with overview of user's health data",
      elements: [
        "Daily calorie summary (consumed vs. goal)",
        "Recent weight entries with mini chart",
        "Today's workout plan preview",
        "Today's meal plan preview",
        "Quick add buttons for meals and workouts",
        "Progress towards goals visualization",
        "Achievement badges"
      ]
    },
    {
      name: "Profile Setup",
      description: "Initial profile setup and goal setting",
      elements: [
        "Personal details form (age, gender, height, weight)",
        "Goal selection (weight loss, muscle gain, maintenance)",
        "Activity level selection",
        "Dietary preferences selection",
        "Target weight input",
        "Timeline selection for goals"
      ]
    },
    {
      name: "Calorie Tracking",
      description: "Food logging and calorie tracking interface",
      elements: [
        "Meal type selection (breakfast, lunch, dinner, snack)",
        "Food search bar with autocomplete",
        "Recent and favorite foods list",
        "Barcode scanner button",
        "Custom food entry form",
        "Portion size selector",
        "Nutritional information display",
        "Daily calorie and macronutrient summary"
      ]
    },
    {
      name: "Workout Plans",
      description: "Workout recommendation and tracking interface",
      elements: [
        "Recommended workout plans based on goals",
        "Workout plan details with exercises",
        "Exercise details with instructions and videos",
        "Workout calendar for scheduling",
        "Workout logging interface",
        "Progress tracking for weights and reps",
        "Exercise categories filter"
      ]
    },
    {
      name: "Diet Plans",
      description: "Diet recommendation and meal planning interface",
      elements: [
        "Recommended diet plans based on goals",
        "Diet plan details with daily calorie targets",
        "Meal plan for each day of the week",
        "Recipe details with ingredients and instructions",
        "Grocery list generator",
        "Meal prep instructions",
        "Diet type filter (keto, vegan, etc.)"
      ]
    },
    {
      name: "Progress Tracking",
      description: "Visualizations and statistics for user progress",
      elements: [
        "Weight chart over time",
        "Body measurements tracker",
        "Calorie intake vs. goal chart",
        "Workout consistency calendar",
        "Strength progress charts",
        "Achievement showcase",
        "Export data options"
      ]
    },
    {
      name: "Settings",
      description: "App settings and user preferences",
      elements: [
        "Account settings (email, password)",
        "Notification preferences",
        "Units preference (metric/imperial)",
        "Theme selection (light/dark)",
        "Data privacy settings",
        "Export/import data options",
        "Delete account option"
      ]
    }
  ],
  
  // Common UI components across screens
  commonComponents: [
    {
      name: "Navigation",
      description: "Main navigation for the app",
      elements: [
        "Bottom tab bar for mobile (Dashboard, Food, Workouts, Diet, Progress)",
        "Side navigation for desktop",
        "Quick add floating action button",
        "Notification bell icon"
      ]
    },
    {
      name: "Header",
      description: "App header with contextual actions",
      elements: [
        "App logo/name",
        "Page title",
        "User avatar with dropdown menu",
        "Back button when applicable",
        "Context-specific action buttons"
      ]
    },
    {
      name: "Cards",
      description: "Reusable card components for displaying information",
      elements: [
        "Summary cards with icons and values",
        "List item cards for foods, exercises, recipes",
        "Progress cards with mini charts",
        "Achievement cards with badges"
      ]
    },
    {
      name: "Forms",
      description: "Reusable form components",
      elements: [
        "Text inputs with validation",
        "Number inputs with increment/decrement",
        "Date pickers",
        "Dropdown selects",
        "Radio button groups",
        "Checkbox groups",
        "Search inputs with autocomplete"
      ]
    },
    {
      name: "Charts",
      description: "Data visualization components",
      elements: [
        "Line charts for progress over time",
        "Bar charts for daily/weekly comparisons",
        "Pie charts for macronutrient breakdown",
        "Calendar heatmaps for consistency tracking",
        "Gauge charts for goal progress"
      ]
    }
  ],
  
  // Responsive design considerations
  responsiveDesign: {
    mobile: {
      navigation: "Bottom tab bar with 5 main sections",
      layout: "Single column, scrollable content",
      interactions: "Touch-optimized buttons and forms",
      specialFeatures: "Pull-to-refresh, swipe actions"
    },
    tablet: {
      navigation: "Bottom tab bar or side navigation depending on orientation",
      layout: "Two-column layout in landscape, single column in portrait",
      interactions: "Touch and keyboard support",
      specialFeatures: "Split views for related content"
    },
    desktop: {
      navigation: "Side navigation with expanded labels",
      layout: "Multi-column dashboard, modal dialogs for forms",
      interactions: "Keyboard shortcuts, hover states",
      specialFeatures: "Advanced data visualization, drag-and-drop"
    }
  }
};
