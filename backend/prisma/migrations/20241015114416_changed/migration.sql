-- AlterTable
ALTER TABLE "User" ADD COLUMN     "completedTrips" INTEGER DEFAULT 0,
ADD COLUMN     "earned" INTEGER DEFAULT 0,
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0;
