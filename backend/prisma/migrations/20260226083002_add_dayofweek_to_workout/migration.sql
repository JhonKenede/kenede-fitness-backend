-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "dayOfWeek" "DayOfWeek"[],
ADD COLUMN     "muscleGroups" TEXT[];
