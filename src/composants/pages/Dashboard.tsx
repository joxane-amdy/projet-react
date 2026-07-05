import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import { getTasksRequest, TacheAPI } from "../../services/taskService";
import Sidebar from "../Layout/Sidebar";

type TypeTache = "Travail" | "Personnel" | "Santé" | "Étude";
type Priorite  = "haute" | "normale" | "basse";

const TYPES: TypeTache[] = ["Travail", "Personnel", "Santé", "Étude"];

const COULEUR_TYPE: Record<TypeTache, string> = {
  Travail: "#378ADD", Personnel: "#7F77DD", Santé: "#1D9E75", Étude: "#EF9F27",
};
const COULEUR_PRIO: Record<Priorite, string> = {
  haute: "#E24B4A", normale: "#888780", basse: "#639922",
};

const BarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-lg px-3 py-2 text-xs shadow-sm">
      <p className="font-semibold text-gray-700">{label}</p>
      <p className="text-gray-500">{payload[0].value} tâche{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [taches, setTaches]           = useState<TacheAPI[]>([]);
  const [chargement, setChargement]   = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getTasksRequest()
      .then(setTaches)
      .catch(console.error)
      .finally(() => setChargement(false));
  }, []);

  const total       = taches.length;
  const terminees   = taches.filter((t) => t.terminee).length;
  const enCours     = total - terminees;
  const progression = total > 0 ? Math.round((terminees / total) * 100) : 0;

  const barData = TYPES.map((type) => ({
    name: type,
    value: taches.filter((t) => t.type === type).length,
    color: COULEUR_TYPE[type],
  }));

  const donutData = (["haute", "normale", "basse"] as Priorite[]).map((p) => ({
    name: p.charAt(0).toUpperCase() + p.slice(1),
    value: taches.filter((t) => t.priorite === p).length,
    color: COULEUR_PRIO[p],
  }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">

        {/* TOPBAR */}
        <header className="bg-emerald-700 px-4 sm:px-6 py-3.5 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-white font-semibold text-sm sm:text-base">Tableau de bord</h1>
            <p className="text-emerald-200 text-xs hidden sm:block">
              Bonjour, <span className="font-medium text-white">{user?.prenom ?? "Invité"}</span> 👋
            </p>
          </div>
        </header>

        <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto">

          {/* CARTES STATS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Total",       val: total,             color: "text-gray-800",    bg: "bg-gray-100",    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
              { label: "En cours",    val: enCours,           color: "text-blue-600",    bg: "bg-blue-50",     icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Terminées",   val: terminees,         color: "text-emerald-600", bg: "bg-emerald-50",  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Progression", val: `${progression}%`, color: "text-amber-600",   bg: "bg-amber-50",    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
            ].map(({ label, val, color, icon, bg }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 px-3 sm:px-5 py-3 sm:py-4 flex items-start gap-2 sm:gap-3">
                <div className={`${bg} p-1.5 sm:p-2 rounded-lg flex-shrink-0`}>
                  <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
                  <p className={`text-xl sm:text-2xl font-bold ${color}`}>{val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* GRAPHIQUES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
              <p className="text-sm font-semibold text-gray-700 mb-0.5">Tâches par type</p>
              <p className="text-xs text-gray-400 mb-3">Répartition selon la catégorie</p>
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} barCategoryGap="35%" margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<BarTooltip />} cursor={{ fill: "#f3f4f6" }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {barData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
              <p className="text-sm font-semibold text-gray-700 mb-0.5">Tâches par priorité</p>
              <p className="text-xs text-gray-400 mb-3">Haute, normale, basse</p>
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} cx="40%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                      {donutData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Legend
                      layout="vertical" align="right" verticalAlign="middle"
                      iconType="circle" iconSize={8}
                      formatter={(value, entry: any) => (
                        <span style={{ fontSize: 11, color: "#6b7280" }}>
                          {value}{" "}<span style={{ fontWeight: 600, color: "#374151" }}>{entry.payload.value}</span>
                        </span>
                      )}
                    />
                    <Tooltip formatter={(value, name) => [value ?? 0, name]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb", boxShadow: "none" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ACTIVITÉ RÉCENTE */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <p className="text-sm font-semibold text-gray-800 mb-1">Activité récente</p>
            <p className="text-xs text-gray-400 mb-4">Les 5 dernières tâches</p>
            {chargement ? (
              <div className="flex items-center justify-center py-8">
                <svg className="w-6 h-6 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : taches.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Aucune tâche pour le moment</p>
            ) : (
              <div className="space-y-2">
                {taches.slice(0, 5).map((t) => (
                  <div key={t.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.terminee ? "bg-emerald-400" : "bg-blue-400"}`} />
                    <p className={`flex-1 text-sm truncate ${t.terminee ? "line-through text-gray-400" : "text-gray-700"}`}>{t.titre}</p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{t.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
