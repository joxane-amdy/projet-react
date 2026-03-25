import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import Button from "../UI/Button";
import FeatureCard from "../UI/Card";
import StepCard from "../UI/StepCard";
import { useNavigate } from "react-router-dom";

const STEPS = [
  { num: 1, title: "Créer un compte", desc: "Inscrivez-vous gratuitement." },
  { num: 2, title: "Ajoutez vos tâches", desc: "Organisez facilement." },
  { num: 3, title: "Accomplissez plus", desc: "Suivez votre progression." },
];

const FEATURES = [
  { icon: "✅", title: "Ajoutez vos tâches", desc: "En 2 secondes." },
  { icon: "✏️", title: "Modifiez", desc: "Changez facilement." },
  { icon: "🗑️", title: "Supprimez", desc: "Nettoyez votre liste." },
  { icon: "📊", title: "Suivi visuel", desc: "Statistiques claires." },
  { icon: "🔍", title: "Filtres", desc: "Recherche rapide." },
  { icon: "📂", title: "Catégories", desc: "Classez vos tâches." },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-b from-green-50 to-white flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        
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

        <Button
          onClick={() => navigate("/auth?mode=register")}
          className="bg-emerald-600 text-white px-8 py-3 text-lg hover:bg-emerald-700"
        >
          Commencer gratuitement →
        </Button>

        {/* 3 arguments */}
        <div className="flex justify-center gap-6 mt-8 text-sm text-gray-500 flex-wrap">
          {["Gratuit pour toujours", "Sans carte bancaire", "Données privées"].map(t => (
            <span key={t} className="flex items-center gap-1">
              <span className="text-green-500 font-bold">✓</span> {t}
            </span>
          ))}
        </div>
        {/* Stats band */}
        <div className="max-w-5xl mx-auto mt-16 grid grid-cols-3 gap-6 relative z-10">
          {[['12 000+', 'Utilisateurs actifs'], ['98%', 'Taux de satisfaction'], ['3,2M', 'Tâches complétées']].map(([v, l]) => (
            <div key={l} className="text-center py-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-2xl font-extrabold text-emerald-600 mb-0.5">{v}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          Tout ce dont vous avez besoin
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {FEATURES.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      {/* STEPS */}
      <section className="py-20 px-6 bg-emerald-50">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <span className="text-xs font-bold uppercase text-emerald-600">
            Comment ça marche
          </span>
          <h2 className="text-4xl font-extrabold text-slate-900">
            Prêt en 3 étapes
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative flex flex-col items-center text-center">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+2.5rem)] right-0 h-px border-t-2 border-dashed border-emerald-200" />
                )}
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center mb-5 shadow-lg shadow-emerald-200">
                  {s.num}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
      </section>

      <Footer />
    </div>
  );
}