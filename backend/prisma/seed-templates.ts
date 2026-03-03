/**
 * seed-templates.ts
 * Seeds workout templates using the real exercise UUIDs from the production DB.
 * Run with: DATABASE_URL="..." npx ts-node prisma/seed-templates.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Exercise IDs as they exist in the production DB (seeded by seed.ts)
// Obtained via GET /api/exercises
const EXERCISES = {
  // CHEST
  BENCH_PRESS:       'b7f6bf25-f5ca-4bad-be59-8b33b246df1f', // Press de banca plano
  INCLINE_PRESS:     '046cd146-0115-41fc-aaaa-893ede1e2e9e', // Press de banca inclinado
  DECLINE_PRESS:     'a0306964-9025-4708-8b1e-3239e8fec5a8', // Press de banca declinado
  CABLE_CROSSOVER:   '24e0451c-70bb-4249-9ec8-85c5af4849cb', // Crossover en polea
  DB_PRESS_FLAT:     'a6e21dd9-5f00-4027-b800-013a64116aed', // Press con mancuernas plano
  CHEST_FLY:         '39a932d3-7419-4f59-a9fa-0493266f7f69', // Aperturas con mancuernas
  DIPS_CHEST:        'cf30dff7-2566-4dd2-826f-48c9d14a21f9', // Fondos en paralelas (pecho)
  PUSHUPS:           '064a7587-823b-4222-8a02-2f603afa0f61', // Flexiones

  // BACK
  PULLUPS:           '2517c042-ca75-4e5f-a441-78bc4d49faf4', // Dominadas
  BARBELL_ROW:       '76674e81-c47e-4803-9dab-b2ba4fe916dc', // Remo con barra
  DB_ROW:            'a3bdbedf-5293-4384-9c59-685eeecb7688', // Remo con mancuerna
  LAT_PULLDOWN:      '6ef1fc44-b63a-41b0-a482-a83443f92244', // Jalón al pecho en polea
  DEADLIFT:          '27784360-3609-4231-a0a1-b9722392e549', // Peso muerto
  CABLE_ROW:         '84e2cfb4-3259-41a0-95e3-67c6a2ff483a', // Remo en polea baja
  FACE_PULL:         'a0da9e15-450a-47ce-9010-70705d1d91d7', // Face pull
  MACHINE_ROW:       '76aa1a73-cb41-43b9-b316-5dd5eba0e609', // Remo en máquina

  // SHOULDERS
  MILITARY_PRESS:    '5a3a65d1-a6a5-44b1-80f3-fefc319cd690', // Press militar con barra
  DB_SHOULDER_PRESS: '43e8abb6-a917-4d0d-8031-33e50aa5d2cb', // Press con mancuernas (hombros)
  LATERAL_RAISE:     '6f9e9ee3-fabb-4ae9-8cae-f48cce76b70a', // Elevaciones laterales
  FRONT_RAISE:       'fd883e59-9029-4f3c-9489-f042b48dfb2d', // Elevaciones frontales
  REAR_DELT_FLY:     '197413c4-5326-4fa1-8dbe-1c756e9a38b7', // Pájaro (deltoides posterior)
  ARNOLD_PRESS:      '0c7a8770-b5e3-4f3c-a218-5c65a108c46f', // Press Arnold

  // ARMS
  BARBELL_CURL:      'aa296a7d-d26e-4336-8fd1-936f6a9d7945', // Curl de bíceps con barra
  DB_CURL:           '53e6628b-e17a-4313-a9f7-c44643d15ee4', // Curl de bíceps con mancuernas
  HAMMER_CURL:       'efe3be89-4749-4ba2-95de-27f93f238c13', // Curl martillo
  CABLE_CURL:        '15a62a61-faf9-4300-80c9-c0a0bc99ee18', // Curl en polea
  TRICEP_PUSHDOWN:   'c60d77e4-cb81-4784-8cc3-8f8497fc8ff7', // Extensión de tríceps en polea
  FRENCH_PRESS:      'e1df28e5-e947-43b5-8bee-212b0cd50635', // Press francés
  CLOSE_GRIP_BENCH:  '978ca826-d580-4b29-a88b-3f9da9a67a37', // Press cerrado
  TRICEP_DIPS:       'a11b5a4f-281c-4983-9019-e2dae53c19d7', // Fondos para tríceps

  // LEGS
  SQUAT:             '38349672-788d-4e09-9035-66d462dbff57', // Sentadilla con barra
  LEG_PRESS:         'f4ff92d8-e7b5-40ed-b6ec-beb4ab4c782a', // Prensa de piernas
  LUNGES:            'ac4eab23-f5c2-4904-9cfc-1e27575e72d2', // Zancadas
  LEG_EXTENSION:     'afd3b1fe-a408-481c-9fbc-b8ab3a514140', // Extensión de cuádriceps
  LEG_CURL:          '2ad34e84-69fd-48e0-80fd-18894868fba2', // Curl femoral tumbado
  ROMANIAN_DL:       '01b9177e-4b96-4291-b688-c8eb648091a0', // Peso muerto rumano
  CALF_RAISE:        '565a3d4f-c7ac-4ead-afc9-698aceda5d44', // Elevación de gemelos de pie
  BULGARIAN_SQUAT:   '91eb2751-cdee-4b8a-b643-da8fb53eff69', // Sentadilla búlgara
  HIP_THRUST:        'e17ea048-3137-4167-882e-568d012b6a66', // Hip thrust

  // CORE
  CRUNCH:            '79585bf7-d735-4572-a4e0-36e4daf59586', // Crunch abdominal
  PLANK:             'cf15fdf3-0c9d-48f2-9b1f-c522a1a33400', // Plancha frontal
  SIDE_PLANK:        '77df5175-4492-4278-ba21-560102670982', // Plancha lateral
  LEG_RAISES:        'b963bafc-6e51-4331-91d8-1a1080d121d6', // Elevación de piernas tumbado
  RUSSIAN_TWIST:     '8050fff1-9f6c-414a-bfbd-e84e228138ca', // Russian twist
  AB_WHEEL:          '9693eefc-3a05-41d0-8217-3eaee5996652', // Rueda abdominal

  // FULL BODY
  BURPEES:           '44815e6d-46bc-40d7-b3a4-af259852a23d', // Burpees
  KB_SWING:          '33580ec5-8d06-4994-8cd9-395e1e483cb1', // Kettlebell swing
  THRUSTER:          '64ebe01f-ee2e-4295-949c-80ee2b3bde02', // Thruster
};

const templates = [
  {
    name: 'Pecho — Hipertrofia',
    description: 'Press + Inclinado + Crossover · Hipertrofia completa de pecho',
    category: 'CHEST',
    muscleGroups: ['CHEST'],
    exercises: [
      { exerciseId: EXERCISES.BENCH_PRESS,     sets: 4, reps: 8,  weight: 60, restTime: 90,  order: 1 },
      { exerciseId: EXERCISES.INCLINE_PRESS,   sets: 3, reps: 10, weight: 40, restTime: 90,  order: 2 },
      { exerciseId: EXERCISES.CABLE_CROSSOVER, sets: 3, reps: 12, weight: 15, restTime: 60,  order: 3 },
      { exerciseId: EXERCISES.CHEST_FLY,       sets: 3, reps: 12, weight: 12, restTime: 60,  order: 4 },
    ],
  },
  {
    name: 'Espalda — Ancha y Fuerte',
    description: 'Dominadas + Remo + Jalón · Espalda ancha y poderosa',
    category: 'BACK',
    muscleGroups: ['BACK'],
    exercises: [
      { exerciseId: EXERCISES.PULLUPS,      sets: 4, reps: 6,  weight: 0,  restTime: 120, order: 1 },
      { exerciseId: EXERCISES.BARBELL_ROW,  sets: 4, reps: 8,  weight: 70, restTime: 90,  order: 2 },
      { exerciseId: EXERCISES.LAT_PULLDOWN, sets: 3, reps: 10, weight: 55, restTime: 90,  order: 3 },
      { exerciseId: EXERCISES.CABLE_ROW,    sets: 3, reps: 12, weight: 50, restTime: 60,  order: 4 },
    ],
  },
  {
    name: 'Piernas — Fuerza Total',
    description: 'Sentadilla + Prensa + Peso muerto rumano · Fuerza e hipertrofia',
    category: 'LEGS',
    muscleGroups: ['LEGS'],
    exercises: [
      { exerciseId: EXERCISES.SQUAT,       sets: 4, reps: 6,  weight: 80,  restTime: 120, order: 1 },
      { exerciseId: EXERCISES.LEG_PRESS,   sets: 3, reps: 10, weight: 120, restTime: 90,  order: 2 },
      { exerciseId: EXERCISES.ROMANIAN_DL, sets: 3, reps: 10, weight: 60,  restTime: 90,  order: 3 },
      { exerciseId: EXERCISES.LEG_CURL,    sets: 3, reps: 12, weight: 40,  restTime: 60,  order: 4 },
      { exerciseId: EXERCISES.CALF_RAISE,  sets: 4, reps: 15, weight: 60,  restTime: 45,  order: 5 },
    ],
  },
  {
    name: 'Hombros — Redondeados',
    description: 'Press militar + Laterales + Face Pull · Hombros completos',
    category: 'SHOULDERS',
    muscleGroups: ['SHOULDERS'],
    exercises: [
      { exerciseId: EXERCISES.MILITARY_PRESS, sets: 4, reps: 8,  weight: 40, restTime: 90, order: 1 },
      { exerciseId: EXERCISES.LATERAL_RAISE,  sets: 4, reps: 12, weight: 10, restTime: 60, order: 2 },
      { exerciseId: EXERCISES.FACE_PULL,      sets: 3, reps: 15, weight: 20, restTime: 60, order: 3 },
      { exerciseId: EXERCISES.REAR_DELT_FLY,  sets: 3, reps: 15, weight: 10, restTime: 60, order: 4 },
    ],
  },
  {
    name: 'Brazos — Bíceps y Tríceps',
    description: 'Curl + Tríceps · Brazos completos',
    category: 'ARMS',
    muscleGroups: ['ARMS'],
    exercises: [
      { exerciseId: EXERCISES.BARBELL_CURL,    sets: 4, reps: 10, weight: 30, restTime: 60, order: 1 },
      { exerciseId: EXERCISES.HAMMER_CURL,     sets: 3, reps: 12, weight: 16, restTime: 60, order: 2 },
      { exerciseId: EXERCISES.TRICEP_PUSHDOWN, sets: 4, reps: 12, weight: 25, restTime: 60, order: 3 },
      { exerciseId: EXERCISES.FRENCH_PRESS,    sets: 3, reps: 10, weight: 20, restTime: 60, order: 4 },
    ],
  },
  {
    name: 'Core — Abdomen de Hierro',
    description: 'Plancha + Crunch + Rueda · Core fuerte y estable',
    category: 'CORE',
    muscleGroups: ['CORE'],
    exercises: [
      { exerciseId: EXERCISES.PLANK,         sets: 4, reps: 45, weight: 0, restTime: 60, order: 1 },
      { exerciseId: EXERCISES.CRUNCH,        sets: 3, reps: 20, weight: 0, restTime: 45, order: 2 },
      { exerciseId: EXERCISES.LEG_RAISES,    sets: 3, reps: 15, weight: 0, restTime: 45, order: 3 },
      { exerciseId: EXERCISES.RUSSIAN_TWIST, sets: 3, reps: 20, weight: 5, restTime: 45, order: 4 },
      { exerciseId: EXERCISES.AB_WHEEL,      sets: 3, reps: 10, weight: 0, restTime: 60, order: 5 },
    ],
  },
  {
    name: 'Full Body — Cuerpo Completo',
    description: 'Peso muerto + Sentadilla + Press + Dominadas · Máxima eficiencia',
    category: 'FULL_BODY',
    muscleGroups: ['CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE'],
    exercises: [
      { exerciseId: EXERCISES.DEADLIFT,      sets: 4, reps: 5, weight: 100, restTime: 180, order: 1 },
      { exerciseId: EXERCISES.SQUAT,         sets: 3, reps: 8, weight: 80,  restTime: 120, order: 2 },
      { exerciseId: EXERCISES.BENCH_PRESS,   sets: 3, reps: 8, weight: 60,  restTime: 90,  order: 3 },
      { exerciseId: EXERCISES.PULLUPS,       sets: 3, reps: 6, weight: 0,   restTime: 90,  order: 4 },
      { exerciseId: EXERCISES.MILITARY_PRESS, sets: 3, reps: 8, weight: 40, restTime: 90,  order: 5 },
    ],
  },
];

async function main() {
  // Check if templates already exist
  const existingCount = await prisma.workout.count({ where: { isTemplate: true } });
  if (existingCount > 0) {
    console.log(`⏭️  Templates already seeded (${existingCount} found). Skipping.`);
    return;
  }

  console.log('🌱 Seeding workout templates...');

  for (const tpl of templates) {
    const created = await prisma.workout.create({
      data: {
        name: tpl.name,
        description: tpl.description,
        isTemplate: true,
        isActive: true,
        category: tpl.category,
        muscleGroups: tpl.muscleGroups,
        dayOfWeek: [],
        exercises: {
          create: tpl.exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            restTime: ex.restTime,
            order: ex.order,
          })),
        },
      },
      include: { exercises: { include: { exercise: true } } },
    });
    console.log(`  ✅ ${created.name} (${created.exercises.length} ejercicios)`);
  }

  console.log(`\n🎉 ${templates.length} templates seeded successfully!`);
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
