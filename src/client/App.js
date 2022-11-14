import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Meals from './components/meals/Meals';
import Home from './components/layout/Home';
import About from './components/layout/About';
import MealShow from './components/meals/meal-show/MealShow';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/about" element={<About />} />
        <Route path="/meals/:id" element={<MealShow />} />
      </Routes>
    </>
  );
}

export default App;
