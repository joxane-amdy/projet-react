import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import { useAuth } from "../hooks/useAuth";
import {
  getTasksRequest, createTaskRequest, updateTaskRequest, deleteTaskRequest,
  TacheAPI,
} from "../../services/taskService";
import Sidebar from "../Layout/Sidebar";

type TypeTache = "Travail" | "Personnel" | "Santé" | "Étude";
type Priorite  = "haute" | "normale" | "basse";
type Filtre    = "Toutes" | TypeTache;
type Tache = TacheAPI;

const TYPES: TypeTache[] = ["Travail", "Personnel", "Santé", "Étude"];
const FILTRES: Filtre[]  = ["Toutes", ...TYPES];

const COULEUR_TYPE: Record<TypeTache, string> = {
  Travail: "#378ADD", Personnel: "#7F77DD", Santé: "#1D9E75", Étude: "#EF9F27",
};
const COULEUR_PRIO: Record<Priorite, string> = {
  haute: "#E24B4A", normale: "#888780", basse: "#639922",
};
const BADGE_TYPE: Record<TypeTache, string> = {
  Travail: "bg-blue-100 text-blue-800", Personnel: "bg-purple-100 text-purple-800",
  Santé: "bg-emerald-100 text-emerald-800", Étude: "bg-amber-100 text-amber-800",
};
const BADGE_PRIO: Record<Priorite, string> = {
  haute: "bg-red-100 text-red-700", normale: "bg-gray-100 text-gray-500",
  basse: "bg-emerald-100 text-emerald-700",
};
const FORM_INIT = { titre: "", type: "Travail" as TypeTache, priorite: "normale" as Priorite };

const formaterDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

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
  const navigate = useNavigate();
  const { user } = useAuth();

  const [taches, setTaches]             = useState<Tache[]>([]);
  const [chargement, setChargement]     = useState(true);
  const [filtreActif, setFiltreActif]   = useState<Filtre>("Toutes");
  const [formMode, setFormMode]         = useState<"nouveau" | number | null>(null);
  const [form, setForm]                 = useState(FORM_INIT);
  const [erreur, setErreur]             = useState("");
  const [sidebarOpen, setSidebarOpen]   = useState(false); // ← mobile

  useEffect(() => { chargerTaches(); }, []);

  async function chargerTaches() {
    try {
      setChargement(true);
      const data = await getTasksRequest();
      setTaches(data);
    } catch (err) {
      console.error("Impossible de charger les tâches :", err);
    } finally {
      setChargement(false);
    }
  }

  const total       = taches.length;
  const terminees   = taches.filter((t) => t.terminee).length;
  const enCours     = total - terminees;
  const progression = total > 0 ? Math.round((terminees / total) * 100) : 0;
  const countType   = (type: TypeTache) => taches.filter((t) => t.type === type).length;

  const barData   = TYPES.map((type) => ({ name: type, value: countType(type), color: COULEUR_TYPE[type] }));
  const donutData = (["haute", "normale", "basse"] as Priorite[]).map((p) => ({
    name: p.charAt(0).toUpperCase() + p.slice(1),
    value: taches.filter((t) => t.priorite === p).length,
    color: COULEUR_PRIO[p],
  }));

  const tachesFiltrees = filtreActif === "Toutes" ? taches : taches.filter((t) => t.type === filtreActif);

  function ouvrirAjout() { setFormMode("nouveau"); setForm(FORM_INIT); setErreur(""); }
  function ouvrirEdition(tache: Tache) { setFormMode(tache.id); setForm({ titre: tache.titre, type: tache.type, priorite: tache.priorite }); setErreur(""); }
  function fermerFormulaire() { setFormMode(null); setErreur(""); }

  async function sauvegarder() {
    if (!form.titre.trim()) { setErreur("Le titre est obligatoire."); return; }
    try {
      if (formMode === "nouveau") {
        const t = await createTaskRequest({ titre: form.titre, type: form.type, priorite: form.priorite });
        setTaches([t, ...taches]);
      } else {
        const t = await updateTaskRequest(formMode as number, { titre: form.titre, type: form.type, priorite: form.priorite });
        setTaches(taches.map((x) => (x.id === formMode ? t : x)));
      }
      fermerFormulaire();
    } catch { setErreur("Erreur lors de l'enregistrement. Réessayez."); }
  }

  const supprimerTache = async (id: number) => {
    try { await deleteTaskRequest(id); setTaches(taches.filter((t) => t.id !== id)); }
    catch (err) { console.error("Erreur :", err); }
  };

  const cocherTache = async (id: number) => {
    const tache = taches.find((t) => t.id === id);
    if (!tache) return;
    try {
      const t = await updateTaskRequest(id, { terminee: !tache.terminee });
      setTaches(taches.map((x) => (x.id === id ? t : x)));
    } catch (err) { console.error("Erreur :", err); }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── SIDEBAR ── */}
      <Sidebar
        onNouvellesTaches={ouvrirAjout}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* ── CONTENU ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOPBAR */}
        <header className="bg-emerald-700 px-4 sm:px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Bouton hamburger mobile */}
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
          </div>
          <button
            onClick={ouvrirAjout}
            className="flex items-center gap-1.5 bg-white text-emerald-700 font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Nouvelle tâche</span>
            <span className="sm:hidden">Ajouter</span>
          </button>
        </header>

        <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto">

          {/* CARTES STATS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Total",       val: total,             color: "text-gray-800",    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", bg: "bg-gray-100" },
              { label: "En cours",    val: enCours,           color: "text-blue-600",    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",                                                                                         bg: "bg-blue-50"  },
              { label: "Terminées",   val: terminees,         color: "text-emerald-600", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",                                                                                       bg: "bg-emerald-50" },
              { label: "Progression", val: `${progression}%`, color: "text-amber-600",   icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",                                                                                                      bg: "bg-amber-50"  },
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

          {/* SECTION TÂCHES */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">

            {/* En-tête + filtres */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <p className="text-base font-semibold text-gray-800">Mes tâches</p>
                <p className="text-xs text-gray-400">
                  {tachesFiltrees.length === 0 ? "Aucune tâche" : `${tachesFiltrees.length} tâche${tachesFiltrees.length > 1 ? "s" : ""}`}
                  {filtreActif !== "Toutes" && ` · ${filtreActif}`}
                </p>
              </div>
              {/* Filtres — scroll horizontal sur mobile */}
              <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 sm:bg-gray-100 sm:rounded-xl sm:p-0.5">
                {FILTRES.map((filtre) => (
                  <button
                    key={filtre}
                    onClick={() => setFiltreActif(filtre)}
                    className={[
                      "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      filtreActif === filtre
                        ? "bg-emerald-600 text-white sm:bg-white sm:text-gray-800 sm:shadow-sm"
                        : "text-gray-500 hover:text-gray-700 bg-gray-100 sm:bg-transparent",
                    ].join(" ")}
                  >
                    {filtre}
                  </button>
                ))}
              </div>
            </div>

            {/* Formulaire inline */}
            {formMode !== null && (
              <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4 mb-4">
                <p className="text-sm font-semibold text-emerald-800 mb-3">
                  {formMode === "nouveau" ? "✦ Nouvelle tâche" : "Modifier la tâche"}
                </p>
                <input
                  type="text"
                  value={form.titre}
                  onChange={(e) => { setForm((f) => ({ ...f, titre: e.target.value })); setErreur(""); }}
                  placeholder="Titre de la tâche…"
                  autoFocus
                  className="w-full text-sm border border-emerald-200 rounded-xl px-3 py-2.5 mb-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white text-gray-800 placeholder:text-gray-400 transition"
                />
                {erreur && <p className="text-xs text-red-500 mb-2">{erreur}</p>}

                {/* Types — scroll horizontal sur mobile */}
                <div className="flex gap-2 overflow-x-auto pb-1 mb-3">
                  {TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setForm((f) => ({ ...f, type }))}
                      className={[
                        "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        form.type === type ? `${BADGE_TYPE[type]} border-current` : "bg-white text-gray-500 border-gray-200 hover:border-gray-300",
                      ].join(" ")}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <select
                  value={form.priorite}
                  onChange={(e) => setForm((f) => ({ ...f, priorite: e.target.value as Priorite }))}
                  className="w-full text-sm border border-emerald-200 rounded-xl px-3 py-2.5 mb-3 outline-none focus:border-emerald-500 cursor-pointer bg-white text-gray-800"
                >
                  <option value="haute">Haute priorité</option>
                  <option value="normale">Priorité normale</option>
                  <option value="basse">Basse priorité</option>
                </select>

                <div className="flex gap-2 justify-end">
                  <button onClick={fermerFormulaire} className="px-4 py-2 text-xs border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                    Annuler
                  </button>
                  <button
                    onClick={sauvegarder}
                    disabled={!form.titre.trim()}
                    className="px-4 py-2 text-xs bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {formMode === "nouveau" ? "Créer la tâche" : "Enregistrer"}
                  </button>
                </div>
              </div>
            )}

            {/* Liste */}
            {chargement ? (
              <div className="text-center py-10 text-gray-400">
                <svg className="w-8 h-8 mx-auto mb-3 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm">Chargement…</p>
              </div>
            ) : tachesFiltrees.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm mb-3">{filtreActif === "Toutes" ? "Aucune tâche pour le moment" : `Aucune tâche "${filtreActif}"`}</p>
                {formMode === null && (
                  <button onClick={ouvrirAjout} className="px-4 py-2 text-xs bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                    + Ajouter une tâche
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {tachesFiltrees.map((tache) => (
                  <div
                    key={tache.id}
                    className={[
                      "flex items-start sm:items-center gap-3 px-3 sm:px-4 py-3 rounded-xl border transition-all",
                      formMode === tache.id
                        ? "border-emerald-300 ring-1 ring-emerald-100 bg-white"
                        : tache.terminee
                          ? "border-gray-100 bg-gray-50 opacity-50"
                          : "border-gray-100 bg-gray-50 hover:border-emerald-200 hover:bg-emerald-50/30",
                    ].join(" ")}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => cocherTache(tache.id)}
                      className={[
                        "flex-shrink-0 mt-0.5 sm:mt-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        tache.terminee ? "bg-emerald-500 border-emerald-500" : "border-gray-300 hover:border-emerald-400",
                      ].join(" ")}
                    >
                      {tache.terminee && (
                        <svg className="w-2.5 h-2.5" fill="none" stroke="white" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${tache.terminee ? "line-through text-gray-400" : "text-gray-800"}`}>
                        {tache.titre}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${BADGE_TYPE[tache.type]}`}>{tache.type}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${BADGE_PRIO[tache.priorite]}`}>{tache.priorite}</span>
                        <span className="text-[10px] text-gray-400">{formaterDate(tache.dateCreation)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => ouvrirEdition(tache)}
                        className="px-2 py-1 text-xs border border-gray-200 rounded-lg text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => supprimerTache(tache.id)}
                        className="px-2 py-1 text-xs border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
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
