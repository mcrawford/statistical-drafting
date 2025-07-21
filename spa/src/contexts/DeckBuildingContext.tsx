import { createContext, useContext, useState, ReactNode } from 'react';

interface DeckBuildingContextType {
  recommendedDeck: string[];
  setRecommendedDeck: (deck: string[]) => void;
  clearRecommendedDeck: () => void;
}

const DeckBuildingContext = createContext<DeckBuildingContextType | undefined>(undefined);

export function useDeckBuilding() {
  const context = useContext(DeckBuildingContext);
  if (context === undefined) {
    throw new Error('useDeckBuilding must be used within a DeckBuildingProvider');
  }
  return context;
}

interface DeckBuildingProviderProps {
  children: ReactNode;
}

export function DeckBuildingProvider({ children }: DeckBuildingProviderProps) {
  const [recommendedDeck, setRecommendedDeck] = useState<string[]>([]);

  const clearRecommendedDeck = () => {
    setRecommendedDeck([]);
  };

  const value = {
    recommendedDeck,
    setRecommendedDeck,
    clearRecommendedDeck,
  };

  return (
    <DeckBuildingContext.Provider value={value}>
      {children}
    </DeckBuildingContext.Provider>
  );
}