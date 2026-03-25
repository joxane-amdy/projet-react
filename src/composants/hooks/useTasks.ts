import { useState } from "react";

export interface Task {
  id: string;
  titre: string;
  fait: boolean;
  userEmail: string; // lier la tâche à l'utilisateur
}

export function useTasks(userEmail: string) {

  // Clé unique par utilisateur
  const storageKey = `tasks_${userEmail}`;

  const [tasks, setTasks] = useState<Task[]>(() => {
    // Charger depuis localStorage au démarrage
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Helper : sauvegarder ET mettre à jour le state
  function saveTasks(newTasks: Task[]) {
    localStorage.setItem(storageKey, JSON.stringify(newTasks)); 
    setTasks(newTasks);
  }

  function addTask(titre: string) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      titre,
      fait: false,
      userEmail,
    };
    saveTasks([...tasks, newTask]); 
  }

  function toggleTask(id: string) {
    saveTasks(tasks.map(t => t.id === id ? { ...t, fait: !t.fait } : t));
  }

  function deleteTask(id: string) {
    saveTasks(tasks.filter(t => t.id !== id));
  }

  return { tasks, addTask, toggleTask, deleteTask };
}