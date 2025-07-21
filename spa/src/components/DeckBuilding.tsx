import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { useCollection } from '../contexts/CollectionContext';
import { useDeckBuilding } from '../contexts/DeckBuildingContext';

export function DeckBuilding() {
  const [selectedSet, setSelectedSet] = useState('');
  const [draftMode, setDraftMode] = useState('Premier');

  const { collection } = useCollection();
  const { recommendedDeck, setRecommendedDeck, clearRecommendedDeck } = useDeckBuilding();

  const { data: availableSets, isLoading: isLoadingSets } = useQuery({
    queryKey: ['availableSets'],
    queryFn: api.getAvailableSets,
  });

  const { data: builtDeck, isLoading: isLoadingBuiltDeck, refetch: refetchBuiltDeck } = useQuery({
    queryKey: ['builtDeck', selectedSet, draftMode, collection],
    queryFn: () => api.buildDeck(selectedSet, draftMode, collection),
    enabled: !!selectedSet && collection.length > 0,
  });

  const handleBuildDeck = () => {
    if (builtDeck) {
      setRecommendedDeck(builtDeck);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Deck Building Assistant</h1>

      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Configuration</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Select Set:</span>
            </label>
            {isLoadingSets && <span className="loading loading-spinner"></span>}
            {!isLoadingSets && availableSets && (
              <select
                className="select select-bordered w-full max-w-xs"
                value={selectedSet}
                onChange={(e) => setSelectedSet(e.target.value)}
              >
                <option value="">Select a set</option>
                {availableSets.map((set) => (
                  <option key={set.code} value={set.code}>
                    {set.name} ({set.code})
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Draft Mode:</span>
            </label>
            <select
              className="select select-bordered w-full max-w-xs"
              value={draftMode}
              onChange={(e) => setDraftMode(e.target.value)}
            >
              <option value="Premier">Premier</option>
              <option value="Trad">Traditional</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Your Collection</h2>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Current Collection:</h3>
            {collection.length === 0 ? (
              <p>No cards in collection yet. Add cards via the Pick Order page.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {collection.map((card, index) => (
                  <span key={index} className="badge badge-lg badge-info">
                    {card}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recommended Deck</h2>
          {isLoadingBuiltDeck && <span className="loading loading-spinner"></span>}
          {!isLoadingBuiltDeck && recommendedDeck.length > 0 ? (
            <ol className="list-decimal list-inside">
              {recommendedDeck.map((card, index) => (
                <li key={index}>{card}</li>
              ))}
            </ol>
          ) : (
            <p>Select a set and ensure you have cards in your collection to build a deck.</p>
          )}
          <button className="btn btn-primary mt-4" onClick={() => refetchBuiltDeck().then(handleBuildDeck)}>Build Deck</button>
          <button className="btn btn-secondary mt-2" onClick={clearRecommendedDeck}>Clear Deck</button>
        </div>
      </div>
    </div>
  );
}