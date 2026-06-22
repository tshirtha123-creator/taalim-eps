# EPS Formation Tracker – Taâlim 2026

Application React + Vite entièrement côté client pour suivre les 27 cours EPS (28 parties vidéo) de la préparation Taâlim 2026.

## Démarrage

1. Installer les dépendances : `npm install`
2. Copier `.env.example` vers `.env`
3. Renseigner `VITE_DEMO_EMAIL` et `VITE_DEMO_PASSWORD`
4. Lancer l’application : `npm run dev`
5. Ouvrir l’adresse indiquée par Vite, généralement `http://localhost:5173`

Sous PowerShell, si `npm.ps1` est bloqué, utiliser `npm.cmd install` et `npm.cmd run dev`.

> Cette authentification est uniquement une protection de démonstration locale. Toute variable `VITE_*` est intégrée au code client et ne constitue pas une protection adaptée à une application publique.

## Routes

- `/login`
- `/dashboard`
- `/courses`
- `/course/:id`
- `/planning`
- `/statistics`
- `/settings`

Toutes les routes d’étude sont protégées par la session enregistrée dans `localStorage`.

## Données

La progression, les notes, les points clés, les favoris, les difficultés, le planning, le thème et la session restent dans le stockage local du navigateur. Les vidéos utilisent uniquement les liens Facebook fournis, via l’intégration officielle et un bouton de repli.

## Commandes

- `npm run dev` : serveur Vite de développement
- `npm run build` : vérification TypeScript et build de production
- `npm run preview` : prévisualisation du build
- `npm run lint` : vérification TypeScript stricte
