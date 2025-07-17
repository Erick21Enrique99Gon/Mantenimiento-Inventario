#!/bin/bash

# Script para construir imágenes Docker multiplataforma y empujarlas a Docker Hub
# Proyecto: PRACTICAFINAL-APLICACION-INVENTARIO

set -e

echo "🚀 Inicializando builder multiplataforma..."
docker buildx create --name multiarch-builder --use || true
docker buildx inspect --bootstrap

echo "🔐 Iniciando sesión en Docker Hub..."
docker login

echo "📦 Construyendo imagen del BACKEND..."
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag carlosmz87/pf_inventario_backend:latest \
  --push \
  -f backend/Dockerfile backend

echo "🎨 Construyendo imagen del FRONTEND..."
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag carlosmz87/pf_inventario_frontend:latest \
  --push \
  -f frontend/Dockerfile frontend

echo "🗄️ Construyendo imagen de la BASE DE DATOS..."
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag carlosmz87/pf_inventario_database:latest \
  --push \
  -f database/Dockerfile database

echo "✅ Todas las imágenes han sido construidas y subidas exitosamente a Docker Hub."