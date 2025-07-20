import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import pandas as pd

from statisticaldrafting.draftassistant import DraftModel, list_sets
from statisticaldrafting import model as sd

# Get the absolute path to the project root directory
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(PROJECT_ROOT, 'data')
CARDS_DIR = os.path.join(DATA_DIR, 'cards')
MODELS_DIR = os.path.join(DATA_DIR, 'models')

app = Flask(__name__)
CORS(app)

# Global cache for draft models to avoid reloading
model_cache = {}


class ServerDraftModel(DraftModel):
    """Custom DraftModel that uses absolute paths"""
    def __init__(self, set: str = "FDN", draft_mode: str = "Premier"):
        # Override the initialization to use absolute paths
        self.set = set
        
        # Use absolute path for card data
        cards_path = os.path.join(CARDS_DIR, f"{self.set}.csv")
        self.pick_table = pd.read_csv(cards_path)
        self.cardnames = self.pick_table["name"].tolist()
        
        # Use absolute path for model
        model_path = os.path.join(MODELS_DIR, f"{set}_{draft_mode}.pt")
        self.network = sd.DraftNet(cardnames=self.cardnames)
        self.network.load_state_dict(torch.load(model_path))
        
        # Assign p1p1 ratings
        self.pick_table["p1p1_rating"] = self.get_card_ratings([])
        self.pick_table["synergy"] = [0.0] * len(self.pick_table)
        self.pick_table["rating"] = [0.0] * len(self.pick_table)


def get_model(set_code, draft_mode="Premier"):
    """Get or create a model for the specified set and draft mode"""
    cache_key = f"{set_code}_{draft_mode}"
    if cache_key not in model_cache:
        try:
            model_cache[cache_key] = ServerDraftModel(set=set_code, draft_mode=draft_mode)
        except Exception as e:
            return None, str(e)
    return model_cache[cache_key], None


@app.route('/available-sets', methods=['GET'])
def available_sets():
    """Return a list of available sets"""
    try:
        sets = list_sets(model_path=MODELS_DIR)
        return jsonify({
            "status": "success",
            "sets": sets
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/pick-order', methods=['GET'])
def pick_order():
    """Provide card pick recommendations during drafting"""
    # Get parameters from query string
    set_code = request.args.get('set')
    draft_mode = request.args.get('draft_mode', 'Premier')
    collection_str = request.args.get('collection', '')
    
    # Validate input
    if not set_code:
        return jsonify({
            "status": "error",
            "message": "Missing required parameters: set"
        }), 400
    
    # Parse collection from comma-separated string
    collection = collection_str.split(',') if collection_str else []
    
    # Get model
    model, error = get_model(set_code, draft_mode)
    if error:
        return jsonify({
            "status": "error",
            "message": f"Error loading model: {error}"
        }), 500
    
    try:
        # Get pick order
        pick_order_df = model.get_pick_order(collection)
        
        # Convert to dict for JSON response
        result = pick_order_df.to_dict(orient='records')
        
        return jsonify({
            "status": "success",
            "pick_order": result
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/build-deck', methods=['GET'])
def build_deck():
    """Construct optimal deck recommendations from a card pool"""
    # Get parameters from query string
    set_code = request.args.get('set')
    draft_mode = request.args.get('draft_mode', 'Premier')
    pool_str = request.args.get('pool', '')
    starting_colors = request.args.get('starting_colors', "")
    
    # Validate input
    if not set_code or not pool_str:
        return jsonify({
            "status": "error",
            "message": "Missing required parameters: set, pool"
        }), 400
    
    # Parse pool from comma-separated string
    pool = pool_str.split(',') if pool_str else []
    
    # Get model
    model, error = get_model(set_code, draft_mode)
    if error:
        return jsonify({
            "status": "error",
            "message": f"Error loading model: {error}"
        }), 500
    
    try:
        # Get deck recommendation
        deck_df = model.get_deck_recommendation(pool, starting_colors)
        
        # Convert to dict for JSON response
        result = deck_df.to_dict(orient='records')
        
        return jsonify({
            "status": "success",
            "deck": result
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == '__main__':
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)