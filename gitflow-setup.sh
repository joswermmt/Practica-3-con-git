#!/usr/bin/env bash
# =============================================================================
# Git Flow + PRs (Git Bash / Linux / macOS)
# Requisitos: git, GitHub CLI (gh), remoto "origin" configurado, gh auth login
# Uso: chmod +x gitflow-setup.sh && ./gitflow-setup.sh
# =============================================================================

set -euo pipefail

MAIN_BRANCH="${MAIN_BRANCH:-main}"
DEV_BRANCH="${DEV_BRANCH:-developer}"
QA_BRANCH="${QA_BRANCH:-qa}"

if ! command -v git >/dev/null 2>&1; then
  echo "ERROR: git no está instalado."
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: GitHub CLI (gh) no está instalado."
  echo "Instala desde: https://cli.github.com/  y ejecuta: gh auth login"
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "ERROR: No existe el remoto 'origin'."
  echo "Ejemplo: git remote add origin https://github.com/USUARIO/REPO.git"
  exit 1
fi

# Rama actual: si es master, renombrar a main
CURRENT="$(git branch --show-current)"
if [[ "$CURRENT" == "master" ]]; then
  git branch -M "$MAIN_BRANCH"
fi

# Asegurar README (repo no vacío)
if [[ ! -f README.md ]]; then
  echo "Proyecto CRUD Gestión de Usuarios" > README.md
fi

git add -A
if [[ -n "$(git status --porcelain)" ]]; then
  git commit -m "chore: initial project setup" || true
fi

# Ramas base: developer y qa desde main
git checkout "$MAIN_BRANCH" 2>/dev/null || git checkout -b "$MAIN_BRANCH"

if git show-ref --verify --quiet "refs/heads/$DEV_BRANCH"; then
  git checkout "$DEV_BRANCH"
else
  git checkout -b "$DEV_BRANCH"
fi

if git show-ref --verify --quiet "refs/heads/$QA_BRANCH"; then
  git checkout "$QA_BRANCH"
else
  git checkout -b "$QA_BRANCH"
fi

git checkout "$DEV_BRANCH"

WORK_BRANCHES=(
  "feature/login-form"
  "feature/validate-user-input"
  "feature/payment-api-integration"
  "feature/user-dashboard"
  "hotfix/fix-date-format"
)

mkdir -p docs

for b in "${WORK_BRANCHES[@]}"; do
  git checkout "$DEV_BRANCH"
  git pull origin "$DEV_BRANCH" 2>/dev/null || true

  if git show-ref --verify --quiet "refs/heads/$b"; then
    git checkout "$b"
  else
    git checkout -b "$b"
  fi

  SAFE="${b//\//-}"
  FILE="docs/${SAFE}.md"
  {
    echo "# $b"
    echo "Implementación de trabajo en $b"
    echo "Fecha: $(date '+%Y-%m-%d %H:%M:%S')"
  } > "$FILE"

  git add "$FILE"
  if [[ -n "$(git status --porcelain)" ]]; then
    git commit -m "feat: implement $b"
  fi

  git push -u origin "$b"
done

merge_pr() {
  local base="$1"
  local head="$2"
  local title="$3"
  local body="$4"

  # Si ya existe PR abierto, solo merge
  local num
  num="$(gh pr list --head "$head" --base "$base" --state open --json number -q '.[0].number' 2>/dev/null || true)"
  if [[ -z "$num" || "$num" == "null" ]]; then
    gh pr create --base "$base" --head "$head" --title "$title" --body "$body"
    num="$(gh pr list --head "$head" --base "$base" --state open --json number -q '.[0].number')"
  fi
  if [[ -n "$num" && "$num" != "null" ]]; then
    gh pr merge "$num" --merge --delete-branch=false
  fi
}

for b in "${WORK_BRANCHES[@]}"; do
  merge_pr "$DEV_BRANCH" "$b" "[$b] -> $DEV_BRANCH" "Integración de $b hacia $DEV_BRANCH"
  merge_pr "$QA_BRANCH" "$b" "[$b] -> $QA_BRANCH" "Promoción de $b hacia $QA_BRANCH"
  merge_pr "$MAIN_BRANCH" "$b" "[$b] -> $MAIN_BRANCH" "Release de $b hacia $MAIN_BRANCH"
done

git checkout "$MAIN_BRANCH"
git pull origin "$MAIN_BRANCH" || true
echo "Listo: 5 ramas × 3 PR = 15 PR cerrados (si gh y permisos OK). Rama actual: $MAIN_BRANCH"
