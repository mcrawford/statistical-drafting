import { useState, useEffect, useRef } from 'react'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api, type Card } from '../services/api'
import { useCollection } from '../contexts/CollectionContext'
import { usePack } from '../contexts/PackContext'
import { useFilter } from '../contexts/FilterContext'
import { PickOrderTable } from './PickOrderTable'

export function PickOrder() {
  const [selectedSet, setSelectedSet] = useState('')
  const [draftMode, setDraftMode] = useState('Premier')

  const { collection, addCard, removeCard } = useCollection()
  const { currentPack, addCardToPack, clearPack } = usePack()
  const { searchTerm, setSearchTerm } = useFilter()

  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && searchInputRef.current) {
        event.preventDefault()
        searchInputRef.current.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const { data: availableSets, isLoading: isLoadingSets } = useQuery({
    queryKey: ['availableSets'],
    queryFn: api.getAvailableSets,
  })

  const { data: pickOrder, isLoading: isLoadingPickOrder } = useQuery({
    queryKey: ['pickOrder', selectedSet, draftMode, collection],
    queryFn: () => api.getPickOrder(selectedSet, draftMode, collection),
    enabled: !!selectedSet,
  })

  const filteredPickOrder = useMemo(() => {
    return (
      pickOrder?.filter((card: Card) => {
        return card.name.toLowerCase().includes(searchTerm.toLowerCase())
      }) || []
    )
  }, [pickOrder, searchTerm])

  const handlePickCardFromTable = (card: Card) => {
    addCardToPack(card)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Configuration</h2>
          <div className="form-control">
            <label htmlFor="setSelect" className="label">
              <span className="label-text">Select Set:</span>
            </label>
            {isLoadingSets && <span className="loading loading-spinner"></span>}
            {!isLoadingSets && availableSets && availableSets.length > 0 && (
              <select
                className="select select-bordered w-full max-w-xs"
                value={selectedSet}
                onChange={(e) => setSelectedSet(e.target.value)}
              >
                <option value="">Select a set</option>
                {availableSets.map((set) => (
                  <option key={set} value={set}>
                    {set}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-control">
            <label htmlFor="draftMode" className="label">
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
              <p>No cards in collection yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {collection.map((card) => (
                  <span
                    key={card}
                    className="badge badge-lg badge-neutral cursor-pointer"
                  >
                    {card}
                    <button
                      className="ml-1 text-xs"
                      onClick={() => removeCard(card)}
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {currentPack.length > 0 && (
        <div className="card bg-base-200 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">Current Pack</h2>
            <div className="flex flex-wrap gap-2">
              {currentPack
                .sort((a, b) => b.rating - a.rating)
                .map((card) => (
                  <button
                    key={card.name}
                    className="badge badge-soft badge-accent cursor-pointer hover:bg-accent hover:text-accent-content transition-colors w-full justify-between"
                    onClick={() => {
                      addCard(card.name)
                      clearPack()
                      setSearchTerm('')
                    }}
                  >
                    <span>{card.name}</span>
                    <span>{card.rating.toFixed(0)}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recommended Pick Order</h2>

          <div className="form-control mb-4">
            <input
              type="text"
              placeholder="Search cards... (Press '/' for quick access)"
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              ref={searchInputRef}
            />
          </div>

          {isLoadingPickOrder && (
            <span className="loading loading-spinner"></span>
          )}
          {!isLoadingPickOrder && filteredPickOrder.length > 0 && (
            <div className="overflow-x-auto">
              {selectedSet && !isLoadingPickOrder && (
                <PickOrderTable
                  pickOrder={filteredPickOrder}
                  searchTerm={searchTerm}
                  handlePickCardFromTable={handlePickCardFromTable}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
