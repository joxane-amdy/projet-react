import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getAllUsersRequest, CurrentUser } from "../../services/authService";

export default function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [comptes, setComptes]       = useState<CurrentUser[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur]         = useState("");

  // Protection de la page : seul un admin connecté peut rester ici
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }
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

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex items-center justify-between">
        <button onClick={() => navigate("/dashboard")} className="text-2xl font-bold text-emerald-600">
          TaskFlow
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:inline">
            Connecté en tant que <strong className="text-gray-700">{user?.prenom}</strong> (admin)
          </span>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Dashboard
          </button>
          <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">
            Déconnexion
          </button>
        </div>
      </header>

      <main className="px-4 sm:px-8 py-8 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Comptes inscrits</h1>
          <p className="text-sm text-gray-400 mt-1">
            Tous les utilisateurs ayant créé un compte sur TaskFlow.
          </p>
        </div>

        {erreur && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4 border border-red-200">
            {erreur}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {chargement ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              Chargement des comptes…
            </div>
          ) : comptes.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              Aucun compte trouvé.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">Nom</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Rôle</th>
                </tr>
              </thead>
              <tbody>
                {comptes.map((compte) => (
                  <tr key={compte.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {compte.prenom} {compte.nom}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{compte.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          compte.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {compte.role === "admin" ? "Administrateur" : "Utilisateur"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-4">
          {comptes.length} compte{comptes.length > 1 ? "s" : ""} au total
        </p>
      </main>
    </div>
  );
}
