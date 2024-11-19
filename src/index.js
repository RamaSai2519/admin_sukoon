import React from 'react';
import { Helmet } from 'react-helmet';
import { createRoot } from 'react-dom/client';
import { DataProvider } from './services/useData';
import { BrowserRouter as Router } from 'react-router-dom';
import { FINAL_URL } from './services/axiosHelper';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Helmet>
      <title>Sukoon Admin</title>
      <meta name="description" content="Discover engaging narratives, diverse languages, and the essence of heartfelt conversations in senior living on the sukoon.love. Embrace the wisdom of elders and nurture authentic connections through our enriching content." />
      <link rel="preconnect" href={FINAL_URL} />
    </Helmet>
    <DataProvider>
      <App />
    </DataProvider>
  </Router>
);
