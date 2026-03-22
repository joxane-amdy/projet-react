import { useState } from "react";

//  Type d'un utilisateur complet (avec mot de passe)
export interface User {
  prenom: string;
  nom: string;
  email: string;
  motDePasse: string;
}

export function useAuth() {

  //  user connecté (SANS mot de passe pour sécurité)
  const [user, setUser] = useState<Omit<User, "motDePasse"> | null>(() => {
    // On récupère l'utilisateur déjà connecté dans le navigateur
    const saved = localStorage.getItem("currentUser");

    // Si trouvé → on le transforme en objet JS
    // Sinon → null (personne connecté)
    return saved ? JSON.parse(saved) : null;
  });

  //  pour stocker les erreurs (ex: mauvais mot de passe)
  const [error, setError] = useState<string | null>(null);


  // Fonction pour récupérer tous les utilisateurs
  function getUsers(): User[] {
    // On lit la liste dans localStorage
    // Si rien → tableau vide
    return JSON.parse(localStorage.getItem("users") || "[]");
  }


  //  Fonction pour sauvegarder les utilisateurs
  function saveUsers(users: User[]) {
    localStorage.setItem("users", JSON.stringify(users));
  }


  // INSCRIPTION
  function register(prenom: string, nom: string, email: string, motDePasse: string) {

    const users = getUsers(); // récupérer tous les utilisateurs

    //  Vérifier champs vides
    if (!prenom || !nom || !email || !motDePasse) {
      setError("Tous les champs sont obligatoires");
      return false; // stop la fonction
    }

    // Vérifier si email existe déjà
    const exist = users.find((u) => u.email === email);
    if (exist) {
      setError("Cet email existe déjà");
      return false;
    }

    // Vérifier longueur mot de passe
    if (motDePasse.length < 6) {
      setError("Mot de passe trop court");
      return false;
    }

    // Créer nouvel utilisateur
    const newUser: User = { prenom, nom, email, motDePasse };

    // Ajouter dans la liste
    users.push(newUser);

    // Sauvegarder dans localStorage
    saveUsers(users);

    // Connecter automatiquement l'utilisateur
    setUser({ prenom, nom, email });

    // Sauvegarder utilisateur connecté
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ prenom, nom, email })
    );

    // Reset erreur
    setError(null);

    return true; 
  }


  //  CONNEXION
  function login(email: string, motDePasse: string) {

    const users = getUsers(); // récupérer tous les comptes

    // Chercher utilisateur avec email + mot de passe
    const found = users.find(
      (u) => u.email === email && u.motDePasse === motDePasse
    );
    if (!found) {
      setError("Email ou mot de passe incorrect");
      return false;
    }

    // Connecter utilisateur
    setUser({
      prenom: found.prenom,
      nom: found.nom,
      email: found.email,
    });

    // Sauvegarder dans navigateur
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        prenom: found.prenom,
        nom: found.nom,
        email: found.email,
      })
    );

    setError(null);

    return true;
  }

  // DÉCONNEXION
  function logout() {
    localStorage.removeItem("currentUser");
    setUser(null);
  }


  // Ce qu'on rend disponible dans toute l'app
  return {
    user,      // utilisateur connecté
    register,  // fonction inscription
    login,     // fonction connexion
    logout,    // fonction déconnexion
    error      // message d'erreur
  };
}