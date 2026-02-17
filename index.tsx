import './src/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress "ResizeObserver loop completed with undelivered notifications"
// This is a known benign error often caused by Monaco Editor or React Resizable
const resizeObserverLoopErr = /ResizeObserver loop completed with undelivered notifications/;
window.addEventListener('error', (e) => {
  if (resizeObserverLoopErr.test(e.message)) {
    e.stopImmediatePropagation();
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
