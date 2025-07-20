# Statistical Drafting Flask Server

This Flask server provides an API for the Statistical Drafting model, allowing you to get card pick recommendations during drafting and construct optimal deck recommendations from a card pool.

## Setup

### Option 1: Using a Virtual Environment (Recommended)

1. Run the setup script to create a virtual environment and install dependencies:

```bash
chmod +x setup_venv.sh
./setup_venv.sh
```

2. Activate the virtual environment (if not already activated by the script):

```bash
source venv/bin/activate
```

3. Run the server:

```bash
python server.py
```

4. When you're done, you can deactivate the virtual environment:

```bash
deactivate
```

### Option 2: Direct Installation

1. Install the required dependencies directly:

```bash
pip install -r requirements.txt
```

2. Run the server:

```bash
python server.py
```

By default, the server will run on port 5000. You can change this by setting the `PORT` environment variable.

## API Endpoints

### GET /available-sets

Returns a list of available sets.

**Response:**

```json
{
  "status": "success",
  "sets": ["BLB", "BRO", "DFT", "DMU", "DSK", "FDN", "FIN", "KTK", "LCI", "LTR", "MH3", "MID", "MKM", "MOM", "NEO", "ONE", "OTJ", "PIO", "SIR", "SNC", "STX", "TDM", "VOW", "WOE"]
}
```

### POST /pick-order

Provides card pick recommendations during drafting.

**Request Body:**

```json
{
  "set": "FDN",
  "draft_mode": "Premier",
  "collection": ["Card Name 1", "Card Name 2"]
}
```

- `set`: The set code (required)
- `draft_mode`: The draft mode (optional, defaults to "Premier")
- `collection`: A list of cards already in your collection (optional, defaults to empty list)

**Response:**

```json
{
  "status": "success",
  "pick_order": [
    {
      "name": "Card Name",
      "rarity": "rare",
      "color_identity": "W",
      "p1p1_rating": 90.5,
      "synergy": 2.3,
      "rating": 92.8
    },
    ...
  ]
}
```

### POST /build-deck

Constructs optimal deck recommendations from a card pool.

**Request Body:**

```json
{
  "set": "FDN",
  "draft_mode": "Premier",
  "pool": ["Card Name 1", "Card Name 2", ...],
  "starting_colors": "WU"
}
```

- `set`: The set code (required)
- `draft_mode`: The draft mode (optional, defaults to "Premier")
- `pool`: A list of cards in your pool (required)
- `starting_colors`: A string of colors to start with (optional, defaults to empty string)

**Response:**

```json
{
  "status": "success",
  "deck": [
    {
      "name": "Card Name",
      "color_identity": "W",
      "rating": 92.8
    },
    ...
  ]
}
```

## Example Usage

### Python

```python
import requests

# Get available sets
response = requests.get('http://localhost:5000/available-sets')
print(response.json())

# Get pick order
response = requests.post('http://localhost:5000/pick-order', json={
    'set': 'FDN',
    'collection': ['Arbiter of Woe', 'Burst Lightning']
})
print(response.json())

# Build deck
response = requests.post('http://localhost:5000/build-deck', json={
    'set': 'FDN',
    'pool': ['Arbiter of Woe', 'Burst Lightning', 'Dazzling Angel', ...],
    'starting_colors': 'WU'
})
print(response.json())
```

### JavaScript

```javascript
// Get available sets
fetch('http://localhost:5000/available-sets')
  .then(response => response.json())
  .then(data => console.log(data));

// Get pick order
fetch('http://localhost:5000/pick-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    set: 'FDN',
    collection: ['Arbiter of Woe', 'Burst Lightning']
  }),
})
  .then(response => response.json())
  .then(data => console.log(data));

// Build deck
fetch('http://localhost:5000/build-deck', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    set: 'FDN',
    pool: ['Arbiter of Woe', 'Burst Lightning', 'Dazzling Angel', ...],
    starting_colors: 'WU'
  }),
})
  .then(response => response.json())
  .then(data => console.log(data));
```