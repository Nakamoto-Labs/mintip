import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Web3Provider } from './contexts/Web3Context';
import { StoryProvider } from './contexts/StoryContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Web3Provider>
        <StoryProvider>
          <App />
        </StoryProvider>
      </Web3Provider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();