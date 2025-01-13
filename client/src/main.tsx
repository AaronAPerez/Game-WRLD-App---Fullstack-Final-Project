// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import './styles/globalStyles.css'
import './styles/scrollbar.css';
import "./index.css";
import App from './App';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);