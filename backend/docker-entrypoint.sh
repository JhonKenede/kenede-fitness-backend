#!/bin/sh
set -e

echo "=== Starting kenede-fitness-api ==="
echo "PORT=$PORT | NODE_ENV=$NODE_ENV"

echo "--- Running migrations ---"
npx prisma migrate deploy

echo "--- Seeding exercises ---"
npx ts-node prisma/seed.ts

echo "--- Starting app ---"
exec node /app/dist/src/main.js
