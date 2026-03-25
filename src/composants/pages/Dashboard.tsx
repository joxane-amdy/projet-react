import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import { useAuth } from "../hooks/useAuth";

//  Types 

type TypeTache = "Travail" | "Personnel" | "Santé" | "Étude";
type Priorite  = "haute" | "normale" | "basse";
type Filtre    = "Toutes" | TypeTache;

interface Tache {
  id: number;
  titre: string;
  type: TypeTache;
  priorite: Priorite;
  dateCreation: string;
  terminee: boolean;
}

//  Constantes

const TYPES: TypeTache[] = ["Travail", "Personnel", "Santé", "Étude"];
const FILTRES: Filtre[]  = ["Toutes", ...TYPES];

const COULEUR_TYPE: Record<TypeTache, string> = {
  Travail:   "#378ADD",
  Personnel: "#7F77DD",
  Santé:     "#1D9E75",
  Étude:     "#EF9F27",
};

const COULEUR_PRIO: Record<Priorite, string> = {
  haute:   "#E24B4A",
  normale: "#888780",
  basse:   "#639922",
};

const BADGE_TYPE: Record<TypeTache, string> = {
  Travail:   "bg-blue-100 text-blue-800",
  Personnel: "bg-purple-100 text-purple-800",
  Santé:     "bg-emerald-100 text-emerald-800",
  Étude:     "bg-amber-100 text-amber-800",
};

const BADGE_PRIO: Record<Priorite, string> = {
  haute:   "bg-red-100 text-red-700",
  normale: "bg-gray-100 text-gray-500",
  basse:   "bg-emerald-100 text-emerald-700",
};

const FORM_INIT = { titre: "", type: "Travail" as TypeTache, priorite: "normale" as Priorite };

//  Utilitaire 

const formaterDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

// Tooltip personnalisé pour le bar chart 

const BarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-lg px-3 py-2 text-xs shadow-sm">
      <p className="font-semibold text-gray-700">{label}</p>
      <p className="text-gray-500">{payload[0].value} tâche{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
};

//  Composant principal 

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  //  MODIF 1 — clé unique par utilisateur
  const storageKey = `tasks_${user?.email ?? "guest"}`;

  //  MODIF 2 — charger depuis localStorage au démarrage
  const [taches, setTaches] = useState<Tache[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [filtreActif, setFiltreActif] = useState<Filtre>("Toutes");
  const [formMode,    setFormMode]    = useState<"nouveau" | number | null>(null);
  const [form,        setForm]        = useState(FORM_INIT);
  const [erreur,      setErreur]      = useState("");

  //  MODIF 3 — helper qui sauvegarde ET met à jour le state en même temps
  function sauvegarderTaches(nouvellesTaches: Tache[]) {
    localStorage.setItem(storageKey, JSON.stringify(nouvellesTaches));
    setTaches(nouvellesTaches);
  }

  //  Stats 
  const total       = taches.length;
  const terminees   = taches.filter((t) => t.terminee).length;
  const enCours     = total - terminees;
  const progression = total > 0 ? Math.round((terminees / total) * 100) : 0;
  const countType   = (type: TypeTache) => taches.filter((t) => t.type === type).length;

  // Données bar chart (par type)
  const barData = TYPES.map((type) => ({
    name: type,
    value: countType(type),
    color: COULEUR_TYPE[type],
  }));

  // Données donut (par priorité)
  const donutData = (["haute", "normale", "basse"] as Priorite[]).map((p) => ({
    name: p.charAt(0).toUpperCase() + p.slice(1),
    value: taches.filter((t) => t.priorite === p).length,
    color: COULEUR_PRIO[p],
  }));

  const tachesFiltrees =
    filtreActif === "Toutes" ? taches : taches.filter((t) => t.type === filtreActif);

  //  Actions formulaire 

  function ouvrirAjout() {
    setFormMode("nouveau");
    setForm(FORM_INIT);
    setErreur("");
  }

  function ouvrirEdition(tache: Tache) {
    setFormMode(tache.id);
    setForm({ titre: tache.titre, type: tache.type, priorite: tache.priorite });
    setErreur("");
  }

  function fermerFormulaire() {
    setFormMode(null);
    setErreur("");
  }

  function sauvegarder() {
    if (!form.titre.trim()) { setErreur("Le titre est obligatoire."); return; }
    if (formMode === "nouveau") {
      // sauvegarderTaches au lieu de setTaches
      sauvegarderTaches([
        { id: Date.now(), ...form, dateCreation: new Date().toISOString(), terminee: false },
        ...taches,
      ]);
    } else {
      sauvegarderTaches(taches.map((t) => (t.id === formMode ? { ...t, ...form } : t)));
    }
    fermerFormulaire();
  }

  // sauvegarderTaches au lieu de setTaches partout
  const supprimerTache = (id: number) =>
    sauvegarderTaches(taches.filter((t) => t.id !== id));

  const cocherTache = (id: number) =>
    sauvegarderTaches(taches.map((t) => (t.id === id ? { ...t, terminee: !t.terminee } : t)));

  const deconnecter = () => { logout(); navigate("/"); };

  //  Rendu 

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-100 px-5 py-3.5 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-base font-semibold text-emerald-600">TaskFlow</span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-gray-400">
              Bonjour,{" "}
              <span className="text-gray-600 font-medium">{user?.prenom ?? "Invité"}</span>
            </span>
            <button
              onClick={ouvrirAjout}
              className="text-sm font-medium px-4 py-1.5 rounded-lg border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-colors"
            >
              + Nouvelle tâche
            </button>
            <button onClick={deconnecter} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">

        {/*  CARTES STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total",       val: total,             color: "text-gray-800"    },
            { label: "En cours",    val: enCours,           color: "text-blue-600"    },
            { label: "Terminées",   val: terminees,         color: "text-emerald-600" },
            { label: "Progression", val: `${progression}%`, color: "text-amber-600"   },
          ].map(({ label, val, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">{label}</p>
              <p className={`text-3xl font-semibold ${color}`}>{val}</p>
            </div>
          ))}
        </div>

        {/* ── GRAPHIQUES ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Bar chart — tâches par type */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm font-medium text-gray-600 mb-4">Tâches par type</p>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barCategoryGap="35%" margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: "#f3f4f6" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {barData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut — tâches par priorité */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm font-medium text-gray-600 mb-4">Tâches par priorité</p>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="40%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {donutData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value, entry: any) => (
                      <span style={{ fontSize: 12, color: "#6b7280" }}>
                        {value}{" "}
                        <span style={{ fontWeight: 600, color: "#374151" }}>
                          {entry.payload.value}
                        </span>
                      </span>
                    )}
                  />
                  <Tooltip
                    formatter={(value, name) => [value ?? 0, name]}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb", boxShadow: "none" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── SECTION TÂCHES ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">

          {/* En-tête + filtres inline */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-semibold text-gray-800">Mes tâches</p>

            <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
              {FILTRES.map((filtre) => (
                <button
                  key={filtre}
                  onClick={() => setFiltreActif(filtre)}
                  className={[
                    "px-3 py-1 rounded-md text-xs font-medium transition-all",
                    filtreActif === filtre
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-700",
                  ].join(" ")}
                >
                  {filtre}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-4">
            {tachesFiltrees.length === 0 ? "Aucune tâche" : `${tachesFiltrees.length} tâche${tachesFiltrees.length > 1 ? "s" : ""}`}
            {filtreActif !== "Toutes" && ` · ${filtreActif}`}
          </p>

          {/* Formulaire inline */}
          {formMode !== null && (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                {formMode === "nouveau" ? "Nouvelle tâche" : "Modifier la tâche"}
              </p>

              <input
                type="text"
                value={form.titre}
                onChange={(e) => { setForm((f) => ({ ...f, titre: e.target.value })); setErreur(""); }}
                placeholder="Titre de la tâche…"
                autoFocus
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-3 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 bg-white text-gray-800 placeholder:text-gray-400 transition"
              />
              {erreur && <p className="text-xs text-red-500 mb-2">{erreur}</p>}

              <div className="flex gap-2 flex-wrap mb-3">
                {TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setForm((f) => ({ ...f, type }))}
                    className={[
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      form.type === type
                        ? `${BADGE_TYPE[type]} border-current`
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300",
                    ].join(" ")}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <select
                value={form.priorite}
                onChange={(e) => setForm((f) => ({ ...f, priorite: e.target.value as Priorite }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-3 outline-none focus:border-emerald-400 cursor-pointer bg-white text-gray-800"
              >
                <option value="haute">Haute priorité</option>
                <option value="normale">Priorité normale</option>
                <option value="basse">Basse priorité</option>
              </select>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={fermerFormulaire}
                  className="px-4 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={sauvegarder}
                  disabled={!form.titre.trim()}
                  className="px-4 py-1.5 text-xs bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {formMode === "nouveau" ? "Créer" : "Enregistrer"}
                </button>
              </div>
            </div>
          )}

          {/* Liste vide */}
          {tachesFiltrees.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm mb-1">
                {filtreActif === "Toutes" ? "Aucune tâche pour le moment" : `Aucune tâche "${filtreActif}"`}
              </p>
              {formMode === null && (
                <button
                  onClick={ouvrirAjout}
                  className="mt-3 px-4 py-1.5 text-xs bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  + Ajouter une tâche
                </button>
              )}
            </div>

          ) : (
            <div className="flex flex-col gap-2">
              {tachesFiltrees.map((tache) => {
                const enEdition = formMode === tache.id;
                return (
                  <div
                    key={tache.id}
                    className={[
                      "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all",
                      enEdition
                        ? "border-emerald-300 ring-1 ring-emerald-100 bg-white"
                        : tache.terminee
                          ? "border-gray-100 bg-gray-50 opacity-50"
                          : "border-gray-100 bg-gray-50 hover:border-gray-200",
                    ].join(" ")}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => cocherTache(tache.id)}
                      className={[
                        "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        tache.terminee
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-gray-300 hover:border-emerald-400",
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
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${BADGE_TYPE[tache.type]}`}>
                          {tache.type}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${BADGE_PRIO[tache.priorite]}`}>
                          {tache.priorite}
                        </span>
                        <span className="text-[10px] text-gray-400">{formaterDate(tache.dateCreation)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => ouvrirEdition(tache)}
                        className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => supprimerTache(tache.id)}
                        className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}