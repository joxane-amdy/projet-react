# 📋 TaskFlow

Application de gestion de tâches développée avec **React + TypeScript + Vite**.
Ce projet permet de créer, organiser et suivre ses tâches de manière simple et efficace.

---

## Fonctionnalités

* Ajouter une tâche
* Modifier une tâche
* Supprimer une tâche
* Marquer une tâche comme terminée
* Voir les statistiques (total, en cours, terminées)
* Catégoriser les tâches :

  * Travail
  * Personnel
  * Santé
  * Étude
* Filtrer les tâches par catégorie
* Date de création automatique

---

## Technologies utilisées

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router

---

## 📁 Structure du projet

```
src/
├── hooks/
│   └── useAuth.ts        # Gestion de l’authentification
│
├── pages/
│   ├── Auth.tsx          # Page connexion / inscription
│   ├── Dashboard.tsx     # Tableau de bord principal
│   ├── Landing.tsx       # Page d’accueil
│
├── App.tsx               # Routes principales
├── main.tsx              # Point d’entrée
├── index.css             # Styles globaux
```

---

## Installation

1. Cloner le projet :

```bash
git clone https://github.com/projet-react
```

2. Aller dans le dossier :

```bash
cd projet-react
```
3. Installer les dépendances :

```bash
npm install
```
4. Aller sur ça branche
git checkout feature/auth
git checkout feature/dashboard
git checkout feature/landing
git checkout feature/userAut
5. Lancer le projet :

```bash
npm run dev
```

---

## Équipe projet

Projet réalisé en groupe 👇

main          → version stable
develop       → développement
feature/nom   → nouvelle fonctionnalité

---

## Objectif du projet

Ce projet a pour objectif de :

* Apprendre React + TypeScript
* Comprendre la gestion d’état (useState)
* Organiser un projet en équipe
* Utiliser GitHub de manière professionnelle

---

## Messages de commit (IMPORTANT)

Utilise des messages clairs :

* Ajout: nouvelle fonctionnalité
* Fix: correction de bug
* UI: modification interface
* Refactor: amélioration du code

Exemples :

```
Ajout: système de filtrage des tâches
Fix: bug suppression tâche
UI: amélioration du dashboard

## 📄 Licence

Projet académique – libre d’utilisation pour apprentissage.

---  pour ce projet comment je doit faire pour gérer le github et aussi les branches 