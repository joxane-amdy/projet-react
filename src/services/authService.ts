import { api } from "./api";

export interface CurrentUser {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  role: string;
}

interface AuthResponse {
  access_token: string;
}

// Le backend ne renvoie que le token. On décode le JWT pour récupérer
// les infos utilisateur (id, email, role) sans appel supplémentaire.
function decodeToken(token: string): { sub: number; email: string; role: string } {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
}

export async function registerRequest(
  prenom: string,
  nom: string,
  email: string,
  password: string,
  role: "user" | "admin" = "user"
): Promise<{ token: string; payload: { sub: number; email: string; role: string } }> {
  const { data } = await api.post<AuthResponse>("/auth/register", {
    prenom,
    nom,
    email,
    password,
    role,
  });
  return { token: data.access_token, payload: decodeToken(data.access_token) };
}

export async function loginRequest(
  email: string,
  password: string
): Promise<{ token: string; payload: { sub: number; email: string; role: string } }> {
  const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
  return { token: data.access_token, payload: decodeToken(data.access_token) };
}

export async function getMeRequest(): Promise<CurrentUser> {
  const { data } = await api.get<CurrentUser>("/users/me");
  return data;
}

// Réservé aux admins — le backend renvoie 403 sinon
export async function getAllUsersRequest(): Promise<CurrentUser[]> {
  const { data } = await api.get<CurrentUser[]>("/users");
  return data;
}
