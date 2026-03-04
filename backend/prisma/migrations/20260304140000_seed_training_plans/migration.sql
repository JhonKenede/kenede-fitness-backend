-- Seed: 7 Training Plans (4 Male, 3 Female) + new exercises
-- Guard: skip if plans already exist

DO $$
DECLARE
  -- ── Known exercise IDs ─────────────────────────────────
  e_bench        TEXT := 'b7f6bf25-f5ca-4bad-be59-8b33b246df1f';
  e_db_flat      TEXT := 'a6e21dd9-5f00-4027-b800-013a64116aed';
  e_incline      TEXT := '046cd146-0115-41fc-aaaa-893ede1e2e9e';
  e_decline      TEXT := 'a0306964-9025-4708-8b1e-3239e8fec5a8';
  e_crossover    TEXT := '24e0451c-70bb-4249-9ec8-85c5af4849cb';
  e_dips_chest   TEXT := 'cf30dff7-2566-4dd2-826f-48c9d14a21f9';
  e_chest_mach   TEXT := 'b75baa93-6ba6-4b2d-a44c-b48b8b9cfc44';
  e_pullover     TEXT := 'a069f9d5-9438-4cc2-9fda-2f0ac60e3e95';
  e_pullups      TEXT := '2517c042-ca75-4e5f-a441-78bc4d49faf4';
  e_bar_row      TEXT := '76674e81-c47e-4803-9dab-b2ba4fe916dc';
  e_db_row       TEXT := 'a3bdbedf-5293-4384-9c59-685eeecb7688';
  e_lat_pull     TEXT := '6ef1fc44-b63a-41b0-a482-a83443f92244';
  e_deadlift     TEXT := '27784360-3609-4231-a0a1-b9722392e549';
  e_cable_row    TEXT := '84e2cfb4-3259-41a0-95e3-67c6a2ff483a';
  e_face_pull    TEXT := 'a0da9e15-450a-47ce-9010-70705d1d91d7';
  e_mil_press    TEXT := '5a3a65d1-a6a5-44b1-80f3-fefc319cd690';
  e_db_shoulder  TEXT := '43e8abb6-a917-4d0d-8031-33e50aa5d2cb';
  e_lat_raise    TEXT := '6f9e9ee3-fabb-4ae9-8cae-f48cce76b70a';
  e_front_raise  TEXT := 'fd883e59-9029-4f3c-9489-f042b48dfb2d';
  e_rear_delt    TEXT := '197413c4-5326-4fa1-8dbe-1c756e9a38b7';
  e_cable_lat    TEXT := 'b783341e-f088-41ee-9ae7-0c5dcac7e175';
  e_bar_curl     TEXT := 'aa296a7d-d26e-4336-8fd1-936f6a9d7945';
  e_db_curl      TEXT := '53e6628b-e17a-4313-a9f7-c44643d15ee4';
  e_hammer       TEXT := 'efe3be89-4749-4ba2-95de-27f93f238c13';
  e_cable_curl   TEXT := '15a62a61-faf9-4300-80c9-c0a0bc99ee18';
  e_tri_push     TEXT := 'c60d77e4-cb81-4784-8cc3-8f8497fc8ff7';
  e_french       TEXT := 'e1df28e5-e947-43b5-8bee-212b0cd50635';
  e_dips_tri     TEXT := 'a11b5a4f-281c-4983-9019-e2dae53c19d7';
  e_squat        TEXT := '38349672-788d-4e09-9035-66d462dbff57';
  e_leg_press    TEXT := 'f4ff92d8-e7b5-40ed-b6ec-beb4ab4c782a';
  e_lunges       TEXT := 'ac4eab23-f5c2-4904-9cfc-1e27575e72d2';
  e_bulgarian    TEXT := '91eb2751-cdee-4b8a-b643-da8fb53eff69';
  e_leg_ext      TEXT := 'afd3b1fe-a408-481c-9fbc-b8ab3a514140';
  e_leg_curl     TEXT := '2ad34e84-69fd-48e0-80fd-18894868fba2';
  e_rdl          TEXT := '01b9177e-4b96-4291-b688-c8eb648091a0';
  e_calf         TEXT := '565a3d4f-c7ac-4ead-afc9-698aceda5d44';
  e_hip_thrust   TEXT := 'e17ea048-3137-4167-882e-568d012b6a66';
  e_goblet       TEXT := 'b405ca9d-2bd0-4a66-8679-ba5c3552ffb4';
  e_plank        TEXT := 'cf15fdf3-0c9d-48f2-9b1f-c522a1a33400';
  e_leg_raises   TEXT := 'b963bafc-6e51-4331-91d8-1a1080d121d6';
  e_russian      TEXT := '8050fff1-9f6c-414a-bfbd-e84e228138ca';
  e_burpees      TEXT := '44815e6d-46bc-40d7-b3a4-af259852a23d';

  -- ── New exercise IDs (inserted below) ──────────────────
  e_sumo_squat   TEXT;
  e_seated_curl  TEXT;
  e_seated_calf  TEXT;
  e_tbar_row     TEXT;
  e_box_squat    TEXT;
  e_kickback_gl  TEXT;
  e_abductor     TEXT;
  e_kickback_tri TEXT;
  e_conc_curl    TEXT;
  e_walk_lunges  TEXT;
  e_vert_jump    TEXT;
  e_box_jump     TEXT;
  e_weighted_plk TEXT;
  e_pallof       TEXT;
  e_hip_ext_cab  TEXT;

  -- Plan IDs
  p1 TEXT; p2 TEXT; p3 TEXT; p4 TEXT; p5 TEXT; p6 TEXT; p7 TEXT;

  -- Workout IDs
  w TEXT;

BEGIN
  -- ── Guard ────────────────────────────────────────────────
  IF (SELECT COUNT(*) FROM "TrainingPlan") > 0 THEN
    RAISE NOTICE 'Training plans already seeded. Skipping.';
    RETURN;
  END IF;

  -- ── Insert new exercises (skip if name already exists) ──
  IF NOT EXISTS (SELECT 1 FROM "Exercise" WHERE name='Sentadilla sumo con barra') THEN
    INSERT INTO "Exercise"(id,name,"muscleGroup",type,level,equipment,instructions) VALUES (gen_random_uuid(),'Sentadilla sumo con barra','LEGS','COMPOUND','INTERMEDIATE',ARRAY['Barra'],'Pies más anchos que los hombros, puntas hacia fuera, baja controladamente.');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "Exercise" WHERE name='Curl femoral sentado') THEN
    INSERT INTO "Exercise"(id,name,"muscleGroup",type,level,equipment,instructions) VALUES (gen_random_uuid(),'Curl femoral sentado','LEGS','ISOLATION','BEGINNER',ARRAY['Máquina'],'Sentado en la máquina, flexiona las rodillas contra la resistencia.');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "Exercise" WHERE name='Gemelos sentado') THEN
    INSERT INTO "Exercise"(id,name,"muscleGroup",type,level,equipment,instructions) VALUES (gen_random_uuid(),'Gemelos sentado','LEGS','ISOLATION','BEGINNER',ARRAY['Máquina'],'Sentado, eleva los talones para trabajar el sóleo.');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "Exercise" WHERE name='Remo T-bar') THEN
    INSERT INTO "Exercise"(id,name,"muscleGroup",type,level,equipment,instructions) VALUES (gen_random_uuid(),'Remo T-bar','BACK','COMPOUND','INTERMEDIATE',ARRAY['Barra T'],'Agarra la barra T e inclina el torso, tira hacia el abdomen.');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "Exercise" WHERE name='Box squat') THEN
    INSERT INTO "Exercise"(id,name,"muscleGroup",type,level,equipment,instructions) VALUES (gen_random_uuid(),'Box squat','LEGS','COMPOUND','INTERMEDIATE',ARRAY['Barra','Cajón'],'Sentadilla con pausa en el cajón, ideal para fuerza explosiva.');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "Exercise" WHERE name='Patada trasera en polea') THEN
    INSERT INTO "Exercise"(id,name,"muscleGroup",type,level,equipment,instructions) VALUES (gen_random_uuid(),'Patada trasera en polea','LEGS','ISOLATION','BEGINNER',ARRAY['Polea'],'De pie frente a la polea, extiende la pierna hacia atrás para trabajar glúteos.');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "Exercise" WHERE name='Abductor de cadera en máquina') THEN
    INSERT INTO "Exercise"(id,name,"muscleGroup",type,level,equipment,instructions) VALUES (gen_random_uuid(),'Abductor de cadera en máquina','LEGS','ISOLATION','BEGINNER',ARRAY['Máquina'],'Sentado, abre las piernas contra la resistencia.');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "Exercise" WHERE name='Patada de tríceps kickback') THEN
    INSERT INTO "Exercise"(id,name,"muscleGroup",type,level,equipment,instructions) VALUES (gen_random_uuid(),'Patada de tríceps kickback','ARMS','ISOLATION','BEGINNER',ARRAY['Mancuerna'],'Inclinado, extiende el brazo hacia atrás para trabajar el tríceps.');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "Exercise" WHERE name='Curl concentrado sentado') THEN
    INSERT INTO "Exercise"(id,name,"muscleGroup",type,level,equipment,instructions) VALUES (gen_random_uuid(),'Curl concentrado sentado','ARMS','ISOLATION','BEGINNER',ARRAY['Mancuerna'],'Sentado, apoya el codo en la rodilla y curl con máxima concentración.');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "Exercise" WHERE name='Zancadas caminando') THEN
    INSERT INTO "Exercise"(id,name,"muscleGroup",type,level,equipment,instructions) VALUES (gen_random_uuid(),'Zancadas caminando','LEGS','COMPOUND','BEGINNER',ARRAY['Mancuernas'],'Da pasos largos alternando piernas, manteniendo el torso recto.');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "Exercise" WHERE name='Saltos verticales') THEN
    INSERT INTO "Exercise"(id,name,"muscleGroup",type,level,equipment,instructions) VALUES (gen_random_uuid(),'Saltos verticales','FULL_BODY','COMPOUND','BEGINNER',ARRAY[]::text[],'Desde cuclillas, salta lo más alto posible con los brazos arriba.');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "Exercise" WHERE name='Box jumps') THEN
    INSERT INTO "Exercise"(id,name,"muscleGroup",type,level,equipment,instructions) VALUES (gen_random_uuid(),'Box jumps','FULL_BODY','COMPOUND','INTERMEDIATE',ARRAY['Cajón'],'Salta sobre el cajón aterrizando con ambos pies.');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "Exercise" WHERE name='Plancha con peso') THEN
    INSERT INTO "Exercise"(id,name,"muscleGroup",type,level,equipment,instructions) VALUES (gen_random_uuid(),'Plancha con peso','CORE','COMPOUND','INTERMEDIATE',ARRAY['Disco'],'Plancha frontal con un disco sobre la espalda para mayor intensidad.');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "Exercise" WHERE name='Anti-rotación en polea') THEN
    INSERT INTO "Exercise"(id,name,"muscleGroup",type,level,equipment,instructions) VALUES (gen_random_uuid(),'Anti-rotación en polea','CORE','COMPOUND','INTERMEDIATE',ARRAY['Polea'],'Pallof press: extiende los brazos frente al pecho resistiendo la rotación.');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "Exercise" WHERE name='Extensión de cadera en polea') THEN
    INSERT INTO "Exercise"(id,name,"muscleGroup",type,level,equipment,instructions) VALUES (gen_random_uuid(),'Extensión de cadera en polea','LEGS','ISOLATION','BEGINNER',ARRAY['Polea'],'De pie, extiende la cadera hacia atrás con la polea baja.');
  END IF;

  -- Fetch new exercise IDs
  e_sumo_squat   := (SELECT id FROM "Exercise" WHERE name='Sentadilla sumo con barra' LIMIT 1);
  e_seated_curl  := (SELECT id FROM "Exercise" WHERE name='Curl femoral sentado' LIMIT 1);
  e_seated_calf  := (SELECT id FROM "Exercise" WHERE name='Gemelos sentado' LIMIT 1);
  e_tbar_row     := (SELECT id FROM "Exercise" WHERE name='Remo T-bar' LIMIT 1);
  e_box_squat    := (SELECT id FROM "Exercise" WHERE name='Box squat' LIMIT 1);
  e_kickback_gl  := (SELECT id FROM "Exercise" WHERE name='Patada trasera en polea' LIMIT 1);
  e_abductor     := (SELECT id FROM "Exercise" WHERE name='Abductor de cadera en máquina' LIMIT 1);
  e_kickback_tri := (SELECT id FROM "Exercise" WHERE name='Patada de tríceps kickback' LIMIT 1);
  e_conc_curl    := (SELECT id FROM "Exercise" WHERE name='Curl concentrado sentado' LIMIT 1);
  e_walk_lunges  := (SELECT id FROM "Exercise" WHERE name='Zancadas caminando' LIMIT 1);
  e_vert_jump    := (SELECT id FROM "Exercise" WHERE name='Saltos verticales' LIMIT 1);
  e_box_jump     := (SELECT id FROM "Exercise" WHERE name='Box jumps' LIMIT 1);
  e_weighted_plk := (SELECT id FROM "Exercise" WHERE name='Plancha con peso' LIMIT 1);
  e_pallof       := (SELECT id FROM "Exercise" WHERE name='Anti-rotación en polea' LIMIT 1);
  e_hip_ext_cab  := (SELECT id FROM "Exercise" WHERE name='Extensión de cadera en polea' LIMIT 1);

  -- ════════════════════════════════════════════════════════
  -- PLAN 1 — Hombre: Volumen PPL (5 días)
  -- ════════════════════════════════════════════════════════
  p1 := gen_random_uuid();
  INSERT INTO "TrainingPlan"(id,name,description,goal,gender,"daysPerWeek",level,emoji,"isActive","createdAt","updatedAt")
  VALUES(p1,'Volumen PPL','Programa Push/Pull/Legs de 5 días orientado a ganar masa muscular. Alta frecuencia y volumen progresivo.','VOLUME','MALE',5,'INTERMEDIATE','🔵',true,NOW(),NOW());

  -- Day 1: Push A
  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'PPL Push A','Día 1 del plan Volumen PPL','CHEST',ARRAY['CHEST','SHOULDERS','ARMS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_bench,4,8,150,1),(gen_random_uuid(),w,e_incline,4,10,90,2),
    (gen_random_uuid(),w,e_crossover,3,12,60,3),(gen_random_uuid(),w,e_mil_press,4,8,150,4),
    (gen_random_uuid(),w,e_lat_raise,3,15,60,5),(gen_random_uuid(),w,e_dips_chest,3,10,90,6),
    (gen_random_uuid(),w,e_tri_push,3,12,60,7);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p1,1,'Push — Pecho, Hombros, Tríceps',false,w);

  -- Day 2: Pull A
  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'PPL Pull A','Día 2 del plan Volumen PPL','BACK',ARRAY['BACK','ARMS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_pullups,4,8,150,1),(gen_random_uuid(),w,e_bar_row,4,8,150,2),
    (gen_random_uuid(),w,e_cable_row,4,12,90,3),(gen_random_uuid(),w,e_pullover,3,12,60,4),
    (gen_random_uuid(),w,e_bar_curl,4,10,90,5),(gen_random_uuid(),w,e_hammer,3,12,60,6),
    (gen_random_uuid(),w,e_leg_curl,3,12,60,7);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p1,2,'Pull — Espalda, Bíceps',false,w);

  -- Day 3: REST
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p1,3,'Descanso',true,NULL);

  -- Day 4: Legs
  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'PPL Piernas','Día 4 del plan Volumen PPL','LEGS',ARRAY['LEGS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_squat,5,8,150,1),(gen_random_uuid(),w,e_leg_press,4,12,120,2),
    (gen_random_uuid(),w,e_bulgarian,3,12,90,3),(gen_random_uuid(),w,e_leg_ext,3,15,60,4),
    (gen_random_uuid(),w,e_leg_curl,3,12,60,5),(gen_random_uuid(),w,e_hip_thrust,4,12,90,6),
    (gen_random_uuid(),w,e_calf,4,20,45,7);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p1,4,'Legs — Cuádriceps, Isquios, Glúteos',false,w);

  -- Day 5: Push B
  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'PPL Push B','Día 5 del plan Volumen PPL','CHEST',ARRAY['CHEST','SHOULDERS','ARMS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_incline,4,10,120,1),(gen_random_uuid(),w,e_decline,3,10,90,2),
    (gen_random_uuid(),w,e_crossover,3,12,60,3),(gen_random_uuid(),w,e_db_shoulder,3,10,90,4),
    (gen_random_uuid(),w,e_front_raise,3,15,60,5),(gen_random_uuid(),w,e_french,3,10,90,6),
    (gen_random_uuid(),w,e_kickback_tri,3,15,60,7);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p1,5,'Push B — Pecho, Hombros, Tríceps',false,w);

  -- ════════════════════════════════════════════════════════
  -- PLAN 2 — Hombre: Volumen Upper/Lower (4 días)
  -- ════════════════════════════════════════════════════════
  p2 := gen_random_uuid();
  INSERT INTO "TrainingPlan"(id,name,description,goal,gender,"daysPerWeek",level,emoji,"isActive","createdAt","updatedAt")
  VALUES(p2,'Volumen Upper/Lower','Programa Upper/Lower de 4 días. Combina fuerza en jornadas upper y volumen en lower.','VOLUME','MALE',4,'INTERMEDIATE','⚡',true,NOW(),NOW());

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'UPL Upper A','Día 1 del plan Volumen UPL','CHEST',ARRAY['CHEST','BACK','SHOULDERS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_bench,5,6,180,1),(gen_random_uuid(),w,e_bar_row,5,6,180,2),
    (gen_random_uuid(),w,e_lat_pull,3,8,150,3),(gen_random_uuid(),w,e_incline,3,10,120,4),
    (gen_random_uuid(),w,e_db_row,3,10,90,5);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p2,1,'Upper A — Fuerza Empuje + Tirón',false,w);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'UPL Piernas','Día 2 del plan Volumen UPL','LEGS',ARRAY['LEGS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_squat,4,8,150,1),(gen_random_uuid(),w,e_rdl,4,10,90,2),
    (gen_random_uuid(),w,e_leg_press,3,12,90,3),(gen_random_uuid(),w,e_hip_thrust,3,12,90,4),
    (gen_random_uuid(),w,e_leg_ext,3,15,60,5),(gen_random_uuid(),w,e_calf,4,20,45,6);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p2,2,'Lower — Cuádriceps, Isquios, Glúteos',false,w);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'UPL Upper B','Día 3 del plan Volumen UPL','SHOULDERS',ARRAY['SHOULDERS','ARMS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_mil_press,4,8,120,1),(gen_random_uuid(),w,e_db_flat,3,10,90,2),
    (gen_random_uuid(),w,e_lat_raise,4,12,60,3),(gen_random_uuid(),w,e_bar_curl,3,10,90,4),
    (gen_random_uuid(),w,e_french,3,10,90,5),(gen_random_uuid(),w,e_rear_delt,3,15,60,6);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p2,3,'Upper B — Hombros y Brazos',false,w);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'UPL Espalda','Día 4 del plan Volumen UPL','BACK',ARRAY['BACK'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_lat_pull,4,10,90,1),(gen_random_uuid(),w,e_cable_row,4,12,90,2),
    (gen_random_uuid(),w,e_pullover,3,12,60,3),(gen_random_uuid(),w,e_tbar_row,3,10,90,4),
    (gen_random_uuid(),w,e_face_pull,3,15,45,5);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p2,4,'Espalda — Volumen Pull',false,w);

  -- ════════════════════════════════════════════════════════
  -- PLAN 3 — Hombre: Definición PPL + Cardio (5 días)
  -- ════════════════════════════════════════════════════════
  p3 := gen_random_uuid();
  INSERT INTO "TrainingPlan"(id,name,description,goal,gender,"daysPerWeek",level,emoji,"isActive","createdAt","updatedAt")
  VALUES(p3,'Definición PPL','Circuito PPL de definición: series altas, descansos cortos y cardio integrado para quemar grasa.','DEFINITION','MALE',5,'INTERMEDIATE','✂️',true,NOW(),NOW());

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'DEF Push','Día 1 del plan Definición PPL','CHEST',ARRAY['CHEST','SHOULDERS','ARMS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_db_flat,4,15,60,1),(gen_random_uuid(),w,e_crossover,4,15,45,2),
    (gen_random_uuid(),w,e_chest_mach,3,15,60,3),(gen_random_uuid(),w,e_db_shoulder,3,12,60,4),
    (gen_random_uuid(),w,e_cable_lat,3,15,45,5),(gen_random_uuid(),w,e_tri_push,3,15,45,6),
    (gen_random_uuid(),w,e_dips_tri,2,15,30,7);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p3,1,'Push Definición',false,w);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'DEF Pull','Día 2 del plan Definición PPL','BACK',ARRAY['BACK','ARMS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_lat_pull,4,15,45,1),(gen_random_uuid(),w,e_cable_row,4,15,45,2),
    (gen_random_uuid(),w,e_pullover,3,15,30,3),(gen_random_uuid(),w,e_cable_curl,3,15,30,4),
    (gen_random_uuid(),w,e_conc_curl,3,12,30,5),(gen_random_uuid(),w,e_face_pull,3,20,30,6);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p3,2,'Pull Definición',false,w);

  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p3,3,'Descanso',true,NULL);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'DEF Piernas','Día 4 del plan Definición PPL','LEGS',ARRAY['LEGS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_goblet,4,15,60,1),(gen_random_uuid(),w,e_walk_lunges,4,20,45,2),
    (gen_random_uuid(),w,e_leg_ext,4,15,45,3),(gen_random_uuid(),w,e_seated_curl,4,15,45,4),
    (gen_random_uuid(),w,e_hip_thrust,4,15,45,5),(gen_random_uuid(),w,e_abductor,3,20,30,6),
    (gen_random_uuid(),w,e_calf,4,25,30,7);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p3,4,'Legs Definición',false,w);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'DEF Cardio & Core','Día 5 del plan Definición PPL','CORE',ARRAY['CORE'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_plank,3,60,60,1),(gen_random_uuid(),w,e_russian,3,20,45,2),
    (gen_random_uuid(),w,e_leg_raises,3,15,45,3),(gen_random_uuid(),w,e_burpees,4,10,60,4);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p3,5,'Cardio + Core',false,w);

  -- ════════════════════════════════════════════════════════
  -- PLAN 4 — Hombre: Fuerza Conjugada (4 días)
  -- ════════════════════════════════════════════════════════
  p4 := gen_random_uuid();
  INSERT INTO "TrainingPlan"(id,name,description,goal,gender,"daysPerWeek",level,emoji,"isActive","createdAt","updatedAt")
  VALUES(p4,'Fuerza Conjugada','Método Westside-inspirado: alterna días de máximo esfuerzo, dinámico y repeticiones para maximizar fuerza.','STRENGTH','MALE',4,'ADVANCED','⛏️',true,NOW(),NOW());

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'CONJ Máximo Esfuerzo','Día 1 del plan Fuerza Conjugada','CHEST',ARRAY['CHEST','BACK','ARMS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_bench,6,2,240,1),(gen_random_uuid(),w,e_bar_row,3,5,180,2),
    (gen_random_uuid(),w,e_dips_chest,3,5,120,3);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p4,1,'Máximo Esfuerzo — Upper',false,w);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'CONJ Dinámico Lower','Día 2 del plan Fuerza Conjugada','LEGS',ARRAY['LEGS','CORE'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_squat,8,2,120,1),(gen_random_uuid(),w,e_deadlift,3,3,180,2),
    (gen_random_uuid(),w,e_leg_press,3,6,90,3),(gen_random_uuid(),w,e_plank,3,45,60,4);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p4,2,'Dinámico — Lower',false,w);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'CONJ Repeticiones','Día 3 del plan Fuerza Conjugada','BACK',ARRAY['BACK','LEGS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_deadlift,5,5,150,1),(gen_random_uuid(),w,e_tbar_row,4,6,120,2),
    (gen_random_uuid(),w,e_goblet,3,5,120,3);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p4,3,'Repeticiones — Upper',false,w);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'CONJ Asistencia','Día 4 del plan Fuerza Conjugada','SHOULDERS',ARRAY['SHOULDERS','BACK','ARMS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_front_raise,3,8,90,1),(gen_random_uuid(),w,e_cable_row,3,10,90,2),
    (gen_random_uuid(),w,e_bar_curl,3,8,60,3);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p4,4,'Complementario — Asistencia',false,w);

  -- ════════════════════════════════════════════════════════
  -- PLAN 5 — Mujer: Volumen Glúteos (4 días)
  -- ════════════════════════════════════════════════════════
  p5 := gen_random_uuid();
  INSERT INTO "TrainingPlan"(id,name,description,goal,gender,"daysPerWeek",level,emoji,"isActive","createdAt","updatedAt")
  VALUES(p5,'Volumen Glúteos','Programa femenino enfocado en volumen de glúteos con dos sesiones dedicadas de glúteo-pierna.','VOLUME','FEMALE',4,'INTERMEDIATE','💜',true,NOW(),NOW());

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'GLUT Glúteos A','Día 1 del plan Volumen Glúteos','LEGS',ARRAY['LEGS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_hip_thrust,4,8,120,1),(gen_random_uuid(),w,e_sumo_squat,4,10,90,2),
    (gen_random_uuid(),w,e_rdl,3,12,90,3),(gen_random_uuid(),w,e_bulgarian,3,10,60,4),
    (gen_random_uuid(),w,e_calf,3,20,45,5);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p5,1,'Glúteos A — Fuerza',false,w);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'GLUT Torso','Día 2 del plan Volumen Glúteos','CHEST',ARRAY['CHEST','BACK','SHOULDERS','ARMS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_db_flat,3,12,60,1),(gen_random_uuid(),w,e_cable_row,3,12,60,2),
    (gen_random_uuid(),w,e_crossover,3,15,45,3),(gen_random_uuid(),w,e_lat_pull,3,12,60,4),
    (gen_random_uuid(),w,e_db_shoulder,3,10,60,5),(gen_random_uuid(),w,e_lat_raise,3,15,45,6),
    (gen_random_uuid(),w,e_db_curl,2,12,45,7);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p5,2,'Torso — Push & Pull',false,w);

  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p5,3,'Descanso',true,NULL);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'GLUT Glúteos B','Día 4 del plan Volumen Glúteos','LEGS',ARRAY['LEGS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_goblet,4,15,60,1),(gen_random_uuid(),w,e_hip_thrust,4,15,45,2),
    (gen_random_uuid(),w,e_walk_lunges,3,20,45,3),(gen_random_uuid(),w,e_leg_ext,3,15,45,4),
    (gen_random_uuid(),w,e_kickback_gl,3,15,45,5),(gen_random_uuid(),w,e_abductor,3,20,30,6),
    (gen_random_uuid(),w,e_seated_calf,3,20,30,7);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p5,4,'Glúteos B — Volumen',false,w);

  -- ════════════════════════════════════════════════════════
  -- PLAN 6 — Mujer: Definición 5 días
  -- ════════════════════════════════════════════════════════
  p6 := gen_random_uuid();
  INSERT INTO "TrainingPlan"(id,name,description,goal,gender,"daysPerWeek",level,emoji,"isActive","createdAt","updatedAt")
  VALUES(p6,'Definición Femenina 5 días','Programa de definición de 5 días para mujer. Descansos cortos para maximizar el gasto calórico.','DEFINITION','FEMALE',5,'INTERMEDIATE','🩵',true,NOW(),NOW());

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'FDEF Glúteos','Día 1 del plan Definición Femenina','LEGS',ARRAY['LEGS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_hip_thrust,4,15,90,1),(gen_random_uuid(),w,e_goblet,3,15,60,2),
    (gen_random_uuid(),w,e_bulgarian,3,12,60,3),(gen_random_uuid(),w,e_kickback_gl,3,20,45,4),
    (gen_random_uuid(),w,e_abductor,2,25,45,5);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p6,1,'Glúteos Definición',false,w);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'FDEF Torso Push','Día 2 del plan Definición Femenina','CHEST',ARRAY['CHEST','SHOULDERS','ARMS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_db_flat,4,12,45,1),(gen_random_uuid(),w,e_crossover,3,15,30,2),
    (gen_random_uuid(),w,e_chest_mach,3,15,45,3),(gen_random_uuid(),w,e_db_shoulder,3,12,60,4),
    (gen_random_uuid(),w,e_cable_lat,3,15,30,5),(gen_random_uuid(),w,e_tri_push,3,15,30,6);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p6,2,'Torso Push Definición',false,w);

  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p6,3,'Descanso',true,NULL);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'FDEF Piernas','Día 4 del plan Definición Femenina','LEGS',ARRAY['LEGS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_goblet,4,15,60,1),(gen_random_uuid(),w,e_leg_ext,4,15,45,2),
    (gen_random_uuid(),w,e_walk_lunges,3,20,45,3),(gen_random_uuid(),w,e_seated_curl,4,15,45,4),
    (gen_random_uuid(),w,e_calf,4,20,30,5),(gen_random_uuid(),w,e_seated_calf,3,20,30,6);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p6,4,'Piernas Definición',false,w);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'FDEF Espalda','Día 5 del plan Definición Femenina','BACK',ARRAY['BACK','ARMS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_lat_pull,4,15,45,1),(gen_random_uuid(),w,e_cable_row,4,15,45,2),
    (gen_random_uuid(),w,e_pullover,3,15,30,3),(gen_random_uuid(),w,e_cable_curl,3,15,30,4),
    (gen_random_uuid(),w,e_conc_curl,3,15,30,5),(gen_random_uuid(),w,e_face_pull,3,20,30,6);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p6,5,'Espalda Pull Definición',false,w);

  -- ════════════════════════════════════════════════════════
  -- PLAN 7 — Mujer: Fuerza 4 días
  -- ════════════════════════════════════════════════════════
  p7 := gen_random_uuid();
  INSERT INTO "TrainingPlan"(id,name,description,goal,gender,"daysPerWeek",level,emoji,"isActive","createdAt","updatedAt")
  VALUES(p7,'Fuerza Femenina 4 días','Programa de fuerza para mujer basado en los tres básicos con pliometría funcional.','STRENGTH','FEMALE',4,'INTERMEDIATE','💖',true,NOW(),NOW());

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'FSTR Lower A','Día 1 del plan Fuerza Femenina','LEGS',ARRAY['LEGS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_squat,5,5,150,1),(gen_random_uuid(),w,e_box_squat,3,5,120,2),
    (gen_random_uuid(),w,e_rdl,3,8,90,3),(gen_random_uuid(),w,e_hip_ext_cab,2,10,60,4);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p7,1,'Lower A — Sentadilla',false,w);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'FSTR Upper','Día 2 del plan Fuerza Femenina','CHEST',ARRAY['CHEST','BACK','SHOULDERS','ARMS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_bench,5,5,150,1),(gen_random_uuid(),w,e_bar_row,5,5,150,2),
    (gen_random_uuid(),w,e_mil_press,3,6,120,3),(gen_random_uuid(),w,e_lat_pull,3,6,120,4),
    (gen_random_uuid(),w,e_dips_chest,3,6,120,5);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p7,2,'Upper — Press Banca + Espalda',false,w);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'FSTR Lower B','Día 3 del plan Fuerza Femenina','LEGS',ARRAY['LEGS'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_hip_thrust,5,5,150,1),(gen_random_uuid(),w,e_sumo_squat,4,8,120,2),
    (gen_random_uuid(),w,e_deadlift,3,5,150,3),(gen_random_uuid(),w,e_vert_jump,4,5,120,4);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p7,3,'Lower B — Hip Thrust + Sumo',false,w);

  w := gen_random_uuid();
  INSERT INTO "Workout"(id,name,description,category,"muscleGroups","isTemplate","isActive","dayOfWeek","createdAt","updatedAt")
  VALUES(w,'FSTR Pliometría','Día 4 del plan Fuerza Femenina','FULL_BODY',ARRAY['LEGS','CORE'],true,true,ARRAY[]::"DayOfWeek"[],NOW(),NOW());
  INSERT INTO "WorkoutExercise"(id,"workoutId","exerciseId",sets,reps,"restTime","order") VALUES
    (gen_random_uuid(),w,e_burpees,5,5,120,1),(gen_random_uuid(),w,e_box_jump,4,10,60,2),
    (gen_random_uuid(),w,e_weighted_plk,3,20,60,3),(gen_random_uuid(),w,e_pallof,3,10,60,4);
  INSERT INTO "PlanDay"(id,"planId","dayNumber","dayLabel","isRestDay","workoutId") VALUES(gen_random_uuid(),p7,4,'Pliometría + Core',false,w);

  RAISE NOTICE 'Training plans seeded successfully: 7 plans created.';
END $$;
