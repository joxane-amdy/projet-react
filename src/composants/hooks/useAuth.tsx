import { useState } from "react";
import { registerRequest, loginRequest, getMeRequest } from "../../services/authService";

// Type d'un utilisateur connecté (sans mot de passe — il n'existe plus côté frontend)
export interface User {
  prenom: string;
  nom: string;
  email: string;
  role: "user" | "admin";
}

export function useAuth() {

  // user connecté — chargé depuis localStorage au démarrage
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  // pour stocker les erreurs (ex: mauvais mot de passe, email déjà utilisé)
  const [error, setError] = useState<string | null>(null);

  // INSCRIPTION — appelle POST /auth/register
  async function register(
    prenom: string,
    nom: string,
    email: string,
    motDePasse: string,
    role: "user" | "admin" = "user"
  ) {
    if (!prenom || !nom || !email || !motDePasse) {
      setError("Tous les champs sont obligatoires");
      return false;
    }
    if (motDePasse.length < 6) {
      setError("Mot de passe trop court");
      return false;
    }

    try {
      const { token } = await registerRequest(prenom, nom, email, motDePasse, role);
      localStorage.setItem("token", token);

      // On a tout de suite prenom/nom/role puisqu'on vient de les saisir
      const connectedUser: User = { prenom, nom, email, role };
      localStorage.setItem("currentUser", JSON.stringify(connectedUser));
      setUser(connectedUser);
      setError(null);
      return true;
    } catch (err: any) {
      setError(
        err.response?.status === 409
          ? "Cet email existe déjà"
          : err.response?.data?.message || "Erreur lors de l'inscription"
      );
      return false;
    }
  }

  // CONNEXION — appelle POST /auth/login puis GET /users/me pour récupérer le profil complet
  async function login(email: string, motDePasse: string) {
    try {
      const { token } = await loginRequest(email, motDePasse);
      localStorage.setItem("token", token);

      // Le login ne renvoie que le token : on va chercher le profil complet
      const profil = await getMeRequest();

      const connectedUser: User = {
        prenom: profil.prenom,
        nom: profil.nom,
        email: profil.email,
        role: profil.role as "user" | "admin",
      };
      localStorage.setItem("currentUser", JSON.stringify(connectedUser));
      setUser(connectedUser);
      setError(null);
      return true;
    } catch (err: any) {
      setError("Email ou mot de passe incorrect");
      return false;
    }
  }

  // DÉCONNEXION
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setUser(null);
  }

  return {
    user,
    register,
    login,
    logout,
    error,
  };
}
