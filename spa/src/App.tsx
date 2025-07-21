import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { PickOrder } from './components/PickOrder';
import { DeckBuilding } from './components/DeckBuilding';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pick-order" element={<PickOrder />} />
          <Route path="/deck-building" element={<DeckBuilding />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
