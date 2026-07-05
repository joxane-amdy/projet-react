import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getAllUsersRequest, CurrentUser } from "../../services/authService";
import Sidebar from "../Layout/Sidebar";

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [comptes, setComptes]       = useState<CurrentUser[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur]         = useState("");
  const [recherche, setRecherche]   = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const comptesFiltres = comptes.filter((c) =>
    `${c.prenom} ${c.nom} ${c.email}`.toLowerCase().includes(recherche.toLowerCase())
  );

  const nbAdmins = comptes.filter((c) => c.role === "admin").length;
  const nbUsers  = comptes.filter((c) => c.role === "user").length;

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── SIDEBAR ── */}
      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* ── CONTENU ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOPBAR */}
        <header className="bg-emerald-700 px-4 sm:px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-white font-semibold text-sm sm:text-base">Administration</h1>
              <p className="text-emerald-200 text-xs hidden sm:block">Gestion des comptes utilisateurs</p>
            </div>
          </div>
          <button
            onClick={chargerComptes}
            className="flex items-center gap-1.5 bg-white/10 text-white text-xs sm:text-sm px-3 py-1.5 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
          >
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
              { label: "Total",          val: comptes.length, color: "text-gray-800",    bg: "bg-gray-100",   icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
              { label: "Admins",         val: nbAdmins,       color: "text-emerald-600", bg: "bg-emerald-50", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { label: "Utilisateurs",   val: nbUsers,        color: "text-blue-600",    bg: "bg-blue-50",    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
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

            {/* En-tête tableau */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">Liste des comptes</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {comptesFiltres.length} compte{comptesFiltres.length > 1 ? "s" : ""}
                  {recherche && ` · "${recherche}"`}
                </p>
              </div>
              {/* Recherche */}
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
              <div className="mx-4 sm:mx-6 mt-4 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-200">
                {erreur}
              </div>
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
                <svg className="w-10 h-10 text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm">Aucun compte trouvé.</p>
              </div>
            ) : (
              <>
                {/* VERSION DESKTOP — tableau */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left border-b border-gray-100">
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rôle</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {comptesFiltres.map((compte, index) => (
                        <tr key={compte.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                            {String(index + 1).padStart(2, "0")}
                          </td>
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
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Actif
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* VERSION MOBILE — cartes */}
                <div className="sm:hidden divide-y divide-gray-50">
                  {comptesFiltres.map((compte, index) => (
                    <div key={compte.id} className="px-4 py-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-bold flex-shrink-0">
                        {compte.prenom?.[0]?.toUpperCase()}{compte.nom?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{compte.prenom} {compte.nom}</p>
                        <p className="text-xs text-gray-400 truncate">{compte.email}</p>
                      </div>
                      <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${compte.role === "admin" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                        {compte.role === "admin" ? "Admin" : "User"}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <p className="text-xs text-gray-400">
            {comptes.length} compte{comptes.length > 1 ? "s" : ""} au total
          </p>
        </main>
      </div>
    </div>
  );
}
