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
    
    const saved = localStorage.getItem("currentUser");

    return saved ? JSON.parse(saved) : null;
  });

  //  pour stocker les erreurs (ex: mauvais mot de passe)
  const [error, setError] = useState<string | null>(null);


  // Fonction pour récupérer tous les utilisateurs
  function getUsers(): User[] {
    
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

    const newUser: User = { prenom, nom, email, motDePasse };

    users.push(newUser);
    saveUsers(users);
    setUser({ prenom, nom, email });

    
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

    const users = getUsers(); 

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