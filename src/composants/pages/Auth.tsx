import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type Mode = "login" | "register" | "reset";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, error } = useAuth();

  const [mode, setMode] = useState<Mode>(
    searchParams.get("mode") === "register" ? "register" : "login"
  );

  const [prenom,     setPrenom]     = useState("");
  const [nom,        setNom]        = useState("");
  const [email,      setEmail]      = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [erreur,     setErreur]     = useState("");
  const [succes,     setSucces]     = useState("");

  useEffect(() => {
    setPrenom(""); setNom(""); setEmail("");
    setMotDePasse(""); setConfirm("");
    setErreur(""); setSucces("");
  }, [mode]);

  function handleLogin() {
  const success = login(email, motDePasse);

  if (success) {
    navigate("/dashboard");
  }
}

  function handleRegister() {
  const success = register(prenom, nom, email, motDePasse);

  if (success) {
    navigate("/dashboard");
  }
}
  function handleReset() {
    if (!email) { setErreur("Entrez votre e-mail."); return; }
    setSucces(`Un lien a été envoyé à ${email}.`);
    setErreur("");
  }

  const handleSubmit = mode === "login" ? handleLogin: mode === "register" ? handleRegister: handleReset;

  return (
    // Plein écran centré, avec padding adapté au mobile
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Logo + retour accueil */}
        <div className="text-center mb-6">
          <button onClick={() => navigate("/")} className="text-2xl font-bold text-emerald-600">
            TaskFlow
          </button>
        </div>

        {/* Carte — prend toute la largeur sur mobile, max 448px sinon */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">

          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
            {mode === "login"    && "Bon retour 👋"}
            {mode === "register" && "Créer un compte ✨"}
            {mode === "reset"    && "Mot de passe oublié 🔑"}
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            {mode === "login"    && "Connectez-vous pour accéder à vos tâches."}
            {mode === "register" && "Inscription gratuite en 30 secondes."}
            {mode === "reset"    && "On vous envoie un lien par e-mail."}
          </p>

          {/* Erreur */}
          {error && (
           <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4 border border-red-200">
            {error}
           </div>
          )}

          {/* Succès */}
          {succes && (
            <div className="bg-emerald-50 text-emerald-700 text-sm rounded-lg px-4 py-3 mb-4 border border-emerald-200">
              {succes}
            </div>
          )}

          <div className="flex flex-col gap-4">

            {/* Prénom + Nom : côte à côte sur mobile aussi (champs courts) */}
            {mode === "register" && (
              <div className="grid grid-cols-2 gap-3">
                <Champ label="Prénom" value={prenom} onChange={setPrenom} placeholder="Marie" />
                <Champ label="Nom"    value={nom}    onChange={setNom}    placeholder="Dupont" />
              </div>
            )}

            <Champ label="E-mail" type="email" value={email} onChange={setEmail} placeholder="vous@exemple.com" />

            {mode !== "reset" && (
              <Champ label="Mot de passe" type="password" value={motDePasse} onChange={setMotDePasse} placeholder="••••••••" />
            )}

            {mode === "register" && (
              <Champ label="Confirmer" type="password" value={confirm} onChange={setConfirm} placeholder="••••••••" />
            )}

            {mode === "login" && (
              <div className="text-right -mt-2">
                <button onClick={() => setMode("reset")} className="text-xs text-emerald-600 hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            {/* Bouton — pleine largeur sur tous les écrans */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors mt-1 text-sm sm:text-base"
            >
              {mode === "login"    && "Se connecter"}
              {mode === "register" && "Créer mon compte"}
              {mode === "reset"    && "Envoyer le lien"}
            </button>

          </div>

          {/* Liens bas de carte */}
          <div className="text-center text-sm text-gray-400 mt-6">
            {mode === "login" && (
              <span>
                Pas de compte ?{" "}
                <button onClick={() => setMode("register")} className="text-emerald-600 font-semibold hover:underline">
                  S'inscrire
                </button>
              </span>
            )}
            {mode === "register" && (
              <span>
                Déjà un compte ?{" "}
                <button onClick={() => setMode("login")} className="text-emerald-600 font-semibold hover:underline">
                  Se connecter
                </button>
              </span>
            )}
            {mode === "reset" && (
              <button onClick={() => setMode("login")} className="text-emerald-600 font-semibold hover:underline">
                ← Retour à la connexion
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

interface ChampProps {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

function Champ({ label, type = "text", value, onChange, placeholder }: ChampProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
      />
    </div>
  );
}