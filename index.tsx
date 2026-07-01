import './src/index.css';
import 'katex/dist/katex.min.css';
import React, { Suspense } from 'react';
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
    <Suspense fallback={<div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: '#71717a', fontSize: 14 }}>Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);
