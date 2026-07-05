import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface SidebarProps {
  onNouvellesTaches?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ onNouvellesTaches, mobileOpen = false, onMobileClose }: SidebarProps) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const deconnecter = () => { logout(); navigate("/"); };
  const estActif = (path: string) => location.pathname === path;

  const aller = (path: string) => {
    navigate(path);
    onMobileClose?.();
  };

  const itemBase    = "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer w-full text-left";
  const itemActif   = "bg-white/20 text-white shadow-sm";
  const itemInactif = "text-green-100 hover:bg-white/10 hover:text-white";

  const contenu = (
    <aside className={[
      "flex flex-col h-full bg-gradient-to-b from-emerald-700 to-emerald-800 transition-all duration-300",
      "lg:flex-shrink-0",
      collapsed ? "lg:w-16" : "lg:w-56",
      "w-64",
    ].join(" ")}>

      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        {!collapsed && (
          <span className="text-white font-bold text-lg tracking-tight">
            Task<span className="text-emerald-300">Flow</span>
          </span>
        )}
        {/* Fermer sur mobile */}
        <button onClick={onMobileClose} className="lg:hidden text-white/60 hover:text-white ml-auto">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Collapse sur desktop */}
        <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:block text-white/60 hover:text-white ml-auto">
          {collapsed ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Profil */}
      <div className={["flex items-center gap-3 px-4 py-4 border-b border-white/10", collapsed ? "lg:justify-center" : ""].join(" ")}>
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {user?.prenom?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className={["min-w-0", collapsed ? "lg:hidden" : ""].join(" ")}>
          <p className="text-white text-sm font-medium truncate">{user?.prenom} {user?.nom}</p>
          <p className="text-emerald-300 text-[11px] truncate">{user?.role === "admin" ? "Administrateur" : "Utilisateur"}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">

        {/* Dashboard */}
        <button onClick={() => aller("/dashboard")} className={[itemBase, estActif("/dashboard") ? itemActif : itemInactif].join(" ")}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className={collapsed ? "lg:hidden" : ""}>Dashboard</span>
        </button>

        {/* Tâches */}
        <button onClick={() => aller("/tasks")} className={[itemBase, estActif("/tasks") ? itemActif : itemInactif].join(" ")}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className={collapsed ? "lg:hidden" : ""}>Mes tâches</span>
        </button>

        {/* Nouvelle tâche */}
        {onNouvellesTaches && (
          <button onClick={() => { onNouvellesTaches(); onMobileClose?.(); }} className={[itemBase, itemInactif].join(" ")}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className={collapsed ? "lg:hidden" : ""}>Nouvelle tâche</span>
          </button>
        )}

        {/* Admin */}
        {user?.role === "admin" && (
          <button onClick={() => aller("/admin")} className={[itemBase, estActif("/admin") ? itemActif : itemInactif].join(" ")}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className={collapsed ? "lg:hidden" : ""}>Comptes</span>
          </button>
        )}

      </nav>

      {/* Déconnexion */}
      <div className="px-3 pb-5 border-t border-white/10 pt-4">
        <button onClick={deconnecter} className={[itemBase, "text-red-300 hover:bg-red-500/20 hover:text-red-200"].join(" ")}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className={collapsed ? "lg:hidden" : ""}>Déconnexion</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex min-h-screen">{contenu}</div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={onMobileClose} />
          <div className="relative z-50 flex h-full">{contenu}</div>
        </div>
      )}
    </>
  );
}
