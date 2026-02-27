# Tarea: Backend MVP - Kenede Fitness App

## Stack
- NestJS + TypeScript
- PostgreSQL + Prisma ORM
- JWT + Refresh Tokens
- Redis (caché)
- Docker Compose para desarrollo local

## Estructura a crear

```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── jwt-refresh.strategy.ts
│   │   └── dto/
│   │       ├── register.dto.ts
│   │       └── login.dto.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │       └── update-profile.dto.ts
│   ├── workouts/
│   │   ├── workouts.module.ts
│   │   ├── workouts.controller.ts
│   │   ├── workouts.service.ts
│   │   └── dto/
│   ├── exercises/
│   │   ├── exercises.module.ts
│   │   ├── exercises.controller.ts
│   │   └── exercises.service.ts
│   ├── sessions/ (training sessions)
│   │   ├── sessions.module.ts
│   │   ├── sessions.controller.ts
│   │   └── sessions.service.ts
│   ├── prisma/
│   │   └── prisma.service.ts
│   ├── common/
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   └── interceptors/
│   │       └── response.interceptor.ts
│   └── app.module.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts (ejercicios de ejemplo)
├── docker-compose.yml
├── .env.example
├── package.json
└── tsconfig.json
```

## Schema Prisma Completo

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

enum Goal {
  DEFINITION
  VOLUME
  MAINTENANCE
}

enum Level {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum MuscleGroup {
  CHEST
  BACK
  SHOULDERS
  ARMS
  LEGS
  CORE
  FULL_BODY
}

enum ExerciseType {
  COMPOUND
  ISOLATION
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  password     String
  role         Role      @default(USER)
  refreshToken String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  profile      Profile?
  workouts     Workout[]
  sessions     TrainingSession[]
  metrics      BodyMetric[]
  nutritionLogs NutritionLog[]
}

model Profile {
  id          String    @id @default(uuid())
  userId      String    @unique
  firstName   String
  lastName    String?
  age         Int?
  weight      Float?    // kg
  height      Float?    // cm
  goal        Goal?
  level       Level     @default(BEGINNER)
  injuries    String[]
  daysPerWeek Int?
  equipment   String[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Exercise {
  id           String        @id @default(uuid())
  name         String
  muscleGroup  MuscleGroup
  videoUrl     String?
  technique    String?
  level        Level         @default(BEGINNER)
  type         ExerciseType
  equipment    String[]
  instructions String?
  createdAt    DateTime      @default(now())
  
  workoutExercises WorkoutExercise[]
  exerciseLogs     ExerciseLog[]
}

model Workout {
  id          String    @id @default(uuid())
  userId      String
  name        String
  description String?
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  exercises   WorkoutExercise[]
  sessions    TrainingSession[]
}

model WorkoutExercise {
  id         String   @id @default(uuid())
  workoutId  String
  exerciseId String
  sets       Int
  reps       Int
  weight     Float?
  restTime   Int?     // segundos
  order      Int
  
  workout    Workout  @relation(fields: [workoutId], references: [id], onDelete: Cascade)
  exercise   Exercise @relation(fields: [exerciseId], references: [id])
}

model TrainingSession {
  id          String    @id @default(uuid())
  userId      String
  workoutId   String?
  date        DateTime  @default(now())
  duration    Int?      // minutos
  totalVolume Float?    // kg totales
  rpe         Int?      // 1-10
  notes       String?
  completed   Boolean   @default(false)
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  workout     Workout?  @relation(fields: [workoutId], references: [id])
  logs        ExerciseLog[]
}

model ExerciseLog {
  id          String          @id @default(uuid())
  sessionId   String
  exerciseId  String
  sets        Int
  reps        Int
  weight      Float?
  rpe         Int?
  notes       String?
  
  session     TrainingSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  exercise    Exercise        @relation(fields: [exerciseId], references: [id])
}

model BodyMetric {
  id          String   @id @default(uuid())
  userId      String
  date        DateTime @default(now())
  weight      Float?
  bodyFat     Float?
  muscleMass  Float?
  bmi         Float?
  notes       String?
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model NutritionLog {
  id          String   @id @default(uuid())
  userId      String
  date        DateTime @default(now())
  calories    Float
  protein     Float?
  carbs       Float?
  fat         Float?
  water       Float?   // litros
  notes       String?
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Endpoints a implementar (MVP)

### Auth
- POST /auth/register → crear usuario + perfil básico
- POST /auth/login → JWT + refreshToken
- POST /auth/refresh → renovar token
- POST /auth/logout → invalidar refresh token

### Users
- GET /users/me → perfil completo
- PUT /users/profile → actualizar perfil físico + objetivos

### Workouts
- GET /workouts → mis rutinas
- POST /workouts → crear rutina con ejercicios
- GET /workouts/:id → detalle rutina
- PUT /workouts/:id → editar rutina
- DELETE /workouts/:id → eliminar

### Exercises
- GET /exercises → lista con filtros (muscleGroup, level, type)
- GET /exercises/:id → detalle

### Training Sessions
- GET /sessions → historial de sesiones
- POST /sessions → registrar sesión completada
- GET /sessions/:id → detalle sesión
- GET /sessions/stats → estadísticas (volumen, frecuencia)

### Body Metrics
- GET /metrics → historial de métricas
- POST /metrics → registrar peso/medidas

## Respuesta estándar (interceptor)

Todas las respuestas deben ser:
```json
{
  "success": true,
  "data": { ... },
  "message": "string"
}
```

## Configuración

### .env.example
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kenede_fitness"
JWT_SECRET="super-secret-jwt-key-change-in-prod"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="super-secret-refresh-key-change-in-prod"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3000
REDIS_URL="redis://localhost:6379"
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: kenede_fitness
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

## Seed de ejercicios

Incluye al menos 20 ejercicios reales con: nombre, grupo muscular, tipo, equipamiento necesario, instrucciones básicas.

## Validaciones importantes

- Usar class-validator en todos los DTOs
- Guards JWT en todos los endpoints protegidos
- Hashear passwords con bcrypt (rounds: 10)
- Validar que el usuario solo acceda a sus propios datos

## README.md

Incluye:
- Cómo iniciar con Docker
- Variables de entorno
- Endpoints documentados
- Cómo hacer seed de la BD

