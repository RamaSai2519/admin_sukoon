import React from 'react';
import { createRoot } from 'react-dom/client';
import { DataProvider } from './services/useData';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <Router>
    <DataProvider>
      <App />
    </DataProvider>
  </Router>
);
