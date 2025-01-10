import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Information from './Information';
import NewBid from './NewBid';
import Results from './Results';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/information" element={<Information />} />
      <Route path="/new-bid" element={<NewBid />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  </Router>
);


