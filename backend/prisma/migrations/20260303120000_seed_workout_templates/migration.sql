-- Seed workout templates (only if none exist)
DO $$
DECLARE
  v_chest_id UUID;
  v_back_id UUID;
  v_legs_id UUID;
  v_shoulders_id UUID;
  v_arms_id UUID;
  v_core_id UUID;
  v_fullbody_id UUID;
BEGIN
  -- Only seed if no templates exist
  IF EXISTS (SELECT 1 FROM "Workout" WHERE "isTemplate" = true) THEN
    RAISE NOTICE 'Templates already seeded, skipping.';
    RETURN;
  END IF;

  RAISE NOTICE 'Seeding workout templates...';

  -- ── CHEST ─────────────────────────────────────────────────────────
  v_chest_id := gen_random_uuid();
  INSERT INTO "Workout" ("id","name","description","isActive","isTemplate","category","muscleGroups","dayOfWeek","createdAt","updatedAt")
  VALUES (v_chest_id, 'Pecho — Hipertrofia', 'Press + Inclinado + Crossover · Hipertrofia completa de pecho',
          true, true, 'CHEST', ARRAY['CHEST']::text[], ARRAY[]::"DayOfWeek"[], NOW(), NOW());

  INSERT INTO "WorkoutExercise" ("id","workoutId","exerciseId","sets","reps","weight","restTime","order")
  VALUES
    (gen_random_uuid(), v_chest_id, 'b7f6bf25-f5ca-4bad-be59-8b33b246df1f', 4, 8,  60, 90, 1),
    (gen_random_uuid(), v_chest_id, '046cd146-0115-41fc-aaaa-893ede1e2e9e', 3, 10, 40, 90, 2),
    (gen_random_uuid(), v_chest_id, '24e0451c-70bb-4249-9ec8-85c5af4849cb', 3, 12, 15, 60, 3),
    (gen_random_uuid(), v_chest_id, '39a932d3-7419-4f59-a9fa-0493266f7f69', 3, 12, 12, 60, 4);

  -- ── BACK ──────────────────────────────────────────────────────────
  v_back_id := gen_random_uuid();
  INSERT INTO "Workout" ("id","name","description","isActive","isTemplate","category","muscleGroups","dayOfWeek","createdAt","updatedAt")
  VALUES (v_back_id, 'Espalda — Ancha y Fuerte', 'Dominadas + Remo + Jalón · Espalda ancha y poderosa',
          true, true, 'BACK', ARRAY['BACK']::text[], ARRAY[]::"DayOfWeek"[], NOW(), NOW());

  INSERT INTO "WorkoutExercise" ("id","workoutId","exerciseId","sets","reps","weight","restTime","order")
  VALUES
    (gen_random_uuid(), v_back_id, '2517c042-ca75-4e5f-a441-78bc4d49faf4', 4, 6,  0,  120, 1),
    (gen_random_uuid(), v_back_id, '76674e81-c47e-4803-9dab-b2ba4fe916dc', 4, 8,  70, 90,  2),
    (gen_random_uuid(), v_back_id, '6ef1fc44-b63a-41b0-a482-a83443f92244', 3, 10, 55, 90,  3),
    (gen_random_uuid(), v_back_id, '84e2cfb4-3259-41a0-95e3-67c6a2ff483a', 3, 12, 50, 60,  4);

  -- ── LEGS ──────────────────────────────────────────────────────────
  v_legs_id := gen_random_uuid();
  INSERT INTO "Workout" ("id","name","description","isActive","isTemplate","category","muscleGroups","dayOfWeek","createdAt","updatedAt")
  VALUES (v_legs_id, 'Piernas — Fuerza Total', 'Sentadilla + Prensa + Peso muerto rumano · Fuerza e hipertrofia',
          true, true, 'LEGS', ARRAY['LEGS']::text[], ARRAY[]::"DayOfWeek"[], NOW(), NOW());

  INSERT INTO "WorkoutExercise" ("id","workoutId","exerciseId","sets","reps","weight","restTime","order")
  VALUES
    (gen_random_uuid(), v_legs_id, '38349672-788d-4e09-9035-66d462dbff57', 4, 6,  80,  120, 1),
    (gen_random_uuid(), v_legs_id, 'f4ff92d8-e7b5-40ed-b6ec-beb4ab4c782a', 3, 10, 120, 90,  2),
    (gen_random_uuid(), v_legs_id, '01b9177e-4b96-4291-b688-c8eb648091a0', 3, 10, 60,  90,  3),
    (gen_random_uuid(), v_legs_id, '2ad34e84-69fd-48e0-80fd-18894868fba2', 3, 12, 40,  60,  4),
    (gen_random_uuid(), v_legs_id, '565a3d4f-c7ac-4ead-afc9-698aceda5d44', 4, 15, 60,  45,  5);

  -- ── SHOULDERS ─────────────────────────────────────────────────────
  v_shoulders_id := gen_random_uuid();
  INSERT INTO "Workout" ("id","name","description","isActive","isTemplate","category","muscleGroups","dayOfWeek","createdAt","updatedAt")
  VALUES (v_shoulders_id, 'Hombros — Redondeados', 'Press militar + Laterales + Face Pull · Hombros completos',
          true, true, 'SHOULDERS', ARRAY['SHOULDERS']::text[], ARRAY[]::"DayOfWeek"[], NOW(), NOW());

  INSERT INTO "WorkoutExercise" ("id","workoutId","exerciseId","sets","reps","weight","restTime","order")
  VALUES
    (gen_random_uuid(), v_shoulders_id, '5a3a65d1-a6a5-44b1-80f3-fefc319cd690', 4, 8,  40, 90, 1),
    (gen_random_uuid(), v_shoulders_id, '6f9e9ee3-fabb-4ae9-8cae-f48cce76b70a', 4, 12, 10, 60, 2),
    (gen_random_uuid(), v_shoulders_id, 'a0da9e15-450a-47ce-9010-70705d1d91d7', 3, 15, 20, 60, 3),
    (gen_random_uuid(), v_shoulders_id, '197413c4-5326-4fa1-8dbe-1c756e9a38b7', 3, 15, 10, 60, 4);

  -- ── ARMS ──────────────────────────────────────────────────────────
  v_arms_id := gen_random_uuid();
  INSERT INTO "Workout" ("id","name","description","isActive","isTemplate","category","muscleGroups","dayOfWeek","createdAt","updatedAt")
  VALUES (v_arms_id, 'Brazos — Bíceps y Tríceps', 'Curl + Tríceps · Brazos completos',
          true, true, 'ARMS', ARRAY['ARMS']::text[], ARRAY[]::"DayOfWeek"[], NOW(), NOW());

  INSERT INTO "WorkoutExercise" ("id","workoutId","exerciseId","sets","reps","weight","restTime","order")
  VALUES
    (gen_random_uuid(), v_arms_id, 'aa296a7d-d26e-4336-8fd1-936f6a9d7945', 4, 10, 30, 60, 1),
    (gen_random_uuid(), v_arms_id, 'efe3be89-4749-4ba2-95de-27f93f238c13', 3, 12, 16, 60, 2),
    (gen_random_uuid(), v_arms_id, 'c60d77e4-cb81-4784-8cc3-8f8497fc8ff7', 4, 12, 25, 60, 3),
    (gen_random_uuid(), v_arms_id, 'e1df28e5-e947-43b5-8bee-212b0cd50635', 3, 10, 20, 60, 4);

  -- ── CORE ──────────────────────────────────────────────────────────
  v_core_id := gen_random_uuid();
  INSERT INTO "Workout" ("id","name","description","isActive","isTemplate","category","muscleGroups","dayOfWeek","createdAt","updatedAt")
  VALUES (v_core_id, 'Core — Abdomen de Hierro', 'Plancha + Crunch + Rueda · Core fuerte y estable',
          true, true, 'CORE', ARRAY['CORE']::text[], ARRAY[]::"DayOfWeek"[], NOW(), NOW());

  INSERT INTO "WorkoutExercise" ("id","workoutId","exerciseId","sets","reps","weight","restTime","order")
  VALUES
    (gen_random_uuid(), v_core_id, 'cf15fdf3-0c9d-48f2-9b1f-c522a1a33400', 4, 45, 0, 60, 1),
    (gen_random_uuid(), v_core_id, '79585bf7-d735-4572-a4e0-36e4daf59586', 3, 20, 0, 45, 2),
    (gen_random_uuid(), v_core_id, 'b963bafc-6e51-4331-91d8-1a1080d121d6', 3, 15, 0, 45, 3),
    (gen_random_uuid(), v_core_id, '8050fff1-9f6c-414a-bfbd-e84e228138ca', 3, 20, 5, 45, 4),
    (gen_random_uuid(), v_core_id, '9693eefc-3a05-41d0-8217-3eaee5996652', 3, 10, 0, 60, 5);

  -- ── FULL BODY ─────────────────────────────────────────────────────
  v_fullbody_id := gen_random_uuid();
  INSERT INTO "Workout" ("id","name","description","isActive","isTemplate","category","muscleGroups","dayOfWeek","createdAt","updatedAt")
  VALUES (v_fullbody_id, 'Full Body — Cuerpo Completo', 'Peso muerto + Sentadilla + Press + Dominadas · Máxima eficiencia',
          true, true, 'FULL_BODY', ARRAY['CHEST','BACK','LEGS','SHOULDERS','ARMS','CORE']::text[], ARRAY[]::"DayOfWeek"[], NOW(), NOW());

  INSERT INTO "WorkoutExercise" ("id","workoutId","exerciseId","sets","reps","weight","restTime","order")
  VALUES
    (gen_random_uuid(), v_fullbody_id, '27784360-3609-4231-a0a1-b9722392e549', 4, 5, 100, 180, 1),
    (gen_random_uuid(), v_fullbody_id, '38349672-788d-4e09-9035-66d462dbff57', 3, 8, 80,  120, 2),
    (gen_random_uuid(), v_fullbody_id, 'b7f6bf25-f5ca-4bad-be59-8b33b246df1f', 3, 8, 60,  90,  3),
    (gen_random_uuid(), v_fullbody_id, '2517c042-ca75-4e5f-a441-78bc4d49faf4', 3, 6, 0,   90,  4),
    (gen_random_uuid(), v_fullbody_id, '5a3a65d1-a6a5-44b1-80f3-fefc319cd690', 3, 8, 40,  90,  5);

  RAISE NOTICE 'Templates seeded successfully!';
END $$;
