#!/bin/sh
set -e

echo "=== ENTRYPOINT START ==="
echo "PORT=$PORT"
echo "NODE_ENV=$NODE_ENV"

echo "=== Files in /app/dist/src ==="
ls /app/dist/src/ || echo "DIST DIR NOT FOUND"

echo "=== Running Prisma migrations ==="
npx prisma migrate deploy

echo "=== Starting NestJS app ==="
exec node /app/dist/src/main.js
