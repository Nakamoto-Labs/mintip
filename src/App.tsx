import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { ContractsProvider } from './contexts/ContractsContext';
import Header from './components/Header';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import RegisterDerivative from './pages/RegisterDerivative';
import IpAssets from './pages/IpAssets';

function App() {
  return (
    <div className="App">
      <ContractsProvider>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/register-derivative" element={<RegisterDerivative />} />
            <Route path="/ip-assets" element={<IpAssets />} />
          </Routes>
        </main>
      </ContractsProvider>
    </div>
  );
}

export default App;