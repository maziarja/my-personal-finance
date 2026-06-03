-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETE');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "status" "TransactionStatus";
