#!/bin/bash
# Med Rapidly Next.js 15 Setup Script

# Create new Next.js 15 project
npx create-next-app@latest med-rapidly \
  --typescript \
  --tailwind \
  --app \
  --eslint \
  --no-git \
  --no-src-dir \
  --import-alias '@/*'

cd med-rapidly

# Install additional dependencies
npm install \
  @hookform/resolvers \
  react-hook-form \
  zod \
  @tanstack/react-query \
  axios \
  ws \
  postgres \
  drizzle-orm \
  drizzle-kit \
  bcryptjs \
  jsonwebtoken \
  uuid \
  html2pdf \
  qrcode.react \
  date-fns \
  recharts \
  lucide-react

npm install -D \
  @types/bcryptjs \
  @types/jsonwebtoken \
  @types/uuid

echo "Next.js 15 project created successfully!"
