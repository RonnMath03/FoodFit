import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

def generate_user_profiles(num_users=100):
    """Generate synthetic user profile data"""
    
    # Define ranges for user attributes
    age_range = (18, 75)
    weight_range = (45, 120)  # kg
    height_range = (150, 200)  # cm
    genders = ['Male', 'Female', 'Non-binary']
    activity_levels = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active']
    
    dietary_preferences = [
        'None', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 
        'Paleo', 'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'Mediterranean'
    ]
    
    # Generate user data
    users = []
    
    for user_id in range(1, num_users + 1):
        gender = np.random.choice(genders, p=[0.48, 0.48, 0.04])
        age = np.random.randint(*age_range)
        
        # Make height and weight somewhat correlated with gender
        if gender == 'Male':
            height = np.random.normal(177, 7)
            weight = np.random.normal(80, 12)
        elif gender == 'Female':
            height = np.random.normal(165, 6)
            weight = np.random.normal(65, 10)
        else:
            height = np.random.normal(170, 8)
            weight = np.random.normal(70, 12)
        
        # Ensure values are within reasonable ranges
        height = max(min(height, height_range[1]), height_range[0])
        weight = max(min(weight, weight_range[1]), weight_range[0])
        
        # Generate other attributes
        activity_level = np.random.choice(activity_levels)
        dietary_pref = np.random.choice(dietary_preferences)
        
        # Calculate BMR using Mifflin-St Jeor Equation
        if gender == 'Male':
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        else:
            bmr = 10 * weight + 6.25 * height - 5 * age - 161
        
        # Activity factor
        activity_factors = {
            'Sedentary': 1.2,
            'Lightly Active': 1.375,
            'Moderately Active': 1.55,
            'Very Active': 1.725,
            'Extremely Active': 1.9
        }
        
        tdee = bmr * activity_factors[activity_level]  # Total Daily Energy Expenditure
        
        users.append({
            'user_id': user_id,
            'age': age,
            'gender': gender,
            'weight_kg': round(weight, 1),
            'height_cm': round(height, 1),
            'activity_level': activity_level,
            'dietary_preference': dietary_pref,
            'bmr': round(bmr),
            'tdee': round(tdee),
            'created_at': datetime.now().strftime('%Y-%m-%d')
        })
    
    return pd.DataFrame(users)

def generate_food_items(num_items=200):
    """Generate synthetic food item data"""
    
    # Define food categories and types
    food_categories = ['Appetizer', 'Main Course', 'Side Dish', 'Dessert', 'Beverage']
    
    food_types = {
        'Appetizer': ['Salad', 'Soup', 'Dip', 'Finger Food', 'Bread'],
        'Main Course': ['Pasta', 'Rice Dish', 'Meat', 'Fish', 'Vegetarian', 'Pizza', 'Sandwich', 'Burger'],
        'Side Dish': ['Vegetables', 'Potatoes', 'Grains', 'Beans'],
        'Dessert': ['Cake', 'Ice Cream', 'Pastry', 'Fruit', 'Pudding'],
        'Beverage': ['Coffee', 'Tea', 'Smoothie', 'Soda', 'Alcohol', 'Juice', 'Water']
    }
    
    # Typical portion sizes and calorie densities by food type
    portion_ranges = {
        'Salad': (150, 350),
        'Soup': (200, 400),
        'Dip': (50, 150),
        'Finger Food': (100, 250),
        'Bread': (50, 150),
        'Pasta': (250, 450),
        'Rice Dish': (200, 400),
        'Meat': (150, 350),
        'Fish': (150, 300),
        'Vegetarian': (200, 400),
        'Pizza': (300, 500),
        'Sandwich': (200, 400),
        'Burger': (250, 450),
        'Vegetables': (100, 250),
        'Potatoes': (150, 300),
        'Grains': (100, 250),
        'Beans': (150, 300),
        'Cake': (100, 200),
        'Ice Cream': (100, 200),
        'Pastry': (80, 180),
        'Fruit': (100, 250),
        'Pudding': (100, 200),
        'Coffee': (200, 400),
        'Tea': (200, 400),
        'Smoothie': (300, 500),
        'Soda': (300, 500),
        'Alcohol': (200, 400),
        'Juice': (200, 400),
        'Water': (200, 500)
    }
    
    calorie_density_ranges = {
        'Salad': (0.5, 2.0),
        'Soup': (0.5, 1.5),
        'Dip': (2.0, 4.0),
        'Finger Food': (2.0, 4.0),
        'Bread': (2.5, 3.5),
        'Pasta': (1.5, 2.5),
        'Rice Dish': (1.5, 2.5),
        'Meat': (1.5, 3.0),
        'Fish': (1.2, 2.5),
        'Vegetarian': (1.0, 2.0),
        'Pizza': (2.5, 3.5),
        'Sandwich': (2.0, 3.0),
        'Burger': (2.5, 3.5),
        'Vegetables': (0.3, 1.5),
        'Potatoes': (0.8, 2.0),
        'Grains': (1.0, 2.0),
        'Beans': (1.0, 2.0),
        'Cake': (3.0, 4.5),
        'Ice Cream': (2.0, 3.5),
        'Pastry': (3.0, 5.0),
        'Fruit': (0.5, 1.0),
        'Pudding': (1.5, 3.0),
        'Coffee': (0.0, 1.0),
        'Tea': (0.0, 0.5),
        'Smoothie': (0.5, 1.5),
        'Soda': (0.3, 0.5),
        'Alcohol': (0.5, 1.5),
        'Juice': (0.4, 0.8),
        'Water': (0.0, 0.0)
    }
    
    # Create food names
    food_adjectives = ['Spicy', 'Creamy', 'Fresh', 'Grilled', 'Roasted', 'Baked', 'Steamed', 
                      'Fried', 'Sautéed', 'Braised', 'Smoked', 'Stuffed', 'Homemade',
                      'Traditional', 'Signature', 'Seasonal', 'Organic', 'House', 'Chef\'s', 'Classic']
    
    # Generate foods
    foods = []
    food_id = 1
    
    for _ in range(num_items):
        category = np.random.choice(food_categories)
        food_type = np.random.choice(food_types[category])
        
        # Generate a name
        adjective = np.random.choice(food_adjectives) if np.random.rand() > 0.3 else ""
        prefix = f"{adjective} " if adjective else ""
        
        # Simple name generation based on type
        if food_type == 'Pasta':
            name = f"{prefix}{np.random.choice(['Spaghetti', 'Penne', 'Fettuccine', 'Linguine', 'Ravioli'])} {np.random.choice(['Bolognese', 'Carbonara', 'Alfredo', 'Marinara', 'Primavera'])}"
        elif food_type == 'Pizza':
            name = f"{prefix}{np.random.choice(['Margherita', 'Pepperoni', 'Vegetarian', 'Supreme', 'Hawaiian', 'BBQ Chicken', 'Meat Lovers'])} Pizza"
        elif food_type == 'Salad':
            name = f"{prefix}{np.random.choice(['Caesar', 'Greek', 'Garden', 'Cobb', 'Chicken', 'Quinoa', 'Tuna', 'Avocado'])} Salad"
        else:
            name = f"{prefix}{food_type}"
        
        # Get portion and calorie ranges for this food type
        portion_range = portion_ranges.get(food_type, (100, 300))
        calorie_density_range = calorie_density_ranges.get(food_type, (1.0, 3.0))
        
        # Generate values
        standard_portion = round(np.random.uniform(*portion_range))
        calorie_density = round(np.random.uniform(*calorie_density_range), 2)
        calories_per_portion = round(standard_portion * calorie_density)
        
        # Generate macronutrient percentages based on food type
        if food_type in ['Meat', 'Fish', 'Burger']:
            protein_pct = np.random.uniform(0.3, 0.5)
            fat_pct = np.random.uniform(0.3, 0.5)
            carb_pct = 1 - protein_pct - fat_pct
        elif food_type in ['Pasta', 'Rice Dish', 'Bread', 'Grains']:
            carb_pct = np.random.uniform(0.5, 0.7)
            protein_pct = np.random.uniform(0.1, 0.2)
            fat_pct = 1 - carb_pct - protein_pct
        elif food_type in ['Salad', 'Vegetables', 'Fruit']:
            carb_pct = np.random.uniform(0.4, 0.6)
            protein_pct = np.random.uniform(0.1, 0.2)
            fat_pct = 1 - carb_pct - protein_pct
        elif food_type in ['Cake', 'Ice Cream', 'Pastry', 'Pudding']:
            carb_pct = np.random.uniform(0.5, 0.7)
            fat_pct = np.random.uniform(0.2, 0.4)
            protein_pct = 1 - carb_pct - fat_pct
        else:
            protein_pct = np.random.uniform(0.15, 0.25)
            fat_pct = np.random.uniform(0.25, 0.4)
            carb_pct = 1 - protein_pct - fat_pct
        
        # Calculate macros in grams
        protein_g = round((calories_per_portion * protein_pct) / 4)  # 4 calories per gram of protein
        carb_g = round((calories_per_portion * carb_pct) / 4)     # 4 calories per gram of carbs
        fat_g = round((calories_per_portion * fat_pct) / 9)       # 9 calories per gram of fat
        
        foods.append({
            'food_id': food_id,
            'name': name,
            'category': category,
            'food_type': food_type,
            'standard_portion_g': standard_portion,
            'calories_per_portion': calories_per_portion,
            'calories_per_g': calorie_density,
            'protein_g': protein_g,
            'carbohydrates_g': carb_g,
            'fat_g': fat_g
        })
        
        food_id += 1
    
    return pd.DataFrame(foods)

def generate_user_consumption_history(users_df, foods_df, num_records=5000):
    """Generate synthetic consumption history"""
    
    # Define meal types and their probabilities throughout the day
    meal_types = ['Breakfast', 'Lunch', 'Dinner', 'Snack']
    
    # Generate random timestamps within the last 3 months
    end_date = datetime.now()
    start_date = end_date - timedelta(days=90)
    
    # Function to assign a meal type based on the hour of the day
    def assign_meal_type(hour):
        if 5 <= hour < 11:
            return np.random.choice(['Breakfast', 'Snack'], p=[0.85, 0.15])
        elif 11 <= hour < 15:
            return np.random.choice(['Lunch', 'Snack'], p=[0.85, 0.15])
        elif 17 <= hour < 22:
            return np.random.choice(['Dinner', 'Snack'], p=[0.85, 0.15])
        else:
            return 'Snack'
    
    # Function to simulate ordered portion as a factor of standard portion
    def simulate_ordered_portion(user_row, food_row, meal_type):
        # Base portion factor based on gender and TDEE
        if user_row['gender'] == 'Male':
            base_factor = np.random.normal(1.1, 0.2)
        else:
            base_factor = np.random.normal(0.9, 0.2)
        
        # Adjust based on activity level
        activity_adjustments = {
            'Sedentary': -0.1,
            'Lightly Active': 0,
            'Moderately Active': 0.1,
            'Very Active': 0.2,
            'Extremely Active': 0.3
        }
        
        # Adjust based on meal type
        meal_adjustments = {
            'Breakfast': -0.1,
            'Lunch': 0,
            'Dinner': 0.1,
            'Snack': -0.3
        }
        
        # Calculate adjusted factor
        adjusted_factor = base_factor + activity_adjustments[user_row['activity_level']] + meal_adjustments[meal_type]
        
        # Ensure the factor is reasonable
        adjusted_factor = max(min(adjusted_factor, 2.0), 0.5)
        
        return adjusted_factor
    
    # Generate consumption records
    consumption_records = []
    record_id = 1
    
    user_ids = users_df['user_id'].values
    food_ids = foods_df['food_id'].values
    
    for _ in range(num_records):
        # Select a random user and food
        user_id = np.random.choice(user_ids)
        food_id = np.random.choice(food_ids)
        
        user_row = users_df[users_df['user_id'] == user_id].iloc[0]
        food_row = foods_df[foods_df['food_id'] == food_id].iloc[0]
        
        # Generate a random timestamp within the last 3 months
        random_days = np.random.randint(0, 90)
        random_hours = np.random.randint(6, 23)
        random_minutes = np.random.randint(0, 60)
        
        timestamp = start_date + timedelta(days=random_days, hours=random_hours, minutes=random_minutes)
        
        # Assign meal type based on hour
        meal_type = assign_meal_type(timestamp.hour)
        
        # Simulate portion factor
        portion_factor = simulate_ordered_portion(user_row, food_row, meal_type)
        
        # Calculate ordered portion
        ordered_portion = round(food_row['standard_portion_g'] * portion_factor)
        
        # Simulate consumption factor (how much was actually eaten)
        # This will help calculate leftovers
        hunger_level = np.random.randint(1, 6)  # 1: Not hungry, 5: Very hungry
        
        # Adjust consumption based on hunger and other factors
        base_consumption_factor = np.random.normal(0.85, 0.15)  # Most people eat most of their food
        hunger_adjustment = (hunger_level - 3) * 0.1  # +/-0.2 based on hunger
        
        consumption_factor = base_consumption_factor + hunger_adjustment
        consumption_factor = max(min(consumption_factor, 1.0), 0.3)  # Between 30% and 100%
        
        consumed_portion = round(ordered_portion * consumption_factor)
        leftover_portion = ordered_portion - consumed_portion
        
        # Map leftover to categories
        if leftover_portion <= 0:
            leftover_category = 'None'
        elif leftover_portion < ordered_portion * 0.2:
            leftover_category = 'Small'
        elif leftover_portion < ordered_portion * 0.5:
            leftover_category = 'Medium'
        else:
            leftover_category = 'Large'
        
        # Simulate satisfaction rating (1-5)
        # Factors affecting satisfaction: portion size match, hunger level after meal
        base_satisfaction = np.random.normal(3.5, 0.8)
        
        # If there were no leftovers and they were very hungry, they might be less satisfied
        if leftover_category == 'None' and hunger_level > 3:
            portion_adjustment = -0.5
        # If there were large leftovers, they might be less satisfied with portion size
        elif leftover_category == 'Large':
            portion_adjustment = -1.0
        elif leftover_category == 'Medium':
            portion_adjustment = -0.5
        else:
            portion_adjustment = 0
        
        satisfaction_rating = round(base_satisfaction + portion_adjustment)
        satisfaction_rating = max(min(satisfaction_rating, 5), 1)  # Ensure between 1 and 5
        
        # Calculate hunger level after meal
        hunger_after = max(1, hunger_level - (consumed_portion / (user_row['tdee'] / 4)) * 5)
        hunger_after = round(hunger_after)
        
        # Calculate calories consumed
        calories_consumed = round(consumed_portion * food_row['calories_per_g'])
        
        consumption_records.append({
            'record_id': record_id,
            'user_id': user_id,
            'food_id': food_id,
            'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'meal_type': meal_type,
            'standard_portion_g': food_row['standard_portion_g'],
            'ordered_portion_g': ordered_portion,
            'consumed_portion_g': consumed_portion,
            'leftover_g': leftover_portion,
            'leftover_category': leftover_category,
            'calories_consumed': calories_consumed,
            'hunger_level_before': hunger_level,
            'hunger_level_after': hunger_after,
            'satisfaction_rating': satisfaction_rating
        })
        
        record_id += 1
    
    return pd.DataFrame(consumption_records)

def generate_optimal_portion_dataset(consumption_df, users_df, foods_df):
    """Generate dataset with optimal portions based on consumption history"""
    
    # Group by user_id and food_id, and calculate average consumption
    grouped = consumption_df.groupby(['user_id', 'food_id']).agg({
        'standard_portion_g': 'first',
        'ordered_portion_g': 'mean',
        'consumed_portion_g': 'mean',
        'leftover_g': 'mean',
        'leftover_category': lambda x: x.mode()[0] if not x.mode().empty else 'None',
        'satisfaction_rating': 'mean',
        'record_id': 'count'  # Count as frequency
    }).reset_index()
    
    # Filter for items with at least 2 consumption records
    grouped = grouped[grouped['record_id'] >= 2]
    
    # Calculate optimal portion based on consumption patterns
    # If high satisfaction and low leftovers, use consumed portion
    # Otherwise, adjust based on leftovers and satisfaction
    
    def calculate_optimal_portion(row):
        consumed = row['consumed_portion_g']
        ordered = row['ordered_portion_g']
        satisfaction = row['satisfaction_rating']
        leftover = row['leftover_category']
        
        # If high satisfaction and few leftovers, the portion was good
        if satisfaction >= 4 and leftover in ['None', 'Small']:
            return ordered
        
        # If low satisfaction and large leftovers, reduce portion
        elif satisfaction <= 3 and leftover in ['Medium', 'Large']:
            return consumed * 1.1  # Slightly more than what was consumed
        
        # If high satisfaction but medium/large leftovers, reduce portion
        elif satisfaction >= 4 and leftover in ['Medium', 'Large']:
            return consumed * 1.15
        
        # If low satisfaction and no leftovers, increase portion
        elif satisfaction <= 3 and leftover == 'None':
            return ordered * 1.2
        
        # Default: slightly adjust based on consumption
        else:
            return (consumed * 1.1 + ordered * 0.9) / 2
    
    grouped['optimal_portion_g'] = grouped.apply(calculate_optimal_portion, axis=1).round()
    
    # Add additional user and food features for the ML model
    optimal_portions = grouped.copy()
    
    # Add user features
    user_features = users_df[['user_id', 'age', 'gender', 'weight_kg', 'height_cm', 'activity_level', 'tdee']]
    optimal_portions = optimal_portions.merge(user_features, on='user_id')
    
    # Add food features
    food_features = foods_df[['food_id', 'category', 'food_type', 'calories_per_g', 'protein_g', 'carbohydrates_g', 'fat_g']]
    optimal_portions = optimal_portions.merge(food_features, on='food_id')
    
    return optimal_portions

def generate_datasets(num_users=100, num_foods=200, num_consumption_records=5000):
    """Generate all datasets"""
    
    print("Generating user profiles...")
    users_df = generate_user_profiles(num_users)
    
    print("Generating food items...")
    foods_df = generate_food_items(num_foods)
    
    print("Generating consumption history...")
    consumption_df = generate_user_consumption_history(users_df, foods_df, num_consumption_records)
    
    print("Generating optimal portion dataset...")
    optimal_portions_df = generate_optimal_portion_dataset(consumption_df, users_df, foods_df)
    
    # Create a small validation dataset
    val_users = np.random.choice(users_df['user_id'].unique(), size=int(num_users * 0.2), replace=False)
    val_foods = np.random.choice(foods_df['food_id'].unique(), size=int(num_foods * 0.2), replace=False)
    
    # Create validation consumption records - similar to the training process but with fewer records
    val_consumption_df = generate_user_consumption_history(
        users_df[users_df['user_id'].isin(val_users)],
        foods_df[foods_df['food_id'].isin(val_foods)],
        num_records=int(num_consumption_records * 0.2)
    )
    
    print("Saving datasets to CSV...")
    users_df.to_csv('user_profiles.csv', index=False)
    foods_df.to_csv('food_items.csv', index=False)
    consumption_df.to_csv('consumption_history.csv', index=False)
    optimal_portions_df.to_csv('optimal_portions.csv', index=False)
    val_consumption_df.to_csv('validation_consumption.csv', index=False)
    
    print("Dataset generation complete!")
    
    return {
        'users': users_df,
        'foods': foods_df,
        'consumption': consumption_df,
        'optimal_portions': optimal_portions_df,
        'validation': val_consumption_df
    }

if __name__ == "__main__":
    datasets = generate_datasets(num_users=100, num_foods=200, num_consumption_records=5000)
    
    # Print some statistics for verification
    print(f"\nDataset Statistics:")
    print(f"Users: {len(datasets['users'])}")
    print(f"Foods: {len(datasets['foods'])}")
    print(f"Consumption Records: {len(datasets['consumption'])}")
    print(f"Optimal Portion Records: {len(datasets['optimal_portions'])}")
    print(f"Validation Records: {len(datasets['validation'])}")
    
    # Display sample data
    print("\nSample User Profile:")
    print(datasets['users'].sample(1).T)
    
    print("\nSample Food Item:")
    print(datasets['foods'].sample(1).T)
    
    print("\nSample Consumption Record:")
    print(datasets['consumption'].sample(1).T)
    
    print("\nSample Optimal Portion Record:")
    print(datasets['optimal_portions'].sample(1).T)