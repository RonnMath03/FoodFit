import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta

# ML libraries
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score, classification_report, accuracy_score
from sklearn.neighbors import NearestNeighbors
from xgboost import XGBRegressor

# For recommendation system
from scipy.spatial.distance import cosine
from sklearn.metrics.pairwise import cosine_similarity

# Set random seed for reproducibility
np.random.seed(42)

class FoodFitML:
    def __init__(self, data_path='datasets/'):
        """Initialize the ML system with the dataset paths"""
        self.data_path = data_path
        self.users_df = None
        self.foods_df = None
        self.consumption_df = None
        self.optimal_portions_df = None
        self.validation_df = None
        
        # Models
        self.portion_model = None
        self.waste_model = None
        self.scaler = StandardScaler()
        
        # Load data
        self.load_data()
    
    def load_data(self):
        """Load all datasets"""
        print("Loading datasets...")
        self.users_df = pd.read_csv(f'{self.data_path}user_profiles.csv')
        self.foods_df = pd.read_csv(f'{self.data_path}food_items.csv')
        self.consumption_df = pd.read_csv(f'{self.data_path}consumption_history.csv')
        self.optimal_portions_df = pd.read_csv(f'{self.data_path}optimal_portions.csv')
        self.validation_df = pd.read_csv(f'{self.data_path}validation_consumption.csv')
        
        # Convert timestamps to datetime
        self.consumption_df['timestamp'] = pd.to_datetime(self.consumption_df['timestamp'])
        self.validation_df['timestamp'] = pd.to_datetime(self.validation_df['timestamp'])
        
        print(f"Loaded {len(self.users_df)} users, {len(self.foods_df)} foods, and {len(self.consumption_df)} consumption records.")
    
    def feature_engineering(self):
        """Create relevant features for ML models"""
        print("Performing feature engineering...")
        
        # 1. Calculate time since last meal for each user
        self.consumption_df = self.consumption_df.sort_values(['user_id', 'timestamp'])
        self.consumption_df['prev_meal_time'] = self.consumption_df.groupby('user_id')['timestamp'].shift(1)
        self.consumption_df['time_since_last_meal'] = (self.consumption_df['timestamp'] - 
                                                    self.consumption_df['prev_meal_time']).dt.total_seconds() / 3600
        
        # Handle NaN values (first meal of a user)
        self.consumption_df['time_since_last_meal'] = self.consumption_df['time_since_last_meal'].fillna(8.0)  # Assume 8 hours
        
        # 2. Extract time-related features
        self.consumption_df['hour'] = self.consumption_df['timestamp'].dt.hour
        self.consumption_df['day_of_week'] = self.consumption_df['timestamp'].dt.dayofweek
        self.consumption_df['is_weekend'] = self.consumption_df['day_of_week'].isin([5, 6]).astype(int)
        
        # Apply the same transformations to validation data
        self.validation_df = self.validation_df.sort_values(['user_id', 'timestamp'])
        self.validation_df['prev_meal_time'] = self.validation_df.groupby('user_id')['timestamp'].shift(1)
        self.validation_df['time_since_last_meal'] = (self.validation_df['timestamp'] - 
                                                  self.validation_df['prev_meal_time']).dt.total_seconds() / 3600
        self.validation_df['time_since_last_meal'] = self.validation_df['time_since_last_meal'].fillna(8.0)
        self.validation_df['hour'] = self.validation_df['timestamp'].dt.hour
        self.validation_df['day_of_week'] = self.validation_df['timestamp'].dt.dayofweek
        self.validation_df['is_weekend'] = self.validation_df['day_of_week'].isin([5, 6]).astype(int)
        
        # 3. Merge user and food features into consumption data
        self.consumption_features = self.consumption_df.merge(
            self.users_df[['user_id', 'age', 'gender', 'weight_kg', 'height_cm', 'activity_level', 'tdee']], 
            on='user_id'
        ).merge(
            self.foods_df[['food_id', 'category', 'food_type', 'calories_per_g', 'protein_g', 'carbohydrates_g', 'fat_g']],
            on='food_id'
        )
        
        # Same for validation data
        self.validation_features = self.validation_df.merge(
            self.users_df[['user_id', 'age', 'gender', 'weight_kg', 'height_cm', 'activity_level', 'tdee']], 
            on='user_id'
        ).merge(
            self.foods_df[['food_id', 'category', 'food_type', 'calories_per_g', 'protein_g', 'carbohydrates_g', 'fat_g']],
            on='food_id'
        )
        
        # 4. Calculate BMR from scratch (even though it exists in user profiles)
        def calculate_bmr(row):
            if row['gender'] == 'Male':
                return 10 * row['weight_kg'] + 6.25 * row['height_cm'] - 5 * row['age'] + 5
            else:  # Female or Non-binary
                return 10 * row['weight_kg'] + 6.25 * row['height_cm'] - 5 * row['age'] - 161
        
        self.consumption_features['calculated_bmr'] = self.consumption_features.apply(calculate_bmr, axis=1)
        self.validation_features['calculated_bmr'] = self.validation_features.apply(calculate_bmr, axis=1)
        
        # 5. Calculate calorie ratio (calories of meal / daily requirement)
        self.consumption_features['calorie_ratio'] = self.consumption_features['calories_consumed'] / self.consumption_features['tdee']
        self.validation_features['calorie_ratio'] = self.validation_features['calories_consumed'] / self.validation_features['tdee']
        
        # 6. Calculate macronutrient ratios
        self.foods_df['protein_ratio'] = self.foods_df['protein_g'] / (self.foods_df['protein_g'] + self.foods_df['carbohydrates_g'] + self.foods_df['fat_g'])
        self.foods_df['carb_ratio'] = self.foods_df['carbohydrates_g'] / (self.foods_df['protein_g'] + self.foods_df['carbohydrates_g'] + self.foods_df['fat_g'])
        self.foods_df['fat_ratio'] = self.foods_df['fat_g'] / (self.foods_df['protein_g'] + self.foods_df['carbohydrates_g'] + self.foods_df['fat_g'])
        
        # Fill NaN values
        self.foods_df[['protein_ratio', 'carb_ratio', 'fat_ratio']] = self.foods_df[['protein_ratio', 'carb_ratio', 'fat_ratio']].fillna(0)
        
        # 7. Create consumption history features
        user_food_history = self.consumption_df.groupby(['user_id', 'food_id']).agg({
            'record_id': 'count',
            'consumed_portion_g': 'mean',
            'ordered_portion_g': 'mean',
            'leftover_g': 'mean',
            'satisfaction_rating': 'mean'
        }).reset_index()
        
        user_food_history.rename(columns={
            'record_id': 'frequency',
            'consumed_portion_g': 'avg_consumed',
            'ordered_portion_g': 'avg_ordered',
            'leftover_g': 'avg_leftover',
            'satisfaction_rating': 'avg_satisfaction'
        }, inplace=True)
        
        # 8. Meal type one-hot encoding - FIXED VERSION
        meal_type_dummies = pd.get_dummies(self.consumption_features['meal_type'], prefix='meal')
        expected_meal_types = ['meal_Breakfast', 'meal_Lunch', 'meal_Dinner', 'meal_Snack']
        for meal_type in expected_meal_types:
            if meal_type not in meal_type_dummies.columns:
                meal_type_dummies[meal_type] = 0
        self.consumption_features = pd.concat([self.consumption_features, meal_type_dummies], axis=1)
        
        # Do the same for validation data
        meal_type_dummies_val = pd.get_dummies(self.validation_features['meal_type'], prefix='meal')
        for meal_type in expected_meal_types:
            if meal_type not in meal_type_dummies_val.columns:
                meal_type_dummies_val[meal_type] = 0
        self.validation_features = pd.concat([self.validation_features, meal_type_dummies_val], axis=1)
        
        # 9. Create food similarity matrix for recommendation system
        print("Calculating food similarity matrix...")
        food_features = self.foods_df[[
            'calories_per_g', 'protein_g', 'carbohydrates_g', 'fat_g', 
            'protein_ratio', 'carb_ratio', 'fat_ratio'
        ]].values
        
        # Scale food features
        food_features_scaled = self.scaler.fit_transform(food_features)
        self.food_similarity = cosine_similarity(food_features_scaled)
        
        print("Feature engineering complete!")
        return self.consumption_features

    def train_portion_prediction_model(self):
        """Train a model to predict optimal portion sizes"""
        print("Training portion prediction model...")
        
        # Features to use for portion prediction
        feature_cols = [
            'age', 'weight_kg', 'height_cm', 'tdee', 'calculated_bmr',
            'time_since_last_meal', 'hour', 'is_weekend', 'hunger_level_before',
            'calories_per_g', 'meal_Breakfast', 'meal_Lunch', 'meal_Dinner', 'meal_Snack'
        ]
        
        # Encode categorical variables
        categorical_features = ['gender', 'activity_level', 'food_type', 'category']
        categorical_transformer = OneHotEncoder(handle_unknown='ignore')
        
        preprocessor = ColumnTransformer(
            transformers=[
                ('cat', categorical_transformer, categorical_features)
            ],
            remainder='passthrough'
        )
        
        # Prepare data - use optimal_portions dataset
        X = self.optimal_portions_df.drop(['optimal_portion_g', 'record_id', 'standard_portion_g',
                                          'ordered_portion_g', 'consumed_portion_g', 'leftover_g',
                                          'leftover_category', 'satisfaction_rating'], axis=1)
        y = self.optimal_portions_df['optimal_portion_g']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Create and train the model
        model = Pipeline([
            ('preprocessor', preprocessor),
            ('regressor', GradientBoostingRegressor(n_estimators=100, random_state=42))
        ])
        
        model.fit(X_train, y_train)
        
        # Evaluate the model
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"Portion Prediction Model - MSE: {mse:.2f}, R2: {r2:.2f}")
        
        self.portion_model = model
        return model
    
    def train_waste_prediction_model(self):
        """Train a model to predict the likelihood of food waste"""
        print("Training waste prediction model...")
        
        # Define features for waste prediction
        feature_cols = [
            'age', 'weight_kg', 'height_cm', 'tdee', 'hour', 'day_of_week',
            'is_weekend', 'hunger_level_before', 'time_since_last_meal',
            'ordered_portion_g', 'calories_per_g', 'protein_g', 'carbohydrates_g', 'fat_g',
            'meal_Breakfast', 'meal_Lunch', 'meal_Dinner', 'meal_Snack'
        ]
        
        # Create target: whether there will be significant waste (Medium or Large leftover)
        self.consumption_features['significant_waste'] = self.consumption_features['leftover_category'].isin(['Medium', 'Large']).astype(int)
        
        # Prepare data
        X = self.consumption_features[feature_cols]
        y = self.consumption_features['significant_waste']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train the model
        waste_model = RandomForestClassifier(n_estimators=100, random_state=42)
        waste_model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = waste_model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Waste Prediction Model - Accuracy: {accuracy:.2f}")
        print(classification_report(y_test, y_pred))
        
        self.waste_model = waste_model
        return waste_model
    
    def build_recommendation_system(self):
        """Build a recommendation system for alternative meal combinations"""
        print("Building recommendation system...")
        
        # Create user preference profiles based on consumption history
        user_food_ratings = self.consumption_df.pivot_table(
            index='user_id',
            columns='food_id',
            values='satisfaction_rating',
            aggfunc='mean'
        ).fillna(0)
        
        # Create user-food matrix for collaborative filtering
        self.user_food_matrix = user_food_ratings.values
        self.user_ids = user_food_ratings.index.tolist()
        self.food_ids = user_food_ratings.columns.tolist()
        
        # Use KNN for user similarity
        self.user_recommender = NearestNeighbors(
            n_neighbors=5, 
            algorithm='brute', 
            metric='cosine'
        )
        self.user_recommender.fit(self.user_food_matrix)
        
        print("Recommendation system ready!")
        return self.user_recommender
    
    def recommend_alternative_meals(self, user_id, meal_type, excluded_food_ids=None, n_recommendations=3):
        """Recommend alternative meals for a user"""
        if excluded_food_ids is None:
            excluded_food_ids = []
            
        # Get user's position in the matrix
        try:
            user_idx = self.user_ids.index(user_id)
        except ValueError:
            print(f"User {user_id} not found in training data")
            return None
        
        # Find similar users
        distances, indices = self.user_recommender.kneighbors([self.user_food_matrix[user_idx]])
        similar_user_indices = indices.flatten()[1:]  # Exclude the user themselves
        
        # Get the foods these similar users rated highly
        similar_users_ratings = self.user_food_matrix[similar_user_indices]
        
        # Get average ratings for each food from similar users
        food_scores = np.mean(similar_users_ratings, axis=0)
        
        # Create dataframe with food scores
        food_score_df = pd.DataFrame({
            'food_id': self.food_ids,
            'score': food_scores
        })
        
        # Filter by meal type and exclude specified foods
        meal_foods = self.foods_df[
            (self.foods_df['food_id'].isin(self.food_ids)) & 
            ~(self.foods_df['food_id'].isin(excluded_food_ids))
        ]
        
        # Map category to meal type (approximate)
        meal_type_mapping = {
            'Breakfast': ['Appetizer', 'Side Dish'],
            'Lunch': ['Main Course', 'Side Dish', 'Appetizer'],
            'Dinner': ['Main Course', 'Side Dish', 'Appetizer', 'Dessert'],
            'Snack': ['Appetizer', 'Dessert', 'Beverage']
        }
        
        relevant_categories = meal_type_mapping.get(meal_type, ['Main Course'])
        relevant_foods = meal_foods[meal_foods['category'].isin(relevant_categories)]
        
        # Merge with scores
        food_recommendations = relevant_foods.merge(food_score_df, on='food_id')
        
        # Sort by score and return top recommendations
        food_recommendations = food_recommendations.sort_values('score', ascending=False).head(n_recommendations)
        
        return food_recommendations[['food_id', 'name', 'category', 'food_type', 'score']]
    
    def predict_optimal_portion(self, user_id, food_id, meal_type, hunger_level=3):
        """Predict optimal portion size for a specific user and food"""
        # Get user and food data
        user_data = self.users_df[self.users_df['user_id'] == user_id].iloc[0]
        food_data = self.foods_df[self.foods_df['food_id'] == food_id].iloc[0]
        
        # Create a feature vector
        features = {
            'user_id': user_id,
            'food_id': food_id,
            'age': user_data['age'],
            'gender': user_data['gender'],
            'weight_kg': user_data['weight_kg'],
            'height_cm': user_data['height_cm'],
            'activity_level': user_data['activity_level'],
            'tdee': user_data['tdee'],
            'category': food_data['category'],
            'food_type': food_data['food_type'],
            'calories_per_g': food_data['calories_per_g'],
            'protein_g': food_data['protein_g'],
            'carbohydrates_g': food_data['carbohydrates_g'],
            'fat_g': food_data['fat_g'],
            'hour': datetime.now().hour,
            'is_weekend': datetime.now().weekday() >= 5,
            'hunger_level_before': hunger_level,
            'time_since_last_meal': 4.0  # Default assumption
        }
        
        # Create DataFrame from features
        feature_df = pd.DataFrame([features])
        
        # Make prediction
        if self.portion_model:
            optimal_portion = self.portion_model.predict(feature_df)[0]
            return round(optimal_portion)
        else:
            print("Portion model not trained yet. Call train_portion_prediction_model() first.")
            return None
    
    def predict_waste_likelihood(self, user_id, food_id, portion_size, meal_type, hunger_level=3):
        """Predict the likelihood of waste for a given meal scenario"""
        # Get user and food data
        user_data = self.users_df[self.users_df['user_id'] == user_id].iloc[0]
        food_data = self.foods_df[self.foods_df['food_id'] == food_id].iloc[0]
        
        # Create dummy variables for meal type
        meal_dummies = {'meal_Breakfast': 0, 'meal_Lunch': 0, 'meal_Dinner': 0, 'meal_Snack': 0}
        meal_key = f'meal_{meal_type}'
        if meal_key in meal_dummies:
            meal_dummies[meal_key] = 1
        
        # Create a feature vector
        features = {
            'age': user_data['age'],
            'weight_kg': user_data['weight_kg'],
            'height_cm': user_data['height_cm'],
            'tdee': user_data['tdee'],
            'hour': datetime.now().hour,
            'day_of_week': datetime.now().weekday(),
            'is_weekend': datetime.now().weekday() >= 5,
            'hunger_level_before': hunger_level,
            'time_since_last_meal': 4.0,  # Default assumption
            'ordered_portion_g': portion_size,
            'calories_per_g': food_data['calories_per_g'],
            'protein_g': food_data['protein_g'],
            'carbohydrates_g': food_data['carbohydrates_g'],
            'fat_g': food_data['fat_g'],
            **meal_dummies
        }
        
        # Create DataFrame from features
        feature_df = pd.DataFrame([features])
        
        # Make prediction
        if self.waste_model:
            waste_probability = self.waste_model.predict_proba(feature_df)[0, 1]
            waste_prediction = self.waste_model.predict(feature_df)[0]
            
            return {
                'waste_probability': waste_probability,
                'likely_waste': waste_prediction == 1
            }
        else:
            print("Waste model not trained yet. Call train_waste_prediction_model() first.")
            return None
    
    def incorporate_feedback(self, user_id, food_id, ordered_portion, consumed_portion, 
                            leftover, satisfaction, hunger_before, hunger_after):
        """Update models with new user feedback data"""
        print("Incorporating user feedback...")
        
        # Get user and food information
        user_info = self.users_df[self.users_df['user_id'] == user_id].iloc[0]
        food_info = self.foods_df[self.foods_df['food_id'] == food_id].iloc[0]
        
        # Create new feedback entry
        new_feedback = {
            'user_id': user_id,
            'food_id': food_id,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'meal_type': 'Unknown',  # Would need to be provided
            'standard_portion_g': food_info['standard_portion_g'],
            'ordered_portion_g': ordered_portion,
            'consumed_portion_g': consumed_portion,
            'leftover_g': leftover,
            'leftover_category': self._categorize_leftover(leftover, ordered_portion),
            'calories_consumed': round(consumed_portion * food_info['calories_per_g']),
            'hunger_level_before': hunger_before,
            'hunger_level_after': hunger_after,
            'satisfaction_rating': satisfaction
        }
        
        # Add to consumption history
        self.consumption_df = pd.concat([self.consumption_df, pd.DataFrame([new_feedback])], ignore_index=True)
        
        # In a real system, we would:
        # 1. Store this feedback in the database
        # 2. Periodically retrain models with new data
        # 3. Update user profiles based on feedback
        
        print("Feedback incorporated. Consider retraining models with new data.")
    
    def _categorize_leftover(self, leftover, ordered_portion):
        """Categorize leftover amount"""
        if leftover <= 0:
            return 'None'
        elif leftover < ordered_portion * 0.2:
            return 'Small'
        elif leftover < ordered_portion * 0.5:
            return 'Medium'
        else:
            return 'Large'
    
    def visualize_user_waste_patterns(self, user_id):
        """Visualize waste patterns for a specific user"""
        user_consumption = self.consumption_df[self.consumption_df['user_id'] == user_id]
        
        if user_consumption.empty:
            print(f"No consumption data for user {user_id}")
            return
        
        # Calculate waste percentage
        user_consumption['waste_pct'] = user_consumption['leftover_g'] / user_consumption['ordered_portion_g'] * 100
        
        # Set up the plot
        plt.figure(figsize=(15, 10))
        
        # Plot 1: Waste by meal type
        plt.subplot(2, 2, 1)
        sns.boxplot(x='meal_type', y='waste_pct', data=user_consumption)
        plt.title(f'Food Waste % by Meal Type for User {user_id}')
        plt.ylabel('Waste %')
        plt.xlabel('Meal Type')
        
        # Plot 2: Waste by food category
        user_food_data = user_consumption.merge(self.foods_df[['food_id', 'category']], on='food_id')
        plt.subplot(2, 2, 2)
        sns.boxplot(x='category', y='waste_pct', data=user_food_data)
        plt.title(f'Food Waste % by Food Category for User {user_id}')
        plt.ylabel('Waste %')
        plt.xlabel('Food Category')
        plt.xticks(rotation=45)
        
        # Plot 3: Waste over time
        plt.subplot(2, 2, 3)
        user_consumption['date'] = user_consumption['timestamp'].dt.date
        avg_waste_by_date = user_consumption.groupby('date')['waste_pct'].mean().reset_index()
        plt.plot(avg_waste_by_date['date'], avg_waste_by_date['waste_pct'], marker='o')
        plt.title(f'Average Waste % Over Time for User {user_id}')
        plt.ylabel('Average Waste %')
        plt.xlabel('Date')
        plt.xticks(rotation=45)
        
        # Plot 4: Correlation between hunger level and waste
        plt.subplot(2, 2, 4)
        sns.scatterplot(x='hunger_level_before', y='waste_pct', data=user_consumption)
        plt.title(f'Hunger Level vs. Waste % for User {user_id}')
        plt.ylabel('Waste %')
        plt.xlabel('Hunger Level Before Meal')
        
        plt.tight_layout()
        plt.savefig(f'user_{user_id}_waste_analysis.png')
        plt.show()
        
if __name__ == "__main__":
    # Create the FoodFit ML system
    foodfit_ml = FoodFitML()
    
    # Run feature engineering
    foodfit_ml.feature_engineering()
    
    # Train models
    portion_model = foodfit_ml.train_portion_prediction_model()
    waste_model = foodfit_ml.train_waste_prediction_model()
    
    # Build recommendation system
    recommender = foodfit_ml.build_recommendation_system()
    
    # Demo: Make predictions and recommendations for a user
    test_user_id = 1
    test_food_id = 10
    
    # Predict optimal portion
    optimal_portion = foodfit_ml.predict_optimal_portion(test_user_id, test_food_id, 'Dinner', hunger_level=4)
    print(f"Recommended portion for user {test_user_id}, food {test_food_id}: {optimal_portion}g")
    
    # Predict waste likelihood
    waste_prediction = foodfit_ml.predict_waste_likelihood(test_user_id, test_food_id, optimal_portion, 'Dinner', hunger_level=4)
    print(f"Waste prediction: {waste_prediction}")
    
    # Get alternative meal recommendations
    recommendations = foodfit_ml.recommend_alternative_meals(test_user_id, 'Dinner', [test_food_id])
    print("\nRecommended alternative meals:")
    print(recommendations)
    
    # Visualize waste patterns
    foodfit_ml.visualize_user_waste_patterns(test_user_id)
    
    print("\nFoodFit ML system successfully implemented!")