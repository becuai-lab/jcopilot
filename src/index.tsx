import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(container);

const Render = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, Render());
} else {
  root.render(Render());
}
