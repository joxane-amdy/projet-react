import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Navigation ── */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-gray-100">
        <span className="text-xl font-bold text-emerald-600">TaskFlow</span>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/auth")}
            className="px-3 sm:px-4 py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
          >
            Connexion
          </button>
          <button
            onClick={() => navigate("/auth?mode=register")}
            className="px-3 sm:px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            S'inscrire
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-green-50 to-white flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 sm:py-20">
         <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
          ✦ Gratuit et simple à utiliser
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Gérez vos tâches,<br />
          <span className="text-emerald-600">simplement.</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-500 mb-8 sm:mb-10 max-w-sm sm:max-w-md">
          Créez, modifiez et supprimez vos tâches en quelques clics.
          Gratuit, simple, sans distractions et accomplissez plus chaque jour.
        </p>
        <button
          onClick={() => navigate("/auth?mode=register")}
          className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white text-base sm:text-lg font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-md"
        >
          Commencer gratuitement →
        </button>

        {/* 3 arguments */}
        <div className="flex justify-center gap-6 mt-8 text-sm text-gray-500 flex-wrap">
          {["Gratuit pour toujours", "Sans carte bancaire", "Données privées"].map(t => (
            <span key={t} className="flex items-center gap-1">
              <span className="text-green-500 font-bold">✓</span> {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── 3 avantages ── */}
      <section className="bg-gray-50 py-12 sm:py-16 px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
          Tout ce dont vous avez besoin
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">          {[
            { icon: "✅", title: "Ajoutez vos tâches",   desc: "En 2 secondes, votre tâche est créée." },
            { icon: "✏️", title: "Modifiez à tout moment", desc: "Changez le titre ou la priorité facilement." },
            { icon: "🗑️", title: "Supprimez sans effort",  desc: "Faites le ménage dans votre liste." },
            { icon: '📊', title: 'Suivi visuel', desc: 'Statistiques claires sur votre productivité. Voyez vos progrès en temps réel.' },
            { icon: '🔍', title: 'Filtres rapides', desc: 'Retrouvez n\'importe quelle tâche instantanément grâce à la recherche et aux filtres.' },
            { icon: '📂', title: 'Catégories', desc: 'Classez vos tâches par catégorie : Travail, Études, Santé, Personnel...' },


          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-800 text-center py-6 text-sm text-gray-400 border-t border-gray-100">
        ©️ 2024 TaskFlow. Tous droits réservés.
      </footer>
    </div>
  );
}