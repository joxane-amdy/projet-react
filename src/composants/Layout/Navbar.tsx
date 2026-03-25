import { useNavigate } from "react-router-dom";
import Button from "../UI/Button";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-gray-100">
      <span className="text-xl font-bold text-emerald-600">TaskFlow</span>

      <div className="flex gap-2 sm:gap-3">
        <Button
          onClick={() => navigate("/auth")}
          className="text-gray-600 hover:text-emerald-600"
        >
          Connexion
        </Button>

        <Button
          onClick={() => navigate("/auth?mode=register")}
          className="bg-emerald-600 text-white hover:bg-emerald-700"
        >
          S'inscrire
        </Button>
      </div>
    </nav>
  );
}