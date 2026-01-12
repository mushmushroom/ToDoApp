/*
  Warnings:

  - You are about to drop the column `demoId` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `demoId` on the `Tasks` table. All the data in the column will be lost.
  - Made the column `userId` on table `Categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "demoId",
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tasks" DROP COLUMN "demoId",
ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Tasks_categoriesId_idx" ON "Tasks"("categoriesId");

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
