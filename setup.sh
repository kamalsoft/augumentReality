#!/bin/bash

echo "Creating AR Product Experience folder structure..."

# Root src folder
mkdir -p src

# App routes
mkdir -p src/app/ar-viewer
mkdir -p src/app/product/[id]

# Components
mkdir -p src/components/ar
mkdir -p src/components/ui

# Lib
mkdir -p src/lib

# Public assets
mkdir -p public/models

# Create placeholder files
touch src/app/ar-viewer/page.tsx
touch src/app/product/[id]/page.tsx
touch src/app/layout.tsx
touch src/app/page.tsx
touch src/app/globals.css

touch src/components/ar/ARCanvas.tsx
touch src/components/ar/ModelView.tsx
touch src/components/ar/SceneSelect.tsx

touch src/components/ui/Header.tsx
touch src/components/ui/CartDrawer.tsx
touch src/components/ui/ProductCard.tsx
touch src/components/ui/Button.tsx

touch src/lib/store.ts
touch src/lib/data.ts
touch src/lib/types.ts

# Run instructions
cat << 'EOF' > RUN_INSTRUCTIONS.md
# AR Product Experience — Run Instructions

## 1. Install Dependencies
npm install

## 2. Run the Dev Server
npm run dev

## 3. Folder Overview
- src/app — App Router pages
- src/components — UI + AR components
- src/lib — Zustand store, mock data, types
- public/models — 3D .glb files

## 4. Tech Stack
Next.js 14, TypeScript, Tailwind CSS, Zustand, Framer Motion, Three.js/Model-Viewer
EOF

echo "Folder structure created successfully!"
