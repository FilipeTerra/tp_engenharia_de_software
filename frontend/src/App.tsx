import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import HomePage from './components/HomePage';
import GerenciarEventosPage from './pages/GerenciarEventosPage'; 
import './App.css';

const App: React.FC = () => {
  return (
    // 3. Defina as rotas aqui dentro
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/gerenciar-eventos" element={<GerenciarEventosPage />} />
    </Routes>
  );
};

export default App;