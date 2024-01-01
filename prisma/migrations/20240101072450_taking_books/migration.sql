/*
  Warnings:

  - Added the required column `returnedAt` to the `TakenBooks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "copies" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "TakenBooks" ADD COLUMN     "returnedAt" TIMESTAMP(3),
ADD COLUMN     "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
