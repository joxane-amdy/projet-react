// Configuration de Vite (l'outil qui compile notre application)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: '/projet-react/',
  plugins: [react()],
});
