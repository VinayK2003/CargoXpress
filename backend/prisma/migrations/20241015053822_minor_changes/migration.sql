/*
  Warnings:

  - Changed the type of `pickupLocation` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `dropoffLocation` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "pickupLocation",
ADD COLUMN     "pickupLocation" JSONB NOT NULL,
DROP COLUMN "dropoffLocation",
ADD COLUMN     "dropoffLocation" JSONB NOT NULL;
