import React from 'react';
import ReactDOM from 'react-dom/client';
import './global';
import './global.css';
import Index from './pages/index';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
);
