// Base URL for API requests
const API_BASE_URL = "http://localhost:5000";

export interface PickOrderResponse {
  success: boolean;
  pick_order: Card[];
  error?: string;
}

export interface Card {
  color_identity: string;
  name: string;
  p1p1_rating: number;
  rarity: string;
  rating: number;
  synergy: number;
}

export interface BuildDeckResponse {
  success: boolean;
  deck: string[];
  error?: string;
}

// API functions
export const api = {
  // Get available sets
  getAvailableSets: async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/available-sets`);
    const data = await response.json();

    if (data.status !== "success") {
      throw new Error(data.error || "Failed to fetch available sets");
    }

    return data.sets;
  },

  // Get pick order for a collection of cards
  getPickOrder: async (
    set: string,
    draftMode: string,
    collection: string[]
  ): Promise<Card[]> => {
    const queryParams = new URLSearchParams({
      set,
      draft_mode: draftMode,
      collection: collection.map(encodeURIComponent).join(),


    });

    const response = await fetch(`${API_BASE_URL}/pick-order?${queryParams}`);
    const data = await response.json();

    if (data.status !== "success") {
      throw new Error(data.error || "Failed to get pick order");
    }

    return data.pick_order;
  },

  // Build a deck from a pool of cards
  buildDeck: async (
    set: string,
    draftMode: string,
    pool: string[]
  ): Promise<string[]> => {
    const queryParams = new URLSearchParams({
      set,
      draft_mode: draftMode,
      pool: pool.join(","),
    });

    const response = await fetch(`${API_BASE_URL}/build-deck?${queryParams}`);
    const data = await response.json();

    if (data.status !== "success") {
      throw new Error(data.error || "Failed to build deck");
    }

    return data.deck;
  },
};
