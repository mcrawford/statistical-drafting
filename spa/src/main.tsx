import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { CollectionProvider } from './contexts/CollectionContext.tsx';
import { PackProvider } from './contexts/PackContext.tsx';
import { FilterProvider } from './contexts/FilterContext.tsx';
import { DeckBuildingProvider } from './contexts/DeckBuildingContext.tsx';

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CollectionProvider>
        <PackProvider>
          <FilterProvider>
            <DeckBuildingProvider>
              <App />
            </DeckBuildingProvider>
          </FilterProvider>
        </PackProvider>
      </CollectionProvider>
    </QueryClientProvider>
  </StrictMode>,
)
