/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,name,type]` on the table `FinancialAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FinancialAccount_ownerId_name_type_key" ON "FinancialAccount"("ownerId", "name", "type");
