-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateTable: TrainingGroup
CREATE TABLE "TrainingGroup" (
    "id"          TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "description" TEXT,
    "inviteCode"  TEXT NOT NULL,
    "adminId"     TEXT NOT NULL,
    "isActive"    BOOLEAN NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable: GroupMember
CREATE TABLE "GroupMember" (
    "id"       TEXT NOT NULL,
    "groupId"  TEXT NOT NULL,
    "userId"   TEXT NOT NULL,
    "role"     "GroupRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable: GroupWorkout
CREATE TABLE "GroupWorkout" (
    "id"        TEXT NOT NULL,
    "groupId"   TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "addedById" TEXT NOT NULL,
    "addedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupWorkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable: WorkoutProgress
CREATE TABLE "WorkoutProgress" (
    "id"             TEXT NOT NULL,
    "groupMemberId"  TEXT NOT NULL,
    "groupWorkoutId" TEXT NOT NULL,
    "completed"      BOOLEAN NOT NULL DEFAULT false,
    "completedAt"    TIMESTAMP(3),
    "notes"          TEXT,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutProgress_pkey" PRIMARY KEY ("id")
);

-- Unique constraints
CREATE UNIQUE INDEX "TrainingGroup_inviteCode_key" ON "TrainingGroup"("inviteCode");
CREATE UNIQUE INDEX "GroupMember_groupId_userId_key" ON "GroupMember"("groupId", "userId");
CREATE UNIQUE INDEX "WorkoutProgress_groupMemberId_groupWorkoutId_key" ON "WorkoutProgress"("groupMemberId", "groupWorkoutId");

-- Foreign keys
ALTER TABLE "TrainingGroup" ADD CONSTRAINT "TrainingGroup_adminId_fkey"
    FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey"
    FOREIGN KEY ("groupId") REFERENCES "TrainingGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "GroupWorkout" ADD CONSTRAINT "GroupWorkout_groupId_fkey"
    FOREIGN KEY ("groupId") REFERENCES "TrainingGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GroupWorkout" ADD CONSTRAINT "GroupWorkout_workoutId_fkey"
    FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "WorkoutProgress" ADD CONSTRAINT "WorkoutProgress_groupMemberId_fkey"
    FOREIGN KEY ("groupMemberId") REFERENCES "GroupMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkoutProgress" ADD CONSTRAINT "WorkoutProgress_groupWorkoutId_fkey"
    FOREIGN KEY ("groupWorkoutId") REFERENCES "GroupWorkout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
