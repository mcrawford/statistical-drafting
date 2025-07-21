import { createContext, useContext, useState } from "react";
import type { Card } from "../services/api";

interface PackContextType {
  currentPack: Card[];
  addCardToPack: (card: Card) => void;
  clearPack: () => void;
}

const PackContext = createContext<PackContextType | undefined>(undefined);

export function usePack() {
  const context = useContext(PackContext);
  if (context === undefined) {
    throw new Error("usePack must be used within a PackProvider");
  }
  return context;
}

interface PackProviderProps {
  children: React.ReactNode;
}

export function PackProvider({ children }: PackProviderProps) {
  const [currentPack, setCurrentPackState] = useState<Card[]>([]);

  const addCardToPack = (card: Card) => {
    setCurrentPackState([...currentPack, card]);
  };
  const clearPack = () => {
    setCurrentPackState([]);
  };
  const value = {
    currentPack,
    addCardToPack,
    clearPack,
  };

  return <PackContext.Provider value={value}>{children}</PackContext.Provider>;
}
