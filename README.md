# Práctica 3 — Gestión de usuarios (CRUD)

Monorepo con **frontend** (React + Vite + TypeScript + MUI) y **backend** (Node.js + Express + TypeScript, arquitectura por capas). Incluye autenticación JWT, API REST y persistencia opcional en **SQL Server** mediante TypeORM.

## Requisitos

- [Node.js](https://nodejs.org/) LTS (incluye npm)
- Para base de datos: SQL Server accesible por TCP (opcional para desarrollo sin migraciones si solo usas el flujo en memoria según configuración actual del backend)

## Estructura del proyecto

```
Practica 3/
├── frontend/          # SPA React (Vite)
├── backend/           # API REST (Express + TypeORM opcional)
├── run-all.bat        # Arranca backend y frontend en Windows
├── gitflow-setup.sh   # Automatización Git Flow + PRs (Bash)
└── gitflow-setup.txt  # Misma lógica en PowerShell (referencia)
```

## Puesta en marcha rápida (Windows)

### Opción 1: script

Doble clic en `run-all.bat` o desde la raíz:

```bat
run-all.bat
```

### Opción 2: manual

**Terminal 1 — Backend**

```bash
cd backend
npm install
npm run dev
```

Por defecto la API escucha en `http://localhost:3001`.

**Terminal 2 — Frontend**

```bash
cd frontend
npm install
npm run dev
```

Abre la URL que indique Vite (normalmente `http://localhost:5173`).

## Variables de entorno (backend)

Copia `backend/.env.example` a `backend/.env` y ajusta credenciales SQL Server si las usas:

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (por defecto `3001`) |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Secretos para tokens JWT |
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` | Conexión a SQL Server |

## Base de datos

- Script SQL inicial: `backend/sql/init.sql` (crea base y tabla `Users`).
- Migraciones TypeORM: desde `backend`:

  ```bash
  npm run db:migrate
  ```

  Requiere SQL Server **en ejecución** y `.env` con datos correctos.

## Scripts útiles

| Ubicación | Comando | Descripción |
|-----------|---------|-------------|
| `backend` | `npm run dev` | Servidor en modo desarrollo |
| `backend` | `npm run build` | Compila TypeScript |
| `backend` | `npm run db:migrate` | Ejecuta migraciones |
| `backend` | `npm run db:revert` | Revierte última migración |
| `frontend` | `npm run dev` | Servidor de desarrollo Vite |
| `frontend` | `npm run build` | Build de producción |

## Usuario de prueba (seed)

Si el backend está conectado a la base y la migración creó la tabla, el arranque puede crear un administrador:

- **Email:** `admin@demo.com`  
- **Contraseña:** `123456`  

(Confirma en el código de `backend/src/main.ts` si el seed sigue activo.)

## Git y Git Flow

- El repositorio **no debe** incluir `node_modules` ni `.env` con secretos (`.gitignore` en la raíz).
- Para flujos con ramas `feature/*`, `hotfix/*` y PRs hacia `developer`, `qa` y `main`, revisa `gitflow-setup.sh` (Git Bash) o `gitflow-setup.txt` (PowerShell).

## Licencia

Uso académico / práctica — ajusta según tu institución.
