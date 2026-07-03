import { api } from "./api";

export type TypeTache = "Travail" | "Personnel" | "Santé" | "Étude";
export type Priorite  = "haute" | "normale" | "basse";

// Forme renvoyée par le backend
export interface TacheAPI {
  id: number;
  titre: string;
  type: TypeTache;
  priorite: Priorite;
  terminee: boolean;
  dateCreation: string;
  category?: { id: number; nom: string } | null;
}

export interface CreateTachePayload {
  titre: string;
  type: TypeTache;
  priorite?: Priorite;
  terminee?: boolean;
}

export async function getTasksRequest(): Promise<TacheAPI[]> {
  const { data } = await api.get<TacheAPI[]>("/tasks");
  return data;
}

export async function createTaskRequest(payload: CreateTachePayload): Promise<TacheAPI> {
  const { data } = await api.post<TacheAPI>("/tasks", payload);
  return data;
}

export async function updateTaskRequest(
  id: number,
  payload: Partial<CreateTachePayload>
): Promise<TacheAPI> {
  const { data } = await api.patch<TacheAPI>(`/tasks/${id}`, payload);
  return data;
}

export async function deleteTaskRequest(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

export async function getStatsRequest() {
  const { data } = await api.get("/tasks/stats");
  return data;
}
