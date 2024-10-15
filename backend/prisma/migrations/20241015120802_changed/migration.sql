/*
  Warnings:

  - You are about to drop the column `noOfTrips` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "noOfTrips",
ADD COLUMN     "distanceTravelled" INTEGER DEFAULT 0;
