import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa a nova função createRoot
import App from './TituloIsaac';
import './index.css';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement); // Cria o root usando createRoot

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
