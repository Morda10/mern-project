import React from 'react';
import { Counter } from './features/counter/Counter';
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import './App.scss';
import HomePage from './features/pages/HomePage/HomePage';

function App() {
  return (
    <div style={{ height: '1600px' }}>
      <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/mor" element={<h1>sdfdsf</h1>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
