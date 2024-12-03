import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';
import { DataProvider } from './contexts/useData';
import { DarkModeProvider } from './contexts/useDarkMode';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/globals.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <Router>
    <DarkModeProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </DarkModeProvider>
  </Router>
);
