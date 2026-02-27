-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "category" TEXT,
ADD COLUMN     "isTemplate" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "userId" DROP NOT NULL;
