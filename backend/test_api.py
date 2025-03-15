import requests
import json
from pprint import pprint

# API base URL
BASE_URL = "http://localhost:5000"

def test_health():
    """Test the health endpoint"""
    print("\n===== Testing /health endpoint =====")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status code: {response.status_code}")
    pprint(response.json())
    return response.json()

def test_predict_portion():
    """Test the predict_portion endpoint"""
    print("\n===== Testing /predict_portion endpoint =====")
    payload = {
        "user_id": "1",  # Valid user ID from dataset 
        "food_id": "1",  # Valid food ID from dataset 
        "meal_type": "Dinner",  # Valid meal types: Breakfast, Lunch, Dinner, Snack
        "hunger_level": 5   # Valid hunger levels: 1-5
    }
    print("Request payload:")
    pprint(payload)
    
    response = requests.post(f"{BASE_URL}/predict_portion", json=payload)
    print(f"Status code: {response.status_code}")
    pprint(response.json())
    return response.json()

def test_predict_waste():
    """Test the predict_waste endpoint"""
    print("\n===== Testing /predict_waste endpoint =====")
    payload = {
        "user_id": "23",
        "food_id": "128",
        "portion_size": 500,  # Reasonable portion size in grams
        "meal_type": "Dinner",
        "hunger_level": 1
    }
    print("Request payload:")
    pprint(payload)
    
    response = requests.post(f"{BASE_URL}/predict_waste", json=payload)
    print(f"Status code: {response.status_code}")
    pprint(response.json())
    return response.json()

def test_recommend_meals():
    """Test the recommend_meals endpoint"""
    print("\n===== Testing /recommend_meals endpoint =====")
    payload = {
        "user_id": "78",
        "meal_type": "Breakfast",
        "excluded_foods": ["45", "122"]  # Valid food IDs to exclude
    }
    print("Request payload:")
    pprint(payload)
    
    response = requests.post(f"{BASE_URL}/recommend_meals", json=payload)
    print(f"Status code: {response.status_code}")
    pprint(response.json())
    return response.json()

def save_results(results, filename="api_results.json"):
    """Save all API results to a JSON file"""
    with open(filename, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\nResults saved to {filename}")

def main():
    """Run all tests and collect results"""
    print("Starting API tests...")
    
    # Make sure the Flask server is running first
    try:
        results = {
            "health": test_health(),
            "predict_portion": test_predict_portion(),
            "predict_waste": test_predict_waste(),
            "recommend_meals": test_recommend_meals()
        }
        save_results(results)
        print("\n✅ All tests completed successfully!")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Cannot connect to the API server.")
        print("   Make sure the Flask server is running on http://localhost:5000")
    except Exception as e:
        print(f"\n❌ Error occurred: {str(e)}")

if __name__ == "__main__":
    main()