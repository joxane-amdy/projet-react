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
  const [role,       setRole]       = useState<"user" | "admin">("user");
  const [showPass,   setShowPass]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [erreur,     setErreur]     = useState("");
  const [succes,     setSucces]     = useState("");

  useEffect(() => {
    setPrenom(""); setNom(""); setEmail("");
    setMotDePasse(""); setConfirm(""); setRole("user");
    setErreur(""); setSucces(""); setShowPass(false);
  }, [mode]);

  async function handleLogin() {
    setLoading(true);
    const success = await login(email, motDePasse);
    setLoading(false);
    if (success) navigate("/dashboard");
  }

  async function handleRegister() {
    setLoading(true);
    const success = await register(prenom, nom, email, motDePasse, role);
    setLoading(false);
    if (success) navigate("/dashboard");
  }

  function handleReset() {
    if (!email) { setErreur("Entrez votre e-mail."); return; }
    setSucces(`Un lien de réinitialisation a été envoyé à ${email}.`);
    setErreur("");
  }

  const handleSubmit = mode === "login" ? handleLogin : mode === "register" ? handleRegister : handleReset;

  // Features affichées dans le panneau gauche
  const features = [
    { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", text: "Gérez vos tâches en temps réel" },
    { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", text: "Tableau de bord avec statistiques" },
    { icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", text: "Gestion des rôles Admin / Utilisateur" },
    { icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", text: "Météo intégrée sur le dashboard" },
  ];

  return (
    <div className="min-h-screen flex">

      {/* ══ PANNEAU GAUCHE — branding vert ══ */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 flex-col justify-between p-12 relative overflow-hidden">

        {/* Cercles décoratifs en arrière-plan */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 -right-16 w-48 h-48 bg-white/5 rounded-full" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">TaskFlow</span>
          </div>
          <p className="text-emerald-200 text-sm">Plateforme de gestion de tâches</p>
        </div>

        {/* Illustration centrale */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-xs">
            {/* Carte mockup flottante */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="h-2.5 bg-white/40 rounded w-28 mb-1" />
                  <div className="h-2 bg-white/20 rounded w-20" />
                </div>
              </div>
              <div className="space-y-2">
                {[80, 60, 90, 45].map((w, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i === 2 ? "bg-emerald-400" : "bg-white/30"}`} />
                    <div className={`h-2 bg-white/20 rounded`} style={{ width: `${w}%` }} />
                  </div>
                ))}
              </div>
            </div>
            {/* Petite carte stat */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Tâches", val: "24" },
                { label: "Faites", val: "18" },
                { label: "Score",  val: "75%" },
              ].map(({ label, val }) => (
                <div key={label} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                  <p className="text-white font-bold text-lg leading-none">{val}</p>
                  <p className="text-emerald-200 text-[10px] mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-3">
          {features.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={icon} />
                </svg>
              </div>
              <p className="text-emerald-100 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ PANNEAU DROIT — formulaire ══ */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-gray-50">
        <div className="w-full max-w-md mx-auto">

          {/* Logo mobile uniquement */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-emerald-700 text-xl font-bold">TaskFlow</span>
          </div>

          {/* Onglets Login / Inscription */}
          {mode !== "reset" && (
            <div className="flex bg-gray-200/60 rounded-2xl p-1 mb-8">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  mode === "login"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  mode === "register"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Inscription
              </button>
            </div>
          )}

          {/* Titre */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === "login"    && "Bon retour 👋"}
              {mode === "register" && "Créer un compte"}
              {mode === "reset"    && "Réinitialiser le mot de passe"}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {mode === "login"    && "Entrez vos identifiants pour accéder à votre espace."}
              {mode === "register" && "Remplissez le formulaire pour rejoindre TaskFlow."}
              {mode === "reset"    && "Recevez un lien de réinitialisation par e-mail."}
            </p>
          </div>

          {/* Alertes */}
          {(error || erreur) && (
            <div className="flex items-start gap-3 bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 mb-5 border border-red-100">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error || erreur}
            </div>
          )}
          {succes && (
            <div className="flex items-start gap-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl px-4 py-3 mb-5 border border-emerald-100">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {succes}
            </div>
          )}

          {/* Formulaire */}
          <div className="space-y-4">

            {/* Prénom + Nom */}
            {mode === "register" && (
              <div className="grid grid-cols-2 gap-3">
                <Champ label="Prénom" value={prenom} onChange={setPrenom} placeholder="Mamadou" />
                <Champ label="Nom"    value={nom}    onChange={setNom}    placeholder="Diallo"  />
              </div>
            )}

            {/* Email */}
            <Champ
              label="Adresse e-mail"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="vous@exemple.com"
              icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />

            {/* Mot de passe */}
            {mode !== "reset" && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("reset")}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Oublié ?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 bg-white rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-gray-800 placeholder-gray-300 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Confirmer mot de passe */}
            {mode === "register" && (
              <Champ
                label="Confirmer le mot de passe"
                type="password"
                value={confirm}
                onChange={setConfirm}
                placeholder="••••••••"
                icon="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            )}

            {/* Type de compte */}
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de compte</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["user", "admin"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`relative flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                        role === r
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${role === r ? "bg-emerald-500" : "bg-gray-100"}`}>
                        <svg className={`w-4 h-4 ${role === r ? "text-white" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {r === "user"
                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          }
                        </svg>
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${role === r ? "text-emerald-700" : "text-gray-700"}`}>
                          {r === "user" ? "Utilisateur" : "Administrateur"}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {r === "user" ? "Accès standard" : "Accès complet"}
                        </p>
                      </div>
                      {role === r && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton principal */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-emerald-200"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Chargement…
                </>
              ) : (
                <>
                  {mode === "login"    && "Se connecter"}
                  {mode === "register" && "Créer mon compte"}
                  {mode === "reset"    && "Envoyer le lien"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

          </div>

          {/* Lien bas */}
          <p className="text-center text-sm text-gray-400 mt-6">
            {mode === "login" && (
              <>Pas encore de compte ?{" "}
                <button onClick={() => setMode("register")} className="text-emerald-600 font-semibold hover:text-emerald-700">
                  S'inscrire gratuitement
                </button>
              </>
            )}
            {mode === "register" && (
              <>Déjà un compte ?{" "}
                <button onClick={() => setMode("login")} className="text-emerald-600 font-semibold hover:text-emerald-700">
                  Se connecter
                </button>
              </>
            )}
            {mode === "reset" && (
              <button onClick={() => setMode("login")} className="text-emerald-600 font-semibold hover:text-emerald-700">
                ← Retour à la connexion
              </button>
            )}
          </p>

          {/* Retour accueil */}
          <p className="text-center mt-4">
            <button onClick={() => navigate("/")} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              ← Retour à l'accueil
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

// ── Composant champ réutilisable ──────────────────────────────────────────────

interface ChampProps {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: string;
}

function Champ({ label, type = "text", value, onChange, placeholder, icon }: ChampProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-3 text-sm border border-gray-200 bg-white rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-gray-800 placeholder-gray-300 transition`}
        />
      </div>
    </div>
  );
}
