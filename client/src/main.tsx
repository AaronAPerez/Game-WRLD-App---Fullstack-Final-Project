import React from "react";
import ReactDOM from "react-dom/client";
import './styles/scrollbar.css';
import "./index.css";
import { Toaster } from 'react-hot-toast';
import { App } from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        // Default options for all toasts
        duration: 3000,
        style: {
          background: '#1c1917', // stone-900
          color: '#fff',
          border: '1px solid #27272a', // zinc-800
        },
        // Custom styles for specific toast types
        success: {
          style: {
            background: '#064e3b', // emerald-900
            color: '#6ee7b7', // emerald-300
          },
          iconTheme: {
            primary: '#6ee7b7',
            secondary: '#064e3b',
          },
        },
        error: {
          style: {
            background: '#7f1d1d', // red-900
            color: '#fca5a5', // red-300
          },
          iconTheme: {
            primary: '#fca5a5',
            secondary: '#7f1d1d',
          },
        },
      }}
    />
    </ErrorBoundary>

  </React.StrictMode>
);