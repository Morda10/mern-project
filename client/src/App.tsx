import React from 'react';
import { Counter } from 'features/counter/Counter';
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import './App.scss';
import HomePage from 'features/pages/HomePage/HomePage';
import Login from 'features/pages/Login/Login';
import { GridMaker } from 'common-components';

function App() {
  return (
    <GridMaker className='main-page-grid'>
      <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/mor" element={<h1>sdfdsf</h1>} />
        </Routes>
      </Router>
    </GridMaker>
      
  );
}

export default App;
