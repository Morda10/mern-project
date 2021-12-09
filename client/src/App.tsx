import React from 'react';
import { Counter } from './features/counter/Counter';
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import './App.css';

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Counter />} />
            <Route path="/mor" element={<h1>sdfdsf</h1>} />
        </Routes>
    </Router>
  );
}

export default App;
