import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Exercise ID map (name → UUID) ─────────────────────────────────────────
const KNOWN: Record<string, string> = {
  // PECHO
  'Press de banca plano':           'b7f6bf25-f5ca-4bad-be59-8b33b246df1f',
  'Press de banca inclinado':       '046cd146-0115-41fc-aaaa-893ede1e2e9e',
  'Press de banca declinado':       'a0306964-9025-4708-8b1e-3239e8fec5a8',
  'Press con mancuernas plano':     'a6e21dd9-5f00-4027-b800-013a64116aed',
  'Aperturas con mancuernas':       '39a932d3-7419-4f59-a9fa-0493266f7f69',
  'Fondos en paralelas (pecho)':    'cf30dff7-2566-4dd2-826f-48c9d14a21f9',
  'Flexiones':                      '064a7587-823b-4222-8a02-2f603afa0f61',
  'Crossover en polea':             '24e0451c-70bb-4249-9ec8-85c5af4849cb',
  'Press en máquina (pecho)':       'b75baa93-6ba6-4b2d-a44c-b48b8b9cfc44',
  'Pullover con mancuerna':         'a069f9d5-9438-4cc2-9fda-2f0ac60e3e95',
  // ESPALDA
  'Dominadas':                      '2517c042-ca75-4e5f-a441-78bc4d49faf4',
  'Remo con barra':                 '76674e81-c47e-4803-9dab-b2ba4fe916dc',
  'Remo con mancuerna':             'a3bdbedf-5293-4384-9c59-685eeecb7688',
  'Jalón al pecho en polea':        '6ef1fc44-b63a-41b0-a482-a83443f92244',
  'Peso muerto':                    '27784360-3609-4231-a0a1-b9722392e549',
  'Remo en máquina':                '76aa1a73-cb41-43b9-b316-5dd5eba0e609',
  'Remo en polea baja':             '84e2cfb4-3259-41a0-95e3-67c6a2ff483a',
  'Face pull':                      'a0da9e15-450a-47ce-9010-70705d1d91d7',
  // HOMBROS
  'Press militar con barra':        '5a3a65d1-a6a5-44b1-80f3-fefc319cd690',
  'Press con mancuernas (hombros)': '43e8abb6-a917-4d0d-8031-33e50aa5d2cb',
  'Elevaciones laterales':          '6f9e9ee3-fabb-4ae9-8cae-f48cce76b70a',
  'Elevaciones frontales':          'fd883e59-9029-4f3c-9489-f042b48dfb2d',
  'Pájaro (deltoides posterior)':   '197413c4-5326-4fa1-8dbe-1c756e9a38b7',
  'Elevaciones laterales en polea': 'b783341e-f088-41ee-9ae7-0c5dcac7e175',
  // BRAZOS
  'Curl de bíceps con barra':       'aa296a7d-d26e-4336-8fd1-936f6a9d7945',
  'Curl de bíceps con mancuernas':  '53e6628b-e17a-4313-a9f7-c44643d15ee4',
  'Curl martillo':                  'efe3be89-4749-4ba2-95de-27f93f238c13',
  'Curl en banco Scott':            '5dcd5efc-4b44-44f6-9666-ca2a8ceb295a',
  'Fondos para tríceps':            'a11b5a4f-281c-4983-9019-e2dae53c19d7',
  'Press francés':                  'e1df28e5-e947-43b5-8bee-212b0cd50635',
  'Extensión de tríceps en polea':  'c60d77e4-cb81-4784-8cc3-8f8497fc8ff7',
  'Press cerrado':                  '978ca826-d580-4b29-a88b-3f9da9a67a37',
  'Curl en polea':                  '15a62a61-faf9-4300-80c9-c0a0bc99ee18',
  'Extensión tríceps sobre la cabeza': '6ddce323-9374-4df4-8fda-16554a76ae45',
  // PIERNAS
  'Sentadilla con barra':           '38349672-788d-4e09-9035-66d462dbff57',
  'Prensa de piernas':              'f4ff92d8-e7b5-40ed-b6ec-beb4ab4c782a',
  'Zancadas':                       'ac4eab23-f5c2-4904-9cfc-1e27575e72d2',
  'Extensión de cuádriceps':        'afd3b1fe-a408-481c-9fbc-b8ab3a514140',
  'Curl femoral tumbado':           '2ad34e84-69fd-48e0-80fd-18894868fba2',
  'Peso muerto rumano':             '01b9177e-4b96-4291-b688-c8eb648091a0',
  'Elevación de gemelos de pie':    '565a3d4f-c7ac-4ead-afc9-698aceda5d44',
  'Sentadilla búlgara':             '91eb2751-cdee-4b8a-b643-da8fb53eff69',
  'Hip thrust':                     'e17ea048-3137-4167-882e-568d012b6a66',
  'Sentadilla goblet':              'b405ca9d-2bd0-4a66-8679-ba5c3552ffb4',
  // CORE
  'Crunch abdominal':               '79585bf7-d735-4572-a4e0-36e4daf59586',
  'Plancha frontal':                'cf15fdf3-0c9d-48f2-9b1f-c522a1a33400',
  'Plancha lateral':                '77df5175-4492-4278-ba21-560102670982',
  'Elevación de piernas tumbado':   'b963bafc-6e51-4331-91d8-1a1080d121d6',
  'Russian twist':                  '8050fff1-9f6c-414a-bfbd-e84e228138ca',
  'Rueda abdominal':                '9693eefc-3a05-41d0-8217-3eaee5996652',
  'Crunch en polea':                '47090c14-5942-46f1-9ab6-e3b95188c259',
  // CUERPO COMPLETO
  'Burpees':                        '44815e6d-46bc-40d7-b3a4-af259852a23d',
  'Kettlebell swing':               '33580ec5-8d06-4994-8cd9-395e1e483cb1',
  'Thruster':                       '64ebe01f-ee2e-4295-949c-80ee2b3bde02',
};

// Dynamic map filled at runtime for new exercises
let EX: Record<string, string> = { ...KNOWN };

async function loadDynamicExercises() {
  const newNames = [
    'Sentadilla sumo con barra',
    'Curl femoral sentado',
    'Gemelos sentado',
    'Remo T-bar',
    'Box squat',
    'Patada trasera en polea',
    'Abductor de cadera en máquina',
    'Patada de tríceps kickback',
    'Curl concentrado sentado',
    'Zancadas caminando',
    'Saltos verticales',
    'Box jumps',
    'Plancha con peso',
    'Anti-rotación en polea',
    'Extensión de cadera en polea',
  ];
  for (const name of newNames) {
    const found = await prisma.exercise.findFirst({ where: { name } });
    if (found) {
      EX[name] = found.id;
    } else {
      console.warn(`⚠️  Exercise not found in DB: "${name}"`);
    }
  }
}

// ─── Types ──────────────────────────────────────────────────────────────────
type ExRow = { exerciseName: string; sets: number; reps: number; restTime: number };
type DayDef = {
  dayNumber: number;
  dayLabel: string;
  isRestDay: boolean;
  workoutName?: string;
  category?: string;
  muscleGroups?: string[];
  exercises?: ExRow[];
};

// ─── Plan data ──────────────────────────────────────────────────────────────
const plans: Array<{
  name: string; description: string; goal: string; gender: string;
  daysPerWeek: number; level: string; emoji: string; days: DayDef[];
}> = [

  // ═══════════════════════════════════════════════════════
  // PLAN 1 — Hombre: Volumen PPL (5 días)
  // ═══════════════════════════════════════════════════════
  {
    name: 'Volumen PPL',
    description: 'Programa Push/Pull/Legs de 5 días orientado a ganar masa muscular. Alta frecuencia y volumen progresivo.',
    goal: 'VOLUME', gender: 'MALE', daysPerWeek: 5, level: 'INTERMEDIATE', emoji: '🔵',
    days: [
      {
        dayNumber: 1, dayLabel: 'Push — Pecho, Hombros, Tríceps', isRestDay: false,
        workoutName: 'PPL Push A', category: 'CHEST', muscleGroups: ['CHEST', 'SHOULDERS', 'ARMS'],
        exercises: [
          { exerciseName: 'Press de banca plano',          sets: 4, reps: 8,  restTime: 150 },
          { exerciseName: 'Press de banca inclinado',       sets: 4, reps: 10, restTime: 90  },
          { exerciseName: 'Crossover en polea',             sets: 3, reps: 12, restTime: 60  },
          { exerciseName: 'Press militar con barra',        sets: 4, reps: 8,  restTime: 150 },
          { exerciseName: 'Elevaciones laterales',          sets: 3, reps: 15, restTime: 60  },
          { exerciseName: 'Fondos en paralelas (pecho)',    sets: 3, reps: 10, restTime: 90  },
          { exerciseName: 'Extensión de tríceps en polea',  sets: 3, reps: 12, restTime: 60  },
        ],
      },
      {
        dayNumber: 2, dayLabel: 'Pull — Espalda, Bíceps', isRestDay: false,
        workoutName: 'PPL Pull A', category: 'BACK', muscleGroups: ['BACK', 'ARMS'],
        exercises: [
          { exerciseName: 'Dominadas',                sets: 4, reps: 8,  restTime: 150 },
          { exerciseName: 'Remo con barra',           sets: 4, reps: 8,  restTime: 150 },
          { exerciseName: 'Remo en polea baja',       sets: 4, reps: 12, restTime: 90  },
          { exerciseName: 'Pullover con mancuerna',   sets: 3, reps: 12, restTime: 60  },
          { exerciseName: 'Curl de bíceps con barra', sets: 4, reps: 10, restTime: 90  },
          { exerciseName: 'Curl martillo',            sets: 3, reps: 12, restTime: 60  },
          { exerciseName: 'Curl femoral tumbado',     sets: 3, reps: 12, restTime: 60  },
        ],
      },
      { dayNumber: 3, dayLabel: 'Descanso', isRestDay: true },
      {
        dayNumber: 4, dayLabel: 'Legs — Cuádriceps, Isquios, Glúteos', isRestDay: false,
        workoutName: 'PPL Piernas', category: 'LEGS', muscleGroups: ['LEGS'],
        exercises: [
          { exerciseName: 'Sentadilla con barra',       sets: 5, reps: 8,  restTime: 150 },
          { exerciseName: 'Prensa de piernas',          sets: 4, reps: 12, restTime: 120 },
          { exerciseName: 'Sentadilla búlgara',         sets: 3, reps: 12, restTime: 90  },
          { exerciseName: 'Extensión de cuádriceps',    sets: 3, reps: 15, restTime: 60  },
          { exerciseName: 'Curl femoral tumbado',       sets: 3, reps: 12, restTime: 60  },
          { exerciseName: 'Hip thrust',                 sets: 4, reps: 12, restTime: 90  },
          { exerciseName: 'Elevación de gemelos de pie',sets: 4, reps: 20, restTime: 45  },
        ],
      },
      {
        dayNumber: 5, dayLabel: 'Push B — Pecho, Hombros, Tríceps', isRestDay: false,
        workoutName: 'PPL Push B', category: 'CHEST', muscleGroups: ['CHEST', 'SHOULDERS', 'ARMS'],
        exercises: [
          { exerciseName: 'Press de banca inclinado',        sets: 4, reps: 10, restTime: 120 },
          { exerciseName: 'Press de banca declinado',        sets: 3, reps: 10, restTime: 90  },
          { exerciseName: 'Crossover en polea',              sets: 3, reps: 12, restTime: 60  },
          { exerciseName: 'Press con mancuernas (hombros)',  sets: 3, reps: 10, restTime: 90  },
          { exerciseName: 'Elevaciones frontales',           sets: 3, reps: 15, restTime: 60  },
          { exerciseName: 'Press francés',                   sets: 3, reps: 10, restTime: 90  },
          { exerciseName: 'Patada de tríceps kickback',      sets: 3, reps: 15, restTime: 60  },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // PLAN 2 — Hombre: Volumen UPL (4 días)
  // ═══════════════════════════════════════════════════════
  {
    name: 'Volumen Upper/Lower',
    description: 'Programa Upper/Lower/Pull de 4 días. Combina fuerza en jornadas upper y volumen en lower.',
    goal: 'VOLUME', gender: 'MALE', daysPerWeek: 4, level: 'INTERMEDIATE', emoji: '⚡',
    days: [
      {
        dayNumber: 1, dayLabel: 'Upper A — Fuerza Empuje + Tirón', isRestDay: false,
        workoutName: 'UPL Upper A', category: 'CHEST', muscleGroups: ['CHEST', 'BACK', 'SHOULDERS'],
        exercises: [
          { exerciseName: 'Press de banca plano',   sets: 5, reps: 6,  restTime: 180 },
          { exerciseName: 'Remo con barra',          sets: 5, reps: 6,  restTime: 180 },
          { exerciseName: 'Jalón al pecho en polea', sets: 3, reps: 8,  restTime: 150 },
          { exerciseName: 'Press de banca inclinado',sets: 3, reps: 10, restTime: 120 },
          { exerciseName: 'Remo con mancuerna',      sets: 3, reps: 10, restTime: 90  },
        ],
      },
      {
        dayNumber: 2, dayLabel: 'Lower — Cuádriceps, Isquios, Glúteos', isRestDay: false,
        workoutName: 'UPL Piernas', category: 'LEGS', muscleGroups: ['LEGS'],
        exercises: [
          { exerciseName: 'Sentadilla con barra',        sets: 4, reps: 8,  restTime: 150 },
          { exerciseName: 'Peso muerto rumano',          sets: 4, reps: 10, restTime: 90  },
          { exerciseName: 'Prensa de piernas',           sets: 3, reps: 12, restTime: 90  },
          { exerciseName: 'Hip thrust',                  sets: 3, reps: 12, restTime: 90  },
          { exerciseName: 'Extensión de cuádriceps',     sets: 3, reps: 15, restTime: 60  },
          { exerciseName: 'Elevación de gemelos de pie', sets: 4, reps: 20, restTime: 45  },
        ],
      },
      {
        dayNumber: 3, dayLabel: 'Upper B — Hombros y Brazos', isRestDay: false,
        workoutName: 'UPL Upper B', category: 'SHOULDERS', muscleGroups: ['SHOULDERS', 'ARMS'],
        exercises: [
          { exerciseName: 'Press militar con barra',        sets: 4, reps: 8,  restTime: 120 },
          { exerciseName: 'Press con mancuernas plano',     sets: 3, reps: 10, restTime: 90  },
          { exerciseName: 'Elevaciones laterales',          sets: 4, reps: 12, restTime: 60  },
          { exerciseName: 'Curl de bíceps con barra',       sets: 3, reps: 10, restTime: 90  },
          { exerciseName: 'Press francés',                  sets: 3, reps: 10, restTime: 90  },
          { exerciseName: 'Pájaro (deltoides posterior)',   sets: 3, reps: 15, restTime: 60  },
        ],
      },
      {
        dayNumber: 4, dayLabel: 'Espalda — Volumen Pull', isRestDay: false,
        workoutName: 'UPL Espalda', category: 'BACK', muscleGroups: ['BACK'],
        exercises: [
          { exerciseName: 'Jalón al pecho en polea', sets: 4, reps: 10, restTime: 90  },
          { exerciseName: 'Remo en polea baja',      sets: 4, reps: 12, restTime: 90  },
          { exerciseName: 'Pullover con mancuerna',  sets: 3, reps: 12, restTime: 60  },
          { exerciseName: 'Remo T-bar',              sets: 3, reps: 10, restTime: 90  },
          { exerciseName: 'Face pull',               sets: 3, reps: 15, restTime: 45  },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // PLAN 3 — Hombre: Definición PPL + Cardio (5 días)
  // ═══════════════════════════════════════════════════════
  {
    name: 'Definición PPL',
    description: 'Circuito PPL de definición: series altas, descansos cortos y cardio integrado para quemar grasa manteniendo músculo.',
    goal: 'DEFINITION', gender: 'MALE', daysPerWeek: 5, level: 'INTERMEDIATE', emoji: '✂️',
    days: [
      {
        dayNumber: 1, dayLabel: 'Push Definición', isRestDay: false,
        workoutName: 'DEF Push', category: 'CHEST', muscleGroups: ['CHEST', 'SHOULDERS', 'ARMS'],
        exercises: [
          { exerciseName: 'Press con mancuernas plano',     sets: 4, reps: 15, restTime: 60  },
          { exerciseName: 'Crossover en polea',             sets: 4, reps: 15, restTime: 45  },
          { exerciseName: 'Press en máquina (pecho)',       sets: 3, reps: 15, restTime: 60  },
          { exerciseName: 'Press con mancuernas (hombros)', sets: 3, reps: 12, restTime: 60  },
          { exerciseName: 'Elevaciones laterales en polea', sets: 3, reps: 15, restTime: 45  },
          { exerciseName: 'Extensión de tríceps en polea',  sets: 3, reps: 15, restTime: 45  },
          { exerciseName: 'Fondos para tríceps',            sets: 2, reps: 15, restTime: 30  },
        ],
      },
      {
        dayNumber: 2, dayLabel: 'Pull Definición', isRestDay: false,
        workoutName: 'DEF Pull', category: 'BACK', muscleGroups: ['BACK', 'ARMS'],
        exercises: [
          { exerciseName: 'Jalón al pecho en polea',  sets: 4, reps: 15, restTime: 45  },
          { exerciseName: 'Remo en polea baja',        sets: 4, reps: 15, restTime: 45  },
          { exerciseName: 'Pullover con mancuerna',    sets: 3, reps: 15, restTime: 30  },
          { exerciseName: 'Curl en polea',             sets: 3, reps: 15, restTime: 30  },
          { exerciseName: 'Curl concentrado sentado',  sets: 3, reps: 12, restTime: 30  },
          { exerciseName: 'Face pull',                 sets: 3, reps: 20, restTime: 30  },
        ],
      },
      { dayNumber: 3, dayLabel: 'Descanso', isRestDay: true },
      {
        dayNumber: 4, dayLabel: 'Legs Definición', isRestDay: false,
        workoutName: 'DEF Piernas', category: 'LEGS', muscleGroups: ['LEGS'],
        exercises: [
          { exerciseName: 'Sentadilla goblet',            sets: 4, reps: 15, restTime: 60  },
          { exerciseName: 'Zancadas caminando',           sets: 4, reps: 20, restTime: 45  },
          { exerciseName: 'Extensión de cuádriceps',      sets: 4, reps: 15, restTime: 45  },
          { exerciseName: 'Curl femoral sentado',         sets: 4, reps: 15, restTime: 45  },
          { exerciseName: 'Hip thrust',                   sets: 4, reps: 15, restTime: 45  },
          { exerciseName: 'Abductor de cadera en máquina',sets: 3, reps: 20, restTime: 30  },
          { exerciseName: 'Elevación de gemelos de pie',  sets: 4, reps: 25, restTime: 30  },
        ],
      },
      {
        dayNumber: 5, dayLabel: 'Cardio + Core', isRestDay: false,
        workoutName: 'DEF Cardio & Core', category: 'CORE', muscleGroups: ['CORE'],
        exercises: [
          { exerciseName: 'Plancha frontal',              sets: 3, reps: 60, restTime: 60  },
          { exerciseName: 'Russian twist',                sets: 3, reps: 20, restTime: 45  },
          { exerciseName: 'Elevación de piernas tumbado', sets: 3, reps: 15, restTime: 45  },
          { exerciseName: 'Burpees',                      sets: 4, reps: 10, restTime: 60  },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // PLAN 4 — Hombre: Fuerza Conjugada (4 días)
  // ═══════════════════════════════════════════════════════
  {
    name: 'Fuerza Conjugada',
    description: 'Método Westside-inspirado. Alterna días de máximo esfuerzo, dinámico y repeticiones para maximizar fuerza en los tres levantamientos básicos.',
    goal: 'STRENGTH', gender: 'MALE', daysPerWeek: 4, level: 'ADVANCED', emoji: '⛏️',
    days: [
      {
        dayNumber: 1, dayLabel: 'Máximo Esfuerzo — Upper', isRestDay: false,
        workoutName: 'CONJ Máximo Esfuerzo', category: 'CHEST', muscleGroups: ['CHEST', 'BACK', 'ARMS'],
        exercises: [
          { exerciseName: 'Press de banca plano',     sets: 6, reps: 2,  restTime: 240 },
          { exerciseName: 'Remo con barra',            sets: 3, reps: 5,  restTime: 180 },
          { exerciseName: 'Fondos en paralelas (pecho)', sets: 3, reps: 5, restTime: 120 },
        ],
      },
      {
        dayNumber: 2, dayLabel: 'Dinámico — Lower', isRestDay: false,
        workoutName: 'CONJ Dinámico Lower', category: 'LEGS', muscleGroups: ['LEGS', 'CORE'],
        exercises: [
          { exerciseName: 'Sentadilla con barra',  sets: 8, reps: 2,  restTime: 120 },
          { exerciseName: 'Peso muerto',           sets: 3, reps: 3,  restTime: 180 },
          { exerciseName: 'Prensa de piernas',     sets: 3, reps: 6,  restTime: 90  },
          { exerciseName: 'Plancha frontal',       sets: 3, reps: 45, restTime: 60  },
        ],
      },
      {
        dayNumber: 3, dayLabel: 'Repeticiones — Upper', isRestDay: false,
        workoutName: 'CONJ Repeticiones', category: 'BACK', muscleGroups: ['BACK', 'LEGS'],
        exercises: [
          { exerciseName: 'Peso muerto',            sets: 5, reps: 5,  restTime: 150 },
          { exerciseName: 'Remo T-bar',             sets: 4, reps: 6,  restTime: 120 },
          { exerciseName: 'Sentadilla goblet',      sets: 3, reps: 5,  restTime: 120 },
        ],
      },
      {
        dayNumber: 4, dayLabel: 'Complementario — Asistencia', isRestDay: false,
        workoutName: 'CONJ Asistencia', category: 'SHOULDERS', muscleGroups: ['SHOULDERS', 'BACK', 'ARMS'],
        exercises: [
          { exerciseName: 'Elevaciones frontales',   sets: 3, reps: 8,  restTime: 90 },
          { exerciseName: 'Remo en polea baja',      sets: 3, reps: 10, restTime: 90 },
          { exerciseName: 'Curl de bíceps con barra',sets: 3, reps: 8,  restTime: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // PLAN 5 — Mujer: Volumen Glúteos (4 días)
  // ═══════════════════════════════════════════════════════
  {
    name: 'Volumen Glúteos',
    description: 'Programa femenino enfocado en volumen de glúteos, con dos sesiones dedicadas de glúteo-pierna y una de torso completo.',
    goal: 'VOLUME', gender: 'FEMALE', daysPerWeek: 4, level: 'INTERMEDIATE', emoji: '💜',
    days: [
      {
        dayNumber: 1, dayLabel: 'Glúteos A — Fuerza', isRestDay: false,
        workoutName: 'GLUT Glúteos A', category: 'LEGS', muscleGroups: ['LEGS'],
        exercises: [
          { exerciseName: 'Hip thrust',               sets: 4, reps: 8,  restTime: 120 },
          { exerciseName: 'Sentadilla sumo con barra', sets: 4, reps: 10, restTime: 90  },
          { exerciseName: 'Peso muerto rumano',        sets: 3, reps: 12, restTime: 90  },
          { exerciseName: 'Sentadilla búlgara',        sets: 3, reps: 10, restTime: 60  },
          { exerciseName: 'Elevación de gemelos de pie',sets: 3, reps: 20, restTime: 45  },
        ],
      },
      {
        dayNumber: 2, dayLabel: 'Torso — Push & Pull', isRestDay: false,
        workoutName: 'GLUT Torso', category: 'CHEST', muscleGroups: ['CHEST', 'BACK', 'SHOULDERS', 'ARMS'],
        exercises: [
          { exerciseName: 'Press con mancuernas plano',    sets: 3, reps: 12, restTime: 60 },
          { exerciseName: 'Remo en polea baja',            sets: 3, reps: 12, restTime: 60 },
          { exerciseName: 'Crossover en polea',            sets: 3, reps: 15, restTime: 45 },
          { exerciseName: 'Jalón al pecho en polea',       sets: 3, reps: 12, restTime: 60 },
          { exerciseName: 'Press con mancuernas (hombros)',sets: 3, reps: 10, restTime: 60 },
          { exerciseName: 'Elevaciones laterales',         sets: 3, reps: 15, restTime: 45 },
          { exerciseName: 'Curl de bíceps con mancuernas', sets: 2, reps: 12, restTime: 45 },
        ],
      },
      { dayNumber: 3, dayLabel: 'Descanso', isRestDay: true },
      {
        dayNumber: 4, dayLabel: 'Glúteos B — Volumen', isRestDay: false,
        workoutName: 'GLUT Glúteos B', category: 'LEGS', muscleGroups: ['LEGS'],
        exercises: [
          { exerciseName: 'Sentadilla goblet',              sets: 4, reps: 15, restTime: 60 },
          { exerciseName: 'Hip thrust',                     sets: 4, reps: 15, restTime: 45 },
          { exerciseName: 'Zancadas caminando',             sets: 3, reps: 20, restTime: 45 },
          { exerciseName: 'Extensión de cuádriceps',        sets: 3, reps: 15, restTime: 45 },
          { exerciseName: 'Patada trasera en polea',        sets: 3, reps: 15, restTime: 45 },
          { exerciseName: 'Abductor de cadera en máquina',  sets: 3, reps: 20, restTime: 30 },
          { exerciseName: 'Gemelos sentado',                sets: 3, reps: 20, restTime: 30 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // PLAN 6 — Mujer: Definición 5 días
  // ═══════════════════════════════════════════════════════
  {
    name: 'Definición Femenina 5 días',
    description: 'Programa de definición de 5 días para mujer. Series moderadas con descansos cortos para maximizar el gasto calórico.',
    goal: 'DEFINITION', gender: 'FEMALE', daysPerWeek: 5, level: 'INTERMEDIATE', emoji: '🩵',
    days: [
      {
        dayNumber: 1, dayLabel: 'Glúteos Definición', isRestDay: false,
        workoutName: 'FDEF Glúteos', category: 'LEGS', muscleGroups: ['LEGS'],
        exercises: [
          { exerciseName: 'Hip thrust',                    sets: 4, reps: 15, restTime: 90 },
          { exerciseName: 'Sentadilla goblet',             sets: 3, reps: 15, restTime: 60 },
          { exerciseName: 'Sentadilla búlgara',            sets: 3, reps: 12, restTime: 60 },
          { exerciseName: 'Patada trasera en polea',       sets: 3, reps: 20, restTime: 45 },
          { exerciseName: 'Abductor de cadera en máquina', sets: 2, reps: 25, restTime: 45 },
        ],
      },
      {
        dayNumber: 2, dayLabel: 'Torso Push Definición', isRestDay: false,
        workoutName: 'FDEF Torso Push', category: 'CHEST', muscleGroups: ['CHEST', 'SHOULDERS', 'ARMS'],
        exercises: [
          { exerciseName: 'Press con mancuernas plano',     sets: 4, reps: 12, restTime: 45 },
          { exerciseName: 'Crossover en polea',             sets: 3, reps: 15, restTime: 30 },
          { exerciseName: 'Press en máquina (pecho)',       sets: 3, reps: 15, restTime: 45 },
          { exerciseName: 'Press con mancuernas (hombros)', sets: 3, reps: 12, restTime: 60 },
          { exerciseName: 'Elevaciones laterales en polea', sets: 3, reps: 15, restTime: 30 },
          { exerciseName: 'Extensión de tríceps en polea',  sets: 3, reps: 15, restTime: 30 },
        ],
      },
      { dayNumber: 3, dayLabel: 'Descanso', isRestDay: true },
      {
        dayNumber: 4, dayLabel: 'Piernas Definición', isRestDay: false,
        workoutName: 'FDEF Piernas', category: 'LEGS', muscleGroups: ['LEGS'],
        exercises: [
          { exerciseName: 'Sentadilla goblet',          sets: 4, reps: 15, restTime: 60 },
          { exerciseName: 'Extensión de cuádriceps',    sets: 4, reps: 15, restTime: 45 },
          { exerciseName: 'Zancadas caminando',         sets: 3, reps: 20, restTime: 45 },
          { exerciseName: 'Curl femoral sentado',       sets: 4, reps: 15, restTime: 45 },
          { exerciseName: 'Elevación de gemelos de pie',sets: 4, reps: 20, restTime: 30 },
          { exerciseName: 'Gemelos sentado',            sets: 3, reps: 20, restTime: 30 },
        ],
      },
      {
        dayNumber: 5, dayLabel: 'Espalda Pull Definición', isRestDay: false,
        workoutName: 'FDEF Espalda', category: 'BACK', muscleGroups: ['BACK', 'ARMS'],
        exercises: [
          { exerciseName: 'Jalón al pecho en polea', sets: 4, reps: 15, restTime: 45 },
          { exerciseName: 'Remo en polea baja',      sets: 4, reps: 15, restTime: 45 },
          { exerciseName: 'Pullover con mancuerna',  sets: 3, reps: 15, restTime: 30 },
          { exerciseName: 'Curl en polea',           sets: 3, reps: 15, restTime: 30 },
          { exerciseName: 'Curl concentrado sentado',sets: 3, reps: 15, restTime: 30 },
          { exerciseName: 'Face pull',               sets: 3, reps: 20, restTime: 30 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // PLAN 7 — Mujer: Fuerza 4 días
  // ═══════════════════════════════════════════════════════
  {
    name: 'Fuerza Femenina 4 días',
    description: 'Programa de fuerza para mujer basado en los tres básicos (sentadilla, press banca, peso muerto) con pliometría funcional.',
    goal: 'STRENGTH', gender: 'FEMALE', daysPerWeek: 4, level: 'INTERMEDIATE', emoji: '💖',
    days: [
      {
        dayNumber: 1, dayLabel: 'Lower A — Sentadilla', isRestDay: false,
        workoutName: 'FSTR Lower A', category: 'LEGS', muscleGroups: ['LEGS'],
        exercises: [
          { exerciseName: 'Sentadilla con barra',      sets: 5, reps: 5,  restTime: 150 },
          { exerciseName: 'Box squat',                 sets: 3, reps: 5,  restTime: 120 },
          { exerciseName: 'Peso muerto rumano',        sets: 3, reps: 8,  restTime: 90  },
          { exerciseName: 'Extensión de cadera en polea', sets: 2, reps: 10, restTime: 60 },
        ],
      },
      {
        dayNumber: 2, dayLabel: 'Upper — Press Banca + Espalda', isRestDay: false,
        workoutName: 'FSTR Upper', category: 'CHEST', muscleGroups: ['CHEST', 'BACK', 'SHOULDERS', 'ARMS'],
        exercises: [
          { exerciseName: 'Press de banca plano',       sets: 5, reps: 5, restTime: 150 },
          { exerciseName: 'Remo con barra',             sets: 5, reps: 5, restTime: 150 },
          { exerciseName: 'Press militar con barra',    sets: 3, reps: 6, restTime: 120 },
          { exerciseName: 'Jalón al pecho en polea',    sets: 3, reps: 6, restTime: 120 },
          { exerciseName: 'Fondos en paralelas (pecho)',sets: 3, reps: 6, restTime: 120 },
        ],
      },
      {
        dayNumber: 3, dayLabel: 'Lower B — Hip Thrust + Sumo', isRestDay: false,
        workoutName: 'FSTR Lower B', category: 'LEGS', muscleGroups: ['LEGS'],
        exercises: [
          { exerciseName: 'Hip thrust',                sets: 5, reps: 5,  restTime: 150 },
          { exerciseName: 'Sentadilla sumo con barra', sets: 4, reps: 8,  restTime: 120 },
          { exerciseName: 'Peso muerto',               sets: 3, reps: 5,  restTime: 150 },
          { exerciseName: 'Saltos verticales',         sets: 4, reps: 5,  restTime: 120 },
        ],
      },
      {
        dayNumber: 4, dayLabel: 'Pliometría + Core', isRestDay: false,
        workoutName: 'FSTR Pliometría', category: 'FULL_BODY', muscleGroups: ['LEGS', 'CORE'],
        exercises: [
          { exerciseName: 'Burpees',                sets: 5, reps: 5,  restTime: 120 },
          { exerciseName: 'Box jumps',              sets: 4, reps: 10, restTime: 60  },
          { exerciseName: 'Plancha con peso',       sets: 3, reps: 20, restTime: 60  },
          { exerciseName: 'Anti-rotación en polea', sets: 3, reps: 10, restTime: 60  },
        ],
      },
    ],
  },
];

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Seeding training plans...');

  // Guard: skip if plans already seeded
  const existingCount = await prisma.trainingPlan.count();
  if (existingCount > 0) {
    console.log(`⏭️  ${existingCount} training plans already exist. Skipping.`);
    return;
  }

  // Load dynamic exercise IDs
  await loadDynamicExercises();

  let plansCreated = 0;

  for (const planDef of plans) {
    const plan = await prisma.trainingPlan.create({
      data: {
        name: planDef.name,
        description: planDef.description,
        goal: planDef.goal,
        gender: planDef.gender,
        daysPerWeek: planDef.daysPerWeek,
        level: planDef.level,
        emoji: planDef.emoji,
        isActive: true,
      },
    });

    for (const dayDef of planDef.days) {
      let workoutId: string | null = null;

      if (!dayDef.isRestDay && dayDef.exercises && dayDef.exercises.length > 0) {
        // Create a template workout for this plan day
        const workout = await prisma.workout.create({
          data: {
            name: dayDef.workoutName ?? dayDef.dayLabel,
            description: `Día ${dayDef.dayNumber} del plan ${planDef.name}`,
            category: dayDef.category ?? 'FULL_BODY',
            muscleGroups: dayDef.muscleGroups ?? [],
            isTemplate: true,
            isActive: true,
            userId: null,
          },
        });

        // Create workout exercises
        const exerciseData = [];
        for (let i = 0; i < dayDef.exercises.length; i++) {
          const row = dayDef.exercises[i];
          const exerciseId = EX[row.exerciseName];
          if (!exerciseId) {
            console.warn(`  ⚠️  Skipping unknown exercise: "${row.exerciseName}"`);
            continue;
          }
          exerciseData.push({
            workoutId: workout.id,
            exerciseId,
            sets: row.sets,
            reps: row.reps,
            restTime: row.restTime,
            order: i + 1,
          });
        }

        if (exerciseData.length > 0) {
          await prisma.workoutExercise.createMany({ data: exerciseData });
        }

        workoutId = workout.id;
      }

      await prisma.planDay.create({
        data: {
          planId: plan.id,
          dayNumber: dayDef.dayNumber,
          dayLabel: dayDef.dayLabel,
          isRestDay: dayDef.isRestDay,
          workoutId,
        },
      });
    }

    console.log(`  ✅ ${planDef.emoji} ${planDef.name} (${planDef.gender}, ${planDef.goal})`);
    plansCreated++;
  }

  console.log(`\n🎉 ${plansCreated} training plans seeded successfully!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
