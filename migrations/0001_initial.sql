-- Database Schema for Health and Wellness App

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    gender TEXT,
    birth_date DATE,
    height REAL, -- in cm
    current_weight REAL, -- in kg
    goal_weight REAL, -- in kg
    activity_level TEXT, -- sedentary, lightly_active, moderately_active, very_active, extremely_active
    goal_type TEXT, -- weight_loss, muscle_gain, maintenance
    daily_calorie_goal INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Weight History Table
CREATE TABLE IF NOT EXISTS weight_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    weight REAL NOT NULL, -- in kg
    recorded_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Food Database Table
CREATE TABLE IF NOT EXISTS foods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT,
    serving_size REAL,
    serving_unit TEXT,
    calories INTEGER,
    protein REAL, -- in g
    carbs REAL, -- in g
    fat REAL, -- in g
    fiber REAL, -- in g
    sugar REAL, -- in g
    is_verified BOOLEAN DEFAULT FALSE,
    created_by INTEGER, -- user_id if custom food
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Meal Entries Table
CREATE TABLE IF NOT EXISTS meal_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    meal_type TEXT NOT NULL, -- breakfast, lunch, dinner, snack
    meal_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Food Entries Table (connects meals to foods)
CREATE TABLE IF NOT EXISTS food_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meal_entry_id INTEGER NOT NULL,
    food_id INTEGER NOT NULL,
    servings REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meal_entry_id) REFERENCES meal_entries(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- Exercise Categories Table
CREATE TABLE IF NOT EXISTS exercise_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- Exercises Table
CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    description TEXT,
    difficulty_level TEXT, -- beginner, intermediate, advanced
    muscle_group TEXT, -- primary muscle group targeted
    equipment_needed TEXT,
    instructions TEXT,
    video_url TEXT,
    calories_per_minute REAL, -- estimated calories burned per minute
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES exercise_categories(id) ON DELETE CASCADE
);

-- Workout Plans Table
CREATE TABLE IF NOT EXISTS workout_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    goal_type TEXT NOT NULL, -- weight_loss, muscle_gain, maintenance
    difficulty_level TEXT NOT NULL, -- beginner, intermediate, advanced
    duration_weeks INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workout Days Table
CREATE TABLE IF NOT EXISTS workout_days (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_plan_id INTEGER NOT NULL,
    day_number INTEGER NOT NULL, -- 1-7 for days of the week
    focus_area TEXT, -- e.g., "upper body", "cardio", "rest"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE
);

-- Workout Exercises Table (connects workout days to exercises)
CREATE TABLE IF NOT EXISTS workout_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_day_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    sets INTEGER,
    reps INTEGER,
    duration_minutes INTEGER,
    rest_seconds INTEGER,
    notes TEXT,
    order_index INTEGER NOT NULL, -- for ordering exercises within a workout
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workout_day_id) REFERENCES workout_days(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

-- User Workout Logs Table
CREATE TABLE IF NOT EXISTS user_workout_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    workout_date DATE NOT NULL,
    workout_plan_id INTEGER,
    workout_day_id INTEGER,
    duration_minutes INTEGER,
    calories_burned INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE SET NULL,
    FOREIGN KEY (workout_day_id) REFERENCES workout_days(id) ON DELETE SET NULL
);

-- Exercise Logs Table (details of exercises performed)
CREATE TABLE IF NOT EXISTS exercise_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_workout_log_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    sets_completed INTEGER,
    reps_completed INTEGER,
    weight_used REAL, -- in kg
    duration_minutes INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_workout_log_id) REFERENCES user_workout_logs(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

-- Diet Types Table
CREATE TABLE IF NOT EXISTS diet_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    macronutrient_ratio TEXT, -- e.g., "40-30-30" for 40% carbs, 30% protein, 30% fat
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Diet Plans Table
CREATE TABLE IF NOT EXISTS diet_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    diet_type_id INTEGER NOT NULL,
    description TEXT,
    goal_type TEXT NOT NULL, -- weight_loss, muscle_gain, maintenance
    calorie_range TEXT, -- e.g., "1500-1800"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (diet_type_id) REFERENCES diet_types(id) ON DELETE CASCADE
);

-- Recipes Table
CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    prep_time_minutes INTEGER,
    cook_time_minutes INTEGER,
    servings INTEGER,
    calories_per_serving INTEGER,
    protein_per_serving REAL, -- in g
    carbs_per_serving REAL, -- in g
    fat_per_serving REAL, -- in g
    instructions TEXT,
    image_url TEXT,
    diet_type_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (diet_type_id) REFERENCES diet_types(id) ON DELETE SET NULL
);

-- Recipe Ingredients Table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL,
    food_id INTEGER NOT NULL,
    quantity REAL NOT NULL,
    unit TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- Meal Plans Table
CREATE TABLE IF NOT EXISTS meal_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    diet_plan_id INTEGER NOT NULL,
    day_number INTEGER NOT NULL, -- 1-7 for days of the week
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (diet_plan_id) REFERENCES diet_plans(id) ON DELETE CASCADE
);

-- Meal Plan Items Table
CREATE TABLE IF NOT EXISTS meal_plan_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meal_plan_id INTEGER NOT NULL,
    meal_type TEXT NOT NULL, -- breakfast, lunch, dinner, snack
    recipe_id INTEGER,
    food_id INTEGER,
    servings REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE SET NULL,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL
);

-- User Diet Plans Table (connects users to diet plans)
CREATE TABLE IF NOT EXISTS user_diet_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    diet_plan_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (diet_plan_id) REFERENCES diet_plans(id) ON DELETE CASCADE
);

-- User Workout Plans Table (connects users to workout plans)
CREATE TABLE IF NOT EXISTS user_workout_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    workout_plan_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id INTEGER NOT NULL,
    achieved_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

-- Insert initial data for exercise categories
INSERT INTO exercise_categories (name, description) VALUES
('Strength', 'Exercises focused on building muscle strength and size'),
('Cardio', 'Exercises focused on cardiovascular health and endurance'),
('Flexibility', 'Exercises focused on improving range of motion and flexibility'),
('HIIT', 'High-Intensity Interval Training for efficient calorie burning'),
('Mobility', 'Exercises focused on joint health and movement patterns');

-- Insert initial data for diet types
INSERT INTO diet_types (name, description, macronutrient_ratio) VALUES
('Standard Balanced', 'A balanced diet with moderate amounts of all macronutrients', '50-25-25'),
('Keto', 'High fat, low carb diet designed to achieve ketosis', '5-25-70'),
('Vegan', 'Plant-based diet excluding all animal products', '55-25-20'),
('Paleo', 'Diet based on foods presumed to be available to paleolithic humans', '25-35-40'),
('Mediterranean', 'Diet based on traditional foods from Mediterranean countries', '50-20-30');
