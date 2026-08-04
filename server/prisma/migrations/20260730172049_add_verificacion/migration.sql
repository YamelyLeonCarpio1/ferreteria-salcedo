-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "codigoVerif" TEXT,
ADD COLUMN     "codigoVerifExp" TIMESTAMP(3),
ADD COLUMN     "verificado" BOOLEAN NOT NULL DEFAULT false;
