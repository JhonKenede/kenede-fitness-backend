#!/bin/sh
set -e

echo "=== Starting kenede-fitness-api ==="
echo "PORT=$PORT | NODE_ENV=$NODE_ENV"

echo "--- Resolving any failed migrations ---"
# If a migration was previously marked as failed, mark it as rolled-back
# so the fixed version can be re-applied cleanly
npx prisma migrate resolve --rolled-back "20260303120000_seed_workout_templates" 2>/dev/null || true
npx prisma migrate resolve --rolled-back "20260304140000_seed_training_plans" 2>/dev/null || true

echo "--- Running migrations ---"
npx prisma migrate deploy

echo "--- Seeding exercises ---"
npx ts-node prisma/seed.ts 2>/dev/null || echo '--- Seed skipped (already done or ts-node unavailable) ---'

echo "--- Seeding training plans ---"
npx ts-node prisma/seed-plans.ts 2>/dev/null || echo '--- Plans seed skipped ---'

echo "--- Starting app ---"
exec node /app/dist/src/main.js
