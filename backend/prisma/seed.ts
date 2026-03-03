import { PrismaClient, MuscleGroup, Level, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

const exercises = [
  // ── PECHO ──────────────────────────────────────────────
  { name: 'Press de banca plano', muscleGroup: MuscleGroup.CHEST, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Barra', 'Banco'], instructions: 'Tumbado en el banco, agarra la barra a la anchura de los hombros y baja hasta el pecho.' },
  { name: 'Press de banca inclinado', muscleGroup: MuscleGroup.CHEST, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Barra', 'Banco inclinado'], instructions: 'Banco a 30-45°, trabaja la parte superior del pecho.' },
  { name: 'Press de banca declinado', muscleGroup: MuscleGroup.CHEST, type: ExerciseType.COMPOUND, level: Level.INTERMEDIATE, equipment: ['Barra', 'Banco declinado'], instructions: 'Banco en bajada, trabaja la parte inferior del pecho.' },
  { name: 'Press con mancuernas plano', muscleGroup: MuscleGroup.CHEST, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Mancuernas', 'Banco'], instructions: 'Mayor rango de movimiento que con barra.' },
  { name: 'Aperturas con mancuernas', muscleGroup: MuscleGroup.CHEST, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Mancuernas', 'Banco'], instructions: 'Abre los brazos en arco hasta estirar el pecho, luego cierra.' },
  { name: 'Fondos en paralelas (pecho)', muscleGroup: MuscleGroup.CHEST, type: ExerciseType.COMPOUND, level: Level.INTERMEDIATE, equipment: ['Paralelas'], instructions: 'Inclina el torso hacia delante para enfocarte en el pecho.' },
  { name: 'Flexiones', muscleGroup: MuscleGroup.CHEST, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: [], instructions: 'Cuerpo recto, baja el pecho hasta rozar el suelo.' },
  { name: 'Crossover en polea', muscleGroup: MuscleGroup.CHEST, type: ExerciseType.ISOLATION, level: Level.INTERMEDIATE, equipment: ['Polea'], instructions: 'Cruza los brazos por delante del pecho con las poleas.' },
  { name: 'Press en máquina (pecho)', muscleGroup: MuscleGroup.CHEST, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Máquina'], instructions: 'Ideal para principiantes, movimiento guiado.' },
  { name: 'Pullover con mancuerna', muscleGroup: MuscleGroup.CHEST, type: ExerciseType.ISOLATION, level: Level.INTERMEDIATE, equipment: ['Mancuerna', 'Banco'], instructions: 'Estira el pecho y trabaja el serrato.' },

  // ── ESPALDA ────────────────────────────────────────────
  { name: 'Dominadas', muscleGroup: MuscleGroup.BACK, type: ExerciseType.COMPOUND, level: Level.INTERMEDIATE, equipment: ['Barra de dominadas'], instructions: 'Cuelga de la barra y sube hasta que la barbilla pase la barra.' },
  { name: 'Remo con barra', muscleGroup: MuscleGroup.BACK, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Barra'], instructions: 'Torso inclinado, tira la barra hacia el abdomen.' },
  { name: 'Remo con mancuerna', muscleGroup: MuscleGroup.BACK, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Mancuerna', 'Banco'], instructions: 'Un brazo a la vez, apoyado en el banco.' },
  { name: 'Jalón al pecho en polea', muscleGroup: MuscleGroup.BACK, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Polea'], instructions: 'Tira la barra hacia el pecho manteniendo la espalda recta.' },
  { name: 'Peso muerto', muscleGroup: MuscleGroup.BACK, type: ExerciseType.COMPOUND, level: Level.INTERMEDIATE, equipment: ['Barra'], instructions: 'Levanta la barra desde el suelo manteniendo la espalda neutral.' },
  { name: 'Remo en máquina', muscleGroup: MuscleGroup.BACK, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Máquina'], instructions: 'Movimiento guiado, ideal para principiantes.' },
  { name: 'Encogimientos de hombros', muscleGroup: MuscleGroup.BACK, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Mancuernas'], instructions: 'Eleva los hombros para trabajar el trapecio.' },
  { name: 'Remo en polea baja', muscleGroup: MuscleGroup.BACK, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Polea'], instructions: 'Sentado, tira el mango hacia el abdomen.' },
  { name: 'Hiperextensiones', muscleGroup: MuscleGroup.BACK, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Banco romano'], instructions: 'Trabaja la zona lumbar, glúteos e isquiotibiales.' },
  { name: 'Face pull', muscleGroup: MuscleGroup.BACK, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Polea'], instructions: 'Tira la cuerda hacia la cara para trabajar los romboides y deltoides posteriores.' },

  // ── HOMBROS ────────────────────────────────────────────
  { name: 'Press militar con barra', muscleGroup: MuscleGroup.SHOULDERS, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Barra'], instructions: 'De pie o sentado, empuja la barra por encima de la cabeza.' },
  { name: 'Press con mancuernas (hombros)', muscleGroup: MuscleGroup.SHOULDERS, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Mancuernas'], instructions: 'Empuja las mancuernas hacia arriba desde la altura de los hombros.' },
  { name: 'Elevaciones laterales', muscleGroup: MuscleGroup.SHOULDERS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Mancuernas'], instructions: 'Eleva los brazos en "T" hasta la altura de los hombros.' },
  { name: 'Elevaciones frontales', muscleGroup: MuscleGroup.SHOULDERS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Mancuernas'], instructions: 'Eleva los brazos hacia delante hasta la altura de los hombros.' },
  { name: 'Pájaro (deltoides posterior)', muscleGroup: MuscleGroup.SHOULDERS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Mancuernas'], instructions: 'Inclinado, abre los brazos hacia los lados para trabajar el deltoides posterior.' },
  { name: 'Press Arnold', muscleGroup: MuscleGroup.SHOULDERS, type: ExerciseType.COMPOUND, level: Level.INTERMEDIATE, equipment: ['Mancuernas'], instructions: 'Combina rotación y press para trabajar los tres deltoides.' },
  { name: 'Elevaciones laterales en polea', muscleGroup: MuscleGroup.SHOULDERS, type: ExerciseType.ISOLATION, level: Level.INTERMEDIATE, equipment: ['Polea'], instructions: 'Mayor tensión constante que con mancuernas.' },
  { name: 'Press en máquina (hombros)', muscleGroup: MuscleGroup.SHOULDERS, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Máquina'], instructions: 'Movimiento guiado, ideal para principiantes.' },

  // ── BRAZOS ─────────────────────────────────────────────
  { name: 'Curl de bíceps con barra', muscleGroup: MuscleGroup.ARMS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Barra'], instructions: 'De pie, curl con agarre supino (palmas arriba).' },
  { name: 'Curl de bíceps con mancuernas', muscleGroup: MuscleGroup.ARMS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Mancuernas'], instructions: 'Alterna o simultáneo, mayor rango de movimiento.' },
  { name: 'Curl martillo', muscleGroup: MuscleGroup.ARMS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Mancuernas'], instructions: 'Agarre neutro (pulgar arriba), trabaja el braquiorradial.' },
  { name: 'Curl en banco Scott', muscleGroup: MuscleGroup.ARMS, type: ExerciseType.ISOLATION, level: Level.INTERMEDIATE, equipment: ['Barra', 'Banco Scott'], instructions: 'Aísla el bíceps eliminando el impulso del cuerpo.' },
  { name: 'Fondos para tríceps', muscleGroup: MuscleGroup.ARMS, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Banco'], instructions: 'Manos en el banco, baja el cuerpo y sube.' },
  { name: 'Press francés', muscleGroup: MuscleGroup.ARMS, type: ExerciseType.ISOLATION, level: Level.INTERMEDIATE, equipment: ['Barra EZ', 'Banco'], instructions: 'Baja la barra hacia la frente doblando los codos.' },
  { name: 'Extensión de tríceps en polea', muscleGroup: MuscleGroup.ARMS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Polea'], instructions: 'Empuja el mango hacia abajo manteniendo los codos pegados.' },
  { name: 'Press cerrado', muscleGroup: MuscleGroup.ARMS, type: ExerciseType.COMPOUND, level: Level.INTERMEDIATE, equipment: ['Barra', 'Banco'], instructions: 'Agarre estrecho en el press de banca, énfasis en tríceps.' },
  { name: 'Curl en polea', muscleGroup: MuscleGroup.ARMS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Polea'], instructions: 'Tensión constante durante todo el movimiento.' },
  { name: 'Extensión tríceps sobre la cabeza', muscleGroup: MuscleGroup.ARMS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Mancuerna'], instructions: 'Eleva la mancuerna sobre la cabeza y baja doblando los codos.' },

  // ── PIERNAS ────────────────────────────────────────────
  { name: 'Sentadilla con barra', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Barra', 'Rack'], instructions: 'Rey de los ejercicios, baja hasta que los muslos estén paralelos al suelo.' },
  { name: 'Prensa de piernas', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Máquina'], instructions: 'Empuja la plataforma sin bloquear las rodillas.' },
  { name: 'Zancadas', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Mancuernas'], instructions: 'Da un paso adelante y baja la rodilla trasera al suelo.' },
  { name: 'Extensión de cuádriceps', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Máquina'], instructions: 'Extiende la pierna hasta arriba en la máquina.' },
  { name: 'Curl femoral tumbado', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Máquina'], instructions: 'Flexiona la rodilla hacia los glúteos.' },
  { name: 'Peso muerto rumano', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.COMPOUND, level: Level.INTERMEDIATE, equipment: ['Barra'], instructions: 'Estira los isquiotibiales manteniendo las piernas casi rectas.' },
  { name: 'Elevación de gemelos de pie', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Máquina'], instructions: 'Sube de puntillas para trabajar el gastrocnemio.' },
  { name: 'Sentadilla búlgara', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.COMPOUND, level: Level.ADVANCED, equipment: ['Mancuernas', 'Banco'], instructions: 'Pie trasero elevado, trabaja cuádriceps y glúteos.' },
  { name: 'Hip thrust', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Barra', 'Banco'], instructions: 'Empuje de cadera, el mejor ejercicio para glúteos.' },
  { name: 'Sentadilla goblet', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Mancuerna'], instructions: 'Sentadilla sosteniendo una mancuerna frente al pecho.' },

  // ── CORE ──────────────────────────────────────────────
  { name: 'Crunch abdominal', muscleGroup: MuscleGroup.CORE, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: [], instructions: 'Contrae el abdomen elevando los hombros del suelo.' },
  { name: 'Plancha frontal', muscleGroup: MuscleGroup.CORE, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: [], instructions: 'Mantén el cuerpo recto apoyado en antebrazos y pies.' },
  { name: 'Plancha lateral', muscleGroup: MuscleGroup.CORE, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: [], instructions: 'Apoyado en un antebrazo, mantén las caderas elevadas.' },
  { name: 'Elevación de piernas tumbado', muscleGroup: MuscleGroup.CORE, type: ExerciseType.ISOLATION, level: Level.INTERMEDIATE, equipment: [], instructions: 'Tumbado, sube las piernas rectas hasta 90°.' },
  { name: 'Russian twist', muscleGroup: MuscleGroup.CORE, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: [], instructions: 'Sentado con los pies levantados, gira el torso de lado a lado.' },
  { name: 'Mountain climbers', muscleGroup: MuscleGroup.CORE, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: [], instructions: 'En posición de plancha, lleva las rodillas al pecho alternando.' },
  { name: 'Rueda abdominal', muscleGroup: MuscleGroup.CORE, type: ExerciseType.COMPOUND, level: Level.ADVANCED, equipment: ['Rueda abdominal'], instructions: 'Rodando hacia adelante estirando el core, luego vuelve.' },
  { name: 'Crunch en polea', muscleGroup: MuscleGroup.CORE, type: ExerciseType.ISOLATION, level: Level.INTERMEDIATE, equipment: ['Polea'], instructions: 'De rodillas, contrae el abdomen hacia abajo.' },

  // ── CUERPO COMPLETO ────────────────────────────────────
  { name: 'Burpees', muscleGroup: MuscleGroup.FULL_BODY, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: [], instructions: 'Baja al suelo, haz una flexión, salta y repite.' },
  { name: 'Kettlebell swing', muscleGroup: MuscleGroup.FULL_BODY, type: ExerciseType.COMPOUND, level: Level.INTERMEDIATE, equipment: ['Kettlebell'], instructions: 'Impulso de cadera para lanzar la kettlebell hacia delante.' },
  { name: 'Power clean', muscleGroup: MuscleGroup.FULL_BODY, type: ExerciseType.COMPOUND, level: Level.ADVANCED, equipment: ['Barra'], instructions: 'Levanta la barra del suelo hasta los hombros de forma explosiva.' },
  { name: 'Thruster', muscleGroup: MuscleGroup.FULL_BODY, type: ExerciseType.COMPOUND, level: Level.INTERMEDIATE, equipment: ['Barra'], instructions: 'Combina sentadilla frontal y press militar.' },

  // ── NUEVOS EJERCICIOS ────────────────────────────────
  { name: 'Sentadilla sumo con barra', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.COMPOUND, level: Level.INTERMEDIATE, equipment: ['Barra'], instructions: 'Pies más anchos que los hombros, puntas hacia fuera, baja controladamente.' },
  { name: 'Curl femoral sentado', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Máquina'], instructions: 'Sentado en la máquina, flexiona las rodillas contra la resistencia.' },
  { name: 'Gemelos sentado', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Máquina'], instructions: 'Sentado, eleva los talones para trabajar el sóleo.' },
  { name: 'Remo T-bar', muscleGroup: MuscleGroup.BACK, type: ExerciseType.COMPOUND, level: Level.INTERMEDIATE, equipment: ['Barra T'], instructions: 'Agarra la barra T e inclina el torso, tira hacia el abdomen.' },
  { name: 'Box squat', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.COMPOUND, level: Level.INTERMEDIATE, equipment: ['Barra', 'Cajón'], instructions: 'Sentadilla con pausa en el cajón, ideal para fuerza explosiva.' },
  { name: 'Patada trasera en polea', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Polea'], instructions: 'De pie frente a la polea, extiende la pierna hacia atrás para trabajar glúteos.' },
  { name: 'Abductor de cadera en máquina', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Máquina'], instructions: 'Sentado, abre las piernas contra la resistencia.' },
  { name: 'Patada de tríceps kickback', muscleGroup: MuscleGroup.ARMS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Mancuerna'], instructions: 'Inclinado, extiende el brazo hacia atrás para trabajar el tríceps.' },
  { name: 'Curl concentrado sentado', muscleGroup: MuscleGroup.ARMS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Mancuerna'], instructions: 'Sentado, apoya el codo en la rodilla y curl con máxima concentración.' },
  { name: 'Zancadas caminando', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: ['Mancuernas'], instructions: 'Da pasos largos alternando piernas, manteniendo el torso recto.' },
  { name: 'Saltos verticales', muscleGroup: MuscleGroup.FULL_BODY, type: ExerciseType.COMPOUND, level: Level.BEGINNER, equipment: [], instructions: 'Desde cuclillas, salta lo más alto posible con los brazos arriba.' },
  { name: 'Box jumps', muscleGroup: MuscleGroup.FULL_BODY, type: ExerciseType.COMPOUND, level: Level.INTERMEDIATE, equipment: ['Cajón'], instructions: 'Salta sobre el cajón aterrizando con ambos pies.' },
  { name: 'Plancha con peso', muscleGroup: MuscleGroup.CORE, type: ExerciseType.COMPOUND, level: Level.INTERMEDIATE, equipment: ['Disco'], instructions: 'Plancha frontal con un disco sobre la espalda para mayor intensidad.' },
  { name: 'Anti-rotación en polea', muscleGroup: MuscleGroup.CORE, type: ExerciseType.COMPOUND, level: Level.INTERMEDIATE, equipment: ['Polea'], instructions: 'Pallof press: extiende los brazos frente al pecho resistiendo la rotación.' },
  { name: 'Extensión de cadera en polea', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.ISOLATION, level: Level.BEGINNER, equipment: ['Polea'], instructions: 'De pie, extiende la cadera hacia atrás con la polea baja.' },
];

async function main() {
  console.log('🌱 Seeding exercises...');
  let created = 0;
  for (const exercise of exercises) {
    const exists = await prisma.exercise.findFirst({ where: { name: exercise.name } });
    if (!exists) {
      await prisma.exercise.create({ data: exercise });
      created++;
    }
  }
  if (created > 0) {
    console.log(`✅ ${created} new exercises seeded successfully`);
  } else {
    console.log('⏭️  All exercises already exist. Skipping.');
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
