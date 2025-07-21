import type { Card } from '../services/api'

interface PickOrderTableProps {
  pickOrder: Card[]
  searchTerm: string
  handlePickCardFromTable: (card: Card) => void
}

export function PickOrderTable({
  pickOrder,
  searchTerm,
  handlePickCardFromTable,
}: PickOrderTableProps) {
  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        {pickOrder.length === 0 ? (
          <p>No cards found matching '{searchTerm}'</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Card</th>
                  <th>Synergy</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {pickOrder.map((card, index) => (
                  <tr
                    key={card.name}
                    onClick={() => handlePickCardFromTable(card)}
                    className="cursor-pointer"
                  >
                    <th>{index + 1}</th>
                    <td>{card.name}</td>
                    <td>{formatSynergy(card.synergy)}</td>
                    <td>{formatValue(card.rating)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function formatValue(value: number) {
  return String(Math.round(value))
}
function formatSynergy(synergy: number) {
  const rounded = Math.round(synergy)
  return rounded >= 0 ? `+${rounded}` : `${rounded}`
}
