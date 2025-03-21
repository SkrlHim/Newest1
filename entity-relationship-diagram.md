# Entity Relationship Diagram

## User Management
```
Users 1──┐
         │
         │ 1
         ▼
UserProfiles 1────┐
                  │
                  │ 1
                  ▼
         ┌───── WeightHistory *
         │
         │ 1
         ▼
UserAchievements *◄───1─── Achievements
```

## Food and Meal Tracking
```
Users 1──┐
         │
         │ 1
         ▼
MealEntries *───┐
                │
                │ 1
                ▼
         ┌─── FoodEntries *───1─── Foods
         │
         │
Recipes 1┘
```

## Workout Management
```
ExerciseCategories 1──┐
                      │
                      │ *
                      ▼
                 Exercises *
                      │
                      │ *
                      ▼
WorkoutPlans 1───┐    │
                 │    │
                 ▼    │
          WorkoutDays *───┐
                           │
                           │ 1
                           ▼
                    WorkoutExercises *
                           │
                           │ *
                           ▼
Users 1───┐          ExerciseLogs *
          │                │
          │                │ *
          ▼                │
   UserWorkoutPlans *      │
          │                │
          │                │
          ▼                │
   UserWorkoutLogs *───────┘
```

## Diet Planning
```
DietTypes 1──┐
             │
             │ *
             ▼
        DietPlans *───┐
             │        │
             │        │ 1
             ▼        ▼
        Recipes *─── MealPlans *───┐
             │                     │
             │                     │ 1
             ▼                     ▼
   RecipeIngredients *      MealPlanItems *
             │                     │
             │                     │
             ▼                     │
           Foods ◄─────────────────┘
             ▲
             │
             │
    UserDietPlans *◄───1─── Users
```

## Legend
- `1` indicates "one" in a relationship
- `*` indicates "many" in a relationship
- `─┐` indicates a relationship between entities
- `▼` indicates the direction of the relationship

## Key Relationships

1. **User-centric Relationships**:
   - Each User has one UserProfile
   - Users have many WeightHistory records
   - Users can earn many Achievements
   - Users log many MealEntries
   - Users can follow many WorkoutPlans and DietPlans

2. **Food and Meal Tracking**:
   - MealEntries contain many FoodEntries
   - FoodEntries reference specific Foods
   - Recipes contain many RecipeIngredients
   - RecipeIngredients reference specific Foods

3. **Workout System**:
   - ExerciseCategories contain many Exercises
   - WorkoutPlans contain many WorkoutDays
   - WorkoutDays contain many WorkoutExercises
   - WorkoutExercises reference specific Exercises
   - Users log many UserWorkoutLogs
   - UserWorkoutLogs contain many ExerciseLogs

4. **Diet Planning**:
   - DietTypes have many DietPlans
   - DietPlans contain many MealPlans
   - MealPlans contain many MealPlanItems
   - MealPlanItems reference Recipes or Foods
   - Users can follow many DietPlans

This diagram illustrates the complex relationships between entities in our health and wellness application, showing how user data, food tracking, workout management, and diet planning are interconnected.
