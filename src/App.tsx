import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome.tsx';
import Menu from './pages/Menu.tsx';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/reservation" element={<div>Reservation </div>} />
    </Routes>
  );
};

export default App;