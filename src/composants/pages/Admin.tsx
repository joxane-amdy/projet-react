import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getAllUsersRequest, deleteUserRequest, CurrentUser } from "../../services/authService";
import Sidebar from "../Layout/Sidebar";

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [comptes, setComptes]         = useState<CurrentUser[]>([]);
  const [chargement, setChargement]   = useState(true);
  const [erreur, setErreur]           = useState("");
  const [recherche, setRecherche]     = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modale — infos utilisateur
  const [compteSelectionne, setCompteSelectionne] = useState<CurrentUser | null>(null);

  // Confirmation suppression
  const [confirmSuppr, setConfirmSuppr] = useState<CurrentUser | null>(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    if (user.role !== "admin") { navigate("/dashboard"); return; }
    chargerComptes();
  }, [user]);

  async function chargerComptes() {
    try {
      setChargement(true);
      const data = await getAllUsersRequest();
      setComptes(data);
    } catch (err: any) {
      setErreur(
        err.response?.status === 403
          ? "Accès réservé aux administrateurs."
          : "Impossible de charger la liste des comptes."
      );
    } finally {
      setChargement(false);
    }
  }

  async function supprimerCompte(compte: CurrentUser) {
    try {
      setSuppressionEnCours(true);
      await deleteUserRequest(compte.id);
      setComptes(comptes.filter((c) => c.id !== compte.id));
      setConfirmSuppr(null);
      setCompteSelectionne(null);
    } catch {
      setErreur("Erreur lors de la suppression.");
    } finally {
      setSuppressionEnCours(false);
    }
  }

  const comptesFiltres = comptes.filter((c) =>
    `${c.prenom} ${c.nom} ${c.email}`.toLowerCase().includes(recherche.toLowerCase())
  );

  const nbAdmins = comptes.filter((c) => c.role === "admin").length;
  const nbUsers  = comptes.filter((c) => c.role === "user").length;

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">

        {/* TOPBAR */}
        <header className="bg-emerald-700 px-4 sm:px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-white font-semibold text-sm sm:text-base">Administration</h1>
              <p className="text-emerald-200 text-xs hidden sm:block">Gestion des comptes utilisateurs</p>
            </div>
          </div>
          <button onClick={chargerComptes} className="flex items-center gap-1.5 bg-white/10 text-white text-xs sm:text-sm px-3 py-1.5 rounded-xl hover:bg-white/20 transition-colors border border-white/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Actualiser</span>
          </button>
        </header>

        <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto">

          {/* CARTES STATS */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: "Total",         val: comptes.length, color: "text-gray-800",    bg: "bg-gray-100",   icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
              { label: "Admins",        val: nbAdmins,       color: "text-emerald-600", bg: "bg-emerald-50", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { label: "Utilisateurs",  val: nbUsers,        color: "text-blue-600",    bg: "bg-blue-50",    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
            ].map(({ label, val, color, bg, icon }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 px-3 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className={`${bg} p-2 sm:p-3 rounded-xl flex-shrink-0 w-fit`}>
                  <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</p>
                  <p className={`text-xl sm:text-2xl font-bold ${color}`}>{val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* TABLEAU */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">Liste des comptes</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {comptesFiltres.length} compte{comptesFiltres.length > 1 ? "s" : ""}
                  {recherche && ` · "${recherche}"`}
                </p>
              </div>
              <div className="relative w-full sm:w-48">
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder="Rechercher…"
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>
            </div>

            {erreur && (
              <div className="mx-4 sm:mx-6 mt-4 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-200">{erreur}</div>
            )}

            {chargement ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <svg className="w-8 h-8 animate-spin text-emerald-400 mb-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm">Chargement…</p>
              </div>
            ) : comptesFiltres.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <p className="text-sm">Aucun compte trouvé.</p>
              </div>
            ) : (
              <>
                {/* ── VERSION DESKTOP ── */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left border-b border-gray-100">
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rôle</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {comptesFiltres.map((compte, index) => (
                        <tr key={compte.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-xs text-gray-400 font-mono">{String(index + 1).padStart(2, "0")}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold flex-shrink-0">
                                {compte.prenom?.[0]?.toUpperCase()}{compte.nom?.[0]?.toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-800">{compte.prenom} {compte.nom}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500">{compte.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${compte.role === "admin" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${compte.role === "admin" ? "bg-emerald-500" : "bg-gray-400"}`} />
                              {compte.role === "admin" ? "Administrateur" : "Utilisateur"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {/* Voir infos */}
                              <button
                                onClick={() => setCompteSelectionne(compte)}
                                className="px-3 py-1.5 text-xs border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
                              >
                                Voir
                              </button>
                              {/* Supprimer — pas sur soi-même */}
                              {compte.id !== (user as any)?.id && (
                                <button
                                  onClick={() => setConfirmSuppr(compte)}
                                  className="px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium"
                                >
                                  Supprimer
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ── VERSION MOBILE — cartes ── */}
                <div className="sm:hidden divide-y divide-gray-50">
                  {comptesFiltres.map((compte) => (
                    <div key={compte.id} className="px-4 py-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-bold flex-shrink-0">
                        {compte.prenom?.[0]?.toUpperCase()}{compte.nom?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{compte.prenom} {compte.nom}</p>
                        <p className="text-xs text-gray-400 truncate">{compte.email}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => setCompteSelectionne(compte)}
                          className="p-1.5 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {compte.id !== (user as any)?.id && (
                          <button
                            onClick={() => setConfirmSuppr(compte)}
                            className="p-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <p className="text-xs text-gray-400">{comptes.length} compte{comptes.length > 1 ? "s" : ""} au total</p>
        </main>
      </div>

      {/* ══ MODALE — Infos utilisateur ══ */}
      {compteSelectionne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCompteSelectionne(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">

            {/* En-tête modale */}
            <div className="bg-gradient-to-r from-emerald-700 to-teal-600 px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white font-semibold text-base">Informations du compte</p>
                <button onClick={() => setCompteSelectionne(null)} className="text-white/70 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                  {compteSelectionne.prenom?.[0]?.toUpperCase()}{compteSelectionne.nom?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{compteSelectionne.prenom} {compteSelectionne.nom}</p>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${compteSelectionne.role === "admin" ? "bg-white/20 text-white" : "bg-white/10 text-emerald-100"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${compteSelectionne.role === "admin" ? "bg-emerald-300" : "bg-white/60"}`} />
                    {compteSelectionne.role === "admin" ? "Administrateur" : "Utilisateur"}
                  </span>
                </div>
              </div>
            </div>

            {/* Corps modale */}
            <div className="px-6 py-5 space-y-4">
              {[
                { label: "ID",     value: `#${compteSelectionne.id}`,  icon: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14" },
                { label: "Prénom", value: compteSelectionne.prenom,     icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                { label: "Nom",    value: compteSelectionne.nom,        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                { label: "Email",  value: compteSelectionne.email,      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                { label: "Rôle",   value: compteSelectionne.role === "admin" ? "Administrateur" : "Utilisateur", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-800">{value}</p>
                  </div>
                </div>
              ))}

              {/* Statut */}
              <div className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Statut</p>
                  <p className="text-sm font-medium text-emerald-600">Actif</p>
                </div>
              </div>
            </div>

            {/* Footer modale */}
            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={() => setCompteSelectionne(null)}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors font-medium"
              >
                Fermer
              </button>
              {compteSelectionne.id !== (user as any)?.id && (
                <button
                  onClick={() => { setConfirmSuppr(compteSelectionne); setCompteSelectionne(null); }}
                  className="flex-1 py-2.5 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
                >
                  Supprimer ce compte
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══ MODALE — Confirmation suppression ══ */}
      {confirmSuppr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmSuppr(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 p-6">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center mb-1">Supprimer ce compte ?</h3>
            <p className="text-sm text-gray-500 text-center mb-5">
              Le compte de <span className="font-semibold text-gray-700">{confirmSuppr.prenom} {confirmSuppr.nom}</span> sera définitivement supprimé. Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmSuppr(null)}
                disabled={suppressionEnCours}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={() => supprimerCompte(confirmSuppr)}
                disabled={suppressionEnCours}
                className="flex-1 py-2.5 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {suppressionEnCours ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Suppression…
                  </>
                ) : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
