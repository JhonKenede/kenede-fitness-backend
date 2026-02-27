# Kenede Fitness - Backend API

NestJS REST API for the Kenede Fitness application.

## Stack

- **NestJS** + TypeScript
- **PostgreSQL** + Prisma ORM
- **JWT** + Refresh Tokens
- **Redis** (cache-ready)
- **Docker Compose** for local development

## Quick Start

### 1. Start infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL on port `5432` and Redis on port `6379`.

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults work with Docker Compose as-is).

### 3. Install dependencies

```bash
npm install
```

### 4. Run migrations and seed

```bash
npm run prisma:migrate      # Run migrations
npm run prisma:seed         # Seed 22 exercises
```

Or reset everything at once:

```bash
npm run db:reset
```

### 5. Start the server

```bash
npm run start:dev
```

API available at `http://localhost:3000/api`

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/kenede_fitness` |
| `JWT_SECRET` | Secret for access tokens | — |
| `JWT_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | — |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `PORT` | Server port | `3000` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |

---

## API Endpoints

All responses follow the standard format:

```json
{
  "success": true,
  "data": { ... },
  "message": "string"
}
```

Base URL: `http://localhost:3000/api`

---

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Register user + create profile |
| POST | `/auth/login` | — | Login, returns JWT + refresh token |
| POST | `/auth/refresh` | refresh token | Rotate tokens |
| POST | `/auth/logout` | JWT | Invalidate refresh token |

**Register body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "age": 30,
  "weight": 80.5,
  "height": 178,
  "goal": "DEFINITION",
  "level": "BEGINNER",
  "daysPerWeek": 4
}
```

**Login body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Refresh body:**
```json
{
  "refreshToken": "<refresh_token>"
}
```

---

### Users

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users/me` | JWT | Get full profile |
| PUT | `/users/profile` | JWT | Update physical profile |

---

### Workouts

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/workouts` | JWT | List my workouts |
| POST | `/workouts` | JWT | Create workout with exercises |
| GET | `/workouts/:id` | JWT | Workout detail |
| PUT | `/workouts/:id` | JWT | Update workout |
| DELETE | `/workouts/:id` | JWT | Soft-delete workout |

**Create workout body:**
```json
{
  "name": "Push Day A",
  "description": "Chest, shoulders, triceps",
  "exercises": [
    {
      "exerciseId": "<uuid>",
      "sets": 4,
      "reps": 8,
      "weight": 80,
      "restTime": 120,
      "order": 1
    }
  ]
}
```

---

### Exercises

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/exercises` | JWT | List exercises (with filters) |
| GET | `/exercises/:id` | JWT | Exercise detail |

**Query params:**
- `muscleGroup`: `CHEST`, `BACK`, `SHOULDERS`, `ARMS`, `LEGS`, `CORE`, `FULL_BODY`
- `level`: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`
- `type`: `COMPOUND`, `ISOLATION`

Example: `GET /exercises?muscleGroup=CHEST&level=BEGINNER`

---

### Training Sessions

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/sessions` | JWT | Session history |
| POST | `/sessions` | JWT | Record completed session |
| GET | `/sessions/stats` | JWT | Volume & frequency stats |
| GET | `/sessions/:id` | JWT | Session detail |

**Create session body:**
```json
{
  "workoutId": "<uuid>",
  "date": "2024-01-15T10:00:00Z",
  "duration": 60,
  "totalVolume": 3200.5,
  "rpe": 8,
  "notes": "Felt strong today",
  "completed": true,
  "logs": [
    {
      "exerciseId": "<uuid>",
      "sets": 4,
      "reps": 8,
      "weight": 80,
      "rpe": 8
    }
  ]
}
```

---

### Body Metrics

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/metrics` | JWT | Metrics history |
| POST | `/metrics` | JWT | Record weight/measurements |

**Create metric body:**
```json
{
  "date": "2024-01-15",
  "weight": 82.5,
  "bodyFat": 18.5,
  "muscleMass": 67.4,
  "bmi": 26.1,
  "notes": "Morning measurement"
}
```

---

## Authentication Flow

1. `POST /auth/register` → receive `accessToken` + `refreshToken`
2. Use `accessToken` in header: `Authorization: Bearer <accessToken>`
3. When access token expires (15m), call `POST /auth/refresh` with `{ "refreshToken": "..." }`
4. Receive new `accessToken` + `refreshToken`
5. On logout: `POST /auth/logout` invalidates the refresh token server-side

---

## Database

### View with Prisma Studio

```bash
npm run prisma:studio
```

### Generate client after schema changes

```bash
npm run prisma:generate
```

### Create a new migration

```bash
npx prisma migrate dev --name <migration-name>
```

---

## Goals enum values

- `DEFINITION` — fat loss / body recomposition
- `VOLUME` — muscle building
- `MAINTENANCE` — maintain current state

## Level enum values

- `BEGINNER`
- `INTERMEDIATE`
- `ADVANCED`
