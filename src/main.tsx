// ============================================================
// main.tsx
// C'est le fichier de démarrage de l'application React.
// Il injecte le composant App dans la page HTML (div#root).
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Les styles globaux (Tailwind)

// On démarre l'application dans la balise <div id="root"> de index.html
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
