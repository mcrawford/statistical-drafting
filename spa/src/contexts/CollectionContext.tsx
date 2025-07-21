import { createContext, useContext, useState, ReactNode } from 'react';

interface CollectionContextType {
  collection: string[];
  addCard: (card: string) => void;
  removeCard: (card: string) => void;
  clearCollection: () => void;
  setCollection: (cards: string[]) => void;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function useCollection() {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
}

interface CollectionProviderProps {
  children: ReactNode;
}

export function CollectionProvider({ children }: CollectionProviderProps) {
  const [collection, setCollectionState] = useState<string[]>([]);

  const addCard = (card: string) => {
    setCollectionState(prev => [...prev, card]);
  };

  const removeCard = (card: string) => {
    setCollectionState(prev => prev.filter(c => c !== card));
  };

  const clearCollection = () => {
    setCollectionState([]);
  };

  const setCollection = (cards: string[]) => {
    setCollectionState(cards);
  };

  const value = {
    collection,
    addCard,
    removeCard,
    clearCollection,
    setCollection
  };

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
}