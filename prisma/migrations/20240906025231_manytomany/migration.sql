/*
  Warnings:

  - You are about to drop the column `folderId` on the `file` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_folderId_fkey";

-- AlterTable
ALTER TABLE "file" DROP COLUMN "folderId";

-- CreateTable
CREATE TABLE "file_on_folder" (
    "id" SERIAL NOT NULL,
    "fileId" INTEGER NOT NULL,
    "folderId" INTEGER NOT NULL,

    CONSTRAINT "file_on_folder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "file_on_folder" ADD CONSTRAINT "file_on_folder_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_on_folder" ADD CONSTRAINT "file_on_folder_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
