
import React from 'react';
import { Provider } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { store } from './store/store.ts';
import Welcome from './pages/Welcome.tsx';
import Menu from './pages/Menu.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Cart from './pages/Cart.tsx';
import Checkout from './pages/Checkout.tsx';
import Profile from './pages/Profile.tsx';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Provider>
  );
};

export default App;
