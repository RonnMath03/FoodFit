from flask import Flask, request, jsonify
from flask_cors import CORS
from MLcode import FoodFitML

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the ML model
foodfit_ml = FoodFitML()

# Initialize ML components
print("Initializing ML components...")
foodfit_ml.feature_engineering()
foodfit_ml.train_portion_prediction_model()
foodfit_ml.train_waste_prediction_model()
foodfit_ml.build_recommendation_system()
print("ML components initialized successfully!")

# API Endpoints
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "running"})

@app.route('/predict_portion', methods=['POST'])
def predict_portion():
    data = request.json
    user_id = int(data.get('user_id'))  # Convert to int here
    food_id = int(data.get('food_id'))  # Convert to int here
    meal_type = data.get('meal_type', 'Dinner')
    hunger_level = data.get('hunger_level', 3)

    if not user_id or not food_id:
        return jsonify({"error": "Missing user_id or food_id"}), 400

    portion = foodfit_ml.predict_optimal_portion(user_id, food_id, meal_type, hunger_level)
    return jsonify({"optimal_portion_g": portion})

@app.route('/predict_waste', methods=['POST'])
def predict_waste():
    data = request.json
    user_id = int(data.get('user_id'))
    food_id = int(data.get('food_id'))
    portion_size = data.get('portion_size')
    meal_type = data.get('meal_type', 'Dinner')
    hunger_level = data.get('hunger_level', 3)

    if not user_id or not food_id or not portion_size:
        return jsonify({"error": "Missing required fields"}), 400

    waste_prediction = foodfit_ml.predict_waste_likelihood(user_id, food_id, portion_size, meal_type, hunger_level)
    
    # Handle None return value
    if waste_prediction is None:
        return jsonify({"waste_probability": 0, "likely_waste": 0})
    
    # Convert boolean to int for JSON serialization
    if isinstance(waste_prediction, dict) and 'likely_waste' in waste_prediction:
        waste_prediction['likely_waste'] = int(waste_prediction['likely_waste'])
    
    return jsonify(waste_prediction)

@app.route('/recommend_meals', methods=['POST'])
def recommend_meals():
    data = request.json
    user_id = int(data.get('user_id'))
    meal_type = data.get('meal_type', 'Dinner')
    excluded_foods = data.get('excluded_foods', [])

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    recommendations = foodfit_ml.recommend_alternative_meals(user_id, meal_type, excluded_foods)
    # Fixed: wrap DataFrame's JSON string in a proper response
    return jsonify(recommendations.to_dict(orient='records'))

# Run Flask app
if __name__ == '__main__':  # Fixed: double underscores
    app.run(host='0.0.0.0', port=5000, debug=True)