// Point d'entrée : définit les pages de l'application

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing   from "./composants/pages/Landing";
import Auth      from "./composants/pages/Auth";
import Dashboard from "./composants/pages/Dashboard";
import Tasks     from "./composants/pages/Tasks";
import Admin     from "./composants/pages/Admin";

export default function App() {
  return (
    <BrowserRouter basename="/projet-react">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}