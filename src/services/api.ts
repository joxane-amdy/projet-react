import axios from "axios";

// URL du backend NestJS
export const API_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur : ajoute automatiquement le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur : si le token est invalide/expiré (401), on déconnecte proprement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      // Redirection forcée vers la connexion
      if (window.location.pathname !== "/auth") {
        window.location.href = "/projet-react/auth";
      }
    }
    return Promise.reject(error);
  }
);
