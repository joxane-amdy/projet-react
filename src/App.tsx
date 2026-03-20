// Point d'entrée : définit les 3 pages de l'application

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing   from "./composants/pages/Landing";
import Auth      from "./composants/pages/Auth";
import Dashboard from "./composants/pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Landing />} />
        <Route path="/auth"      element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*"          element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}