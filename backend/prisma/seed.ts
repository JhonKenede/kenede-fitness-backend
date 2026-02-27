import { PrismaClient, MuscleGroup, ExerciseType, Level } from '@prisma/client';

const prisma = new PrismaClient();

const exercises = [
  // CHEST
  {
    name: 'Bench Press',
    muscleGroup: MuscleGroup.CHEST,
    type: ExerciseType.COMPOUND,
    level: Level.BEGINNER,
    equipment: ['barbell', 'bench'],
    instructions:
      'Lie flat on bench, grip bar slightly wider than shoulder-width. Lower bar to chest, press back up to full arm extension.',
    technique: 'Keep feet flat on floor, maintain slight arch in lower back, retract scapula.',
  },
  {
    name: 'Incline Dumbbell Press',
    muscleGroup: MuscleGroup.CHEST,
    type: ExerciseType.COMPOUND,
    level: Level.BEGINNER,
    equipment: ['dumbbells', 'incline bench'],
    instructions:
      'Set bench to 30-45 degrees. Press dumbbells from chest level to full extension above upper chest.',
    technique: 'Control the descent, keep elbows at 45-degree angle from torso.',
  },
  {
    name: 'Cable Fly',
    muscleGroup: MuscleGroup.CHEST,
    type: ExerciseType.ISOLATION,
    level: Level.INTERMEDIATE,
    equipment: ['cable machine'],
    instructions:
      'Stand between cable stations, pull handles together in wide arc in front of chest.',
    technique: 'Maintain slight bend in elbows throughout, squeeze chest at peak contraction.',
  },
  // BACK
  {
    name: 'Deadlift',
    muscleGroup: MuscleGroup.BACK,
    type: ExerciseType.COMPOUND,
    level: Level.INTERMEDIATE,
    equipment: ['barbell'],
    instructions:
      'Stand with feet hip-width, grip bar outside legs. Keep back flat, drive through heels lifting bar to hip height.',
    technique: 'Neutral spine throughout, bar stays close to body, hips and shoulders rise together.',
  },
  {
    name: 'Pull-Up',
    muscleGroup: MuscleGroup.BACK,
    type: ExerciseType.COMPOUND,
    level: Level.INTERMEDIATE,
    equipment: ['pull-up bar'],
    instructions:
      'Hang from bar with overhand grip wider than shoulders. Pull body up until chin clears bar.',
    technique: 'Engage lats before pulling, avoid swinging, full range of motion.',
  },
  {
    name: 'Barbell Row',
    muscleGroup: MuscleGroup.BACK,
    type: ExerciseType.COMPOUND,
    level: Level.BEGINNER,
    equipment: ['barbell'],
    instructions:
      'Hinge at hips with slight knee bend, pull bar to lower chest/upper abdomen.',
    technique: 'Keep back parallel to floor, retract shoulder blades at top.',
  },
  {
    name: 'Lat Pulldown',
    muscleGroup: MuscleGroup.BACK,
    type: ExerciseType.COMPOUND,
    level: Level.BEGINNER,
    equipment: ['cable machine', 'lat pulldown bar'],
    instructions: 'Grip bar wide, pull down to upper chest while leaning slightly back.',
    technique: 'Drive elbows down and back, squeeze lats at bottom position.',
  },
  // SHOULDERS
  {
    name: 'Overhead Press',
    muscleGroup: MuscleGroup.SHOULDERS,
    type: ExerciseType.COMPOUND,
    level: Level.INTERMEDIATE,
    equipment: ['barbell'],
    instructions:
      'Stand with barbell at shoulder height, press overhead to full arm extension.',
    technique: 'Brace core, avoid excessive arching, keep bar path vertical.',
  },
  {
    name: 'Lateral Raise',
    muscleGroup: MuscleGroup.SHOULDERS,
    type: ExerciseType.ISOLATION,
    level: Level.BEGINNER,
    equipment: ['dumbbells'],
    instructions:
      'Stand holding dumbbells at sides, raise arms to shoulder height in wide arc.',
    technique: 'Lead with elbows, slight forward lean, control descent.',
  },
  {
    name: 'Face Pull',
    muscleGroup: MuscleGroup.SHOULDERS,
    type: ExerciseType.ISOLATION,
    level: Level.BEGINNER,
    equipment: ['cable machine', 'rope attachment'],
    instructions: 'Pull rope toward face, separating hands as they reach ear level.',
    technique: 'Keep elbows high, external rotation at end range, great for rear delts.',
  },
  // ARMS
  {
    name: 'Barbell Curl',
    muscleGroup: MuscleGroup.ARMS,
    type: ExerciseType.ISOLATION,
    level: Level.BEGINNER,
    equipment: ['barbell'],
    instructions: 'Stand with barbell, curl to shoulder height keeping elbows fixed at sides.',
    technique: 'Avoid swinging, full range of motion, squeeze biceps at top.',
  },
  {
    name: 'Tricep Pushdown',
    muscleGroup: MuscleGroup.ARMS,
    type: ExerciseType.ISOLATION,
    level: Level.BEGINNER,
    equipment: ['cable machine'],
    instructions:
      'Stand at cable, push bar down to full arm extension keeping upper arms stationary.',
    technique: 'Elbows locked at sides, full lockout at bottom.',
  },
  {
    name: 'Hammer Curl',
    muscleGroup: MuscleGroup.ARMS,
    type: ExerciseType.ISOLATION,
    level: Level.BEGINNER,
    equipment: ['dumbbells'],
    instructions: 'Curl dumbbells with neutral grip (palms facing each other).',
    technique: 'Works brachialis and brachioradialis in addition to biceps.',
  },
  {
    name: 'Skull Crusher',
    muscleGroup: MuscleGroup.ARMS,
    type: ExerciseType.ISOLATION,
    level: Level.INTERMEDIATE,
    equipment: ['barbell', 'EZ bar', 'bench'],
    instructions: 'Lie on bench, lower bar toward forehead by bending only at elbows.',
    technique: 'Keep upper arms perpendicular to floor, control the movement.',
  },
  // LEGS
  {
    name: 'Squat',
    muscleGroup: MuscleGroup.LEGS,
    type: ExerciseType.COMPOUND,
    level: Level.BEGINNER,
    equipment: ['barbell', 'squat rack'],
    instructions:
      'Bar on upper back, feet shoulder-width. Squat until thighs parallel to floor.',
    technique: 'Knees track over toes, maintain neutral spine, drive through heels.',
  },
  {
    name: 'Romanian Deadlift',
    muscleGroup: MuscleGroup.LEGS,
    type: ExerciseType.COMPOUND,
    level: Level.INTERMEDIATE,
    equipment: ['barbell'],
    instructions:
      'Hold bar at hips, hinge forward pushing hips back, lower bar along legs.',
    technique: 'Keep slight bend in knees, feel hamstring stretch, keep bar close to body.',
  },
  {
    name: 'Leg Press',
    muscleGroup: MuscleGroup.LEGS,
    type: ExerciseType.COMPOUND,
    level: Level.BEGINNER,
    equipment: ['leg press machine'],
    instructions: 'Push platform away from body until legs nearly straight.',
    technique: 'Do not lock knees, keep lower back against pad, control descent.',
  },
  {
    name: 'Leg Curl',
    muscleGroup: MuscleGroup.LEGS,
    type: ExerciseType.ISOLATION,
    level: Level.BEGINNER,
    equipment: ['leg curl machine'],
    instructions: 'Curl weight toward glutes using only knee flexion.',
    technique: 'Full range of motion, squeeze hamstrings at peak contraction.',
  },
  // CORE
  {
    name: 'Plank',
    muscleGroup: MuscleGroup.CORE,
    type: ExerciseType.ISOLATION,
    level: Level.BEGINNER,
    equipment: [],
    instructions: 'Hold push-up position on forearms, maintaining straight body line.',
    technique: 'Engage glutes and abs, breathe normally, avoid hips sagging or rising.',
  },
  {
    name: 'Cable Crunch',
    muscleGroup: MuscleGroup.CORE,
    type: ExerciseType.ISOLATION,
    level: Level.BEGINNER,
    equipment: ['cable machine', 'rope attachment'],
    instructions: 'Kneel below cable, pull rope toward floor crunching abs.',
    technique: 'Round lower back, focus on contracting abs not hip flexors.',
  },
  // FULL BODY
  {
    name: 'Burpee',
    muscleGroup: MuscleGroup.FULL_BODY,
    type: ExerciseType.COMPOUND,
    level: Level.BEGINNER,
    equipment: [],
    instructions:
      'From standing, drop to push-up, perform push-up, jump feet to hands, jump up.',
    technique: 'Maintain pace for cardio benefit, land softly on jump.',
  },
  {
    name: 'Kettlebell Swing',
    muscleGroup: MuscleGroup.FULL_BODY,
    type: ExerciseType.COMPOUND,
    level: Level.INTERMEDIATE,
    equipment: ['kettlebell'],
    instructions:
      'Hip hinge with kettlebell between legs, drive hips forward swinging bell to shoulder height.',
    technique: 'Power from hips not arms, keep lats engaged, neutral spine.',
  },
];

async function main() {
  console.log('Starting seed...');

  // Clear existing exercises and template workouts
  await prisma.workoutExercise.deleteMany({ where: { workout: { isTemplate: true } } });
  await prisma.workout.deleteMany({ where: { isTemplate: true } });
  await prisma.exercise.deleteMany();

  // Seed exercises
  for (const exercise of exercises) {
    await prisma.exercise.create({ data: exercise });
  }
  console.log(`Seeded ${exercises.length} exercises successfully.`);

  // Fetch all exercises by name for referencing in templates
  const allExercises = await prisma.exercise.findMany();
  const byName = (name: string) => {
    const ex = allExercises.find((e) => e.name === name);
    if (!ex) throw new Error(`Exercise not found: ${name}`);
    return ex.id;
  };

  // Template workout definitions
  const templateWorkouts = [
    {
      name: 'Pecho Completo',
      description: 'Rutina completa de pecho para desarrollo máximo del pectoral mayor y menor.',
      category: 'CHEST',
      muscleGroups: ['CHEST'],
      exercises: [
        { name: 'Bench Press', sets: 4, reps: 8, weight: 80, restTime: 120, order: 1 },
        { name: 'Incline Dumbbell Press', sets: 4, reps: 10, weight: 24, restTime: 90, order: 2 },
        { name: 'Cable Fly', sets: 3, reps: 12, weight: 15, restTime: 60, order: 3 },
      ],
    },
    {
      name: 'Espalda Poderosa',
      description: 'Rutina completa de espalda para máximo grosor y anchura.',
      category: 'BACK',
      muscleGroups: ['BACK'],
      exercises: [
        { name: 'Pull-Up', sets: 4, reps: 8, weight: 0, restTime: 120, order: 1 },
        { name: 'Barbell Row', sets: 4, reps: 8, weight: 70, restTime: 120, order: 2 },
        { name: 'Lat Pulldown', sets: 3, reps: 12, weight: 60, restTime: 90, order: 3 },
        { name: 'Deadlift', sets: 3, reps: 5, weight: 100, restTime: 180, order: 4 },
      ],
    },
    {
      name: 'Piernas Completas',
      description: 'Rutina completa de piernas para cuádriceps, isquiotibiales y glúteos.',
      category: 'LEGS',
      muscleGroups: ['LEGS'],
      exercises: [
        { name: 'Squat', sets: 5, reps: 5, weight: 100, restTime: 180, order: 1 },
        { name: 'Romanian Deadlift', sets: 4, reps: 10, weight: 70, restTime: 120, order: 2 },
        { name: 'Leg Press', sets: 4, reps: 12, weight: 120, restTime: 90, order: 3 },
        { name: 'Leg Curl', sets: 3, reps: 12, weight: 40, restTime: 60, order: 4 },
      ],
    },
    {
      name: 'Hombros Boulder',
      description: 'Rutina completa de hombros para deltoides anterior, lateral y posterior.',
      category: 'SHOULDERS',
      muscleGroups: ['SHOULDERS'],
      exercises: [
        { name: 'Overhead Press', sets: 4, reps: 8, weight: 60, restTime: 120, order: 1 },
        { name: 'Lateral Raise', sets: 4, reps: 15, weight: 10, restTime: 60, order: 2 },
        { name: 'Face Pull', sets: 3, reps: 15, weight: 20, restTime: 60, order: 3 },
      ],
    },
    {
      name: 'Brazos',
      description: 'Rutina completa de brazos para bíceps y tríceps.',
      category: 'ARMS',
      muscleGroups: ['ARMS'],
      exercises: [
        { name: 'Barbell Curl', sets: 4, reps: 10, weight: 30, restTime: 90, order: 1 },
        { name: 'Skull Crusher', sets: 4, reps: 10, weight: 30, restTime: 90, order: 2 },
        { name: 'Hammer Curl', sets: 3, reps: 12, weight: 14, restTime: 60, order: 3 },
        { name: 'Tricep Pushdown', sets: 3, reps: 12, weight: 25, restTime: 60, order: 4 },
      ],
    },
    {
      name: 'Core & Abdomen',
      description: 'Rutina completa de core para abdominales y estabilización.',
      category: 'CORE',
      muscleGroups: ['CORE'],
      exercises: [
        { name: 'Plank', sets: 4, reps: 60, weight: 0, restTime: 60, order: 1 },
        { name: 'Cable Crunch', sets: 4, reps: 15, weight: 30, restTime: 60, order: 2 },
      ],
    },
    {
      name: 'Full Body',
      description: 'Rutina de cuerpo completo para sesiones eficientes de entrenamiento total.',
      category: 'FULL_BODY',
      muscleGroups: ['CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'CORE'],
      exercises: [
        { name: 'Squat', sets: 4, reps: 8, weight: 80, restTime: 120, order: 1 },
        { name: 'Bench Press', sets: 4, reps: 8, weight: 70, restTime: 120, order: 2 },
        { name: 'Pull-Up', sets: 3, reps: 8, weight: 0, restTime: 120, order: 3 },
        { name: 'Deadlift', sets: 3, reps: 5, weight: 100, restTime: 180, order: 4 },
        { name: 'Overhead Press', sets: 3, reps: 10, weight: 50, restTime: 90, order: 5 },
        { name: 'Plank', sets: 3, reps: 60, weight: 0, restTime: 60, order: 6 },
      ],
    },
  ];

  for (const template of templateWorkouts) {
    await prisma.workout.create({
      data: {
        name: template.name,
        description: template.description,
        isTemplate: true,
        category: template.category,
        muscleGroups: template.muscleGroups,
        dayOfWeek: [],
        exercises: {
          create: template.exercises.map((ex) => ({
            exerciseId: byName(ex.name),
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            restTime: ex.restTime,
            order: ex.order,
          })),
        },
      },
    });
    console.log(`Created template: ${template.name}`);
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
