/*
  Warnings:

  - Added the required column `takenAt` to the `FoodEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FoodEntry" ADD COLUMN     "takenAt" TIMESTAMP(3) NOT NULL;
