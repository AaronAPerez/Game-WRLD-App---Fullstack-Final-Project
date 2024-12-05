import React from "react";
import ReactDOM from "react-dom/client";
import './styles/scrollbar.css';
import "./index.css";
import App from "./App";
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-right" />
  </React.StrictMode>
);