import requests
import json

# Base URL for the server
BASE_URL = 'http://localhost:5000'

def test_available_sets():
    """Test the /available-sets endpoint"""
    print("\nTesting /available-sets endpoint...")
    response = requests.get(f'{BASE_URL}/available-sets')
    if response.status_code == 200:
        data = response.json()
        print(f"Status: {data['status']}")
        print(f"Available sets: {', '.join(data['sets'])}")
        return data['sets']
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return []

def test_pick_order(set_code, collection=None):
    """Test the /pick-order endpoint"""
    if collection is None:
        collection = []
    
    print(f"\nTesting /pick-order endpoint with set {set_code}...")
    payload = {
        'set': set_code,
        'collection': collection
    }
    response = requests.post(f'{BASE_URL}/pick-order', json=payload)
    if response.status_code == 200:
        data = response.json()
        print(f"Status: {data['status']}")
        print(f"Top 5 picks:")
        for i, card in enumerate(data['pick_order'][:5]):
            print(f"  {i+1}. {card['name']} ({card['color_identity']}) - Rating: {card['rating']}")
        return data['pick_order']
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return []

def test_build_deck(set_code, pool, starting_colors=""):
    """Test the /build-deck endpoint"""
    print(f"\nTesting /build-deck endpoint with set {set_code}...")
    payload = {
        'set': set_code,
        'pool': pool,
        'starting_colors': starting_colors
    }
    response = requests.post(f'{BASE_URL}/build-deck', json=payload)
    if response.status_code == 200:
        data = response.json()
        print(f"Status: {data['status']}")
        print(f"Top 10 cards in deck:")
        for i, card in enumerate(data['deck'][:10]):
            print(f"  {i+1}. {card['name']} ({card['color_identity']}) - Rating: {card['rating']}")
        return data['deck']
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return []

def main():
    print("Statistical Drafting Server Test")
    print("=================================")
    
    # Test available sets
    sets = test_available_sets()
    if not sets:
        print("No sets available or server not running. Exiting.")
        return
    
    # Use the first available set for testing
    test_set = sets[0]
    
    # Test pick order with empty collection
    pick_order = test_pick_order(test_set)
    
    # Test pick order with a collection (using top 2 cards from previous result)
    if pick_order:
        collection = [pick_order[0]['name'], pick_order[1]['name']]
        test_pick_order(test_set, collection)
    
    # Test build deck (using top 20 cards from pick order as a simulated pool)
    if pick_order:
        pool = [card['name'] for card in pick_order[:20]]
        test_build_deck(test_set, pool)
        
        # Test with starting colors
        colors = pick_order[0]['color_identity']
        if colors and colors != 'Multicolor':
            test_build_deck(test_set, pool, colors)

if __name__ == "__main__":
    main()