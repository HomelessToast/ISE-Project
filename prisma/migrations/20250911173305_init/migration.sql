-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "samples" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "matrix" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "samples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assays" (
    "id" TEXT NOT NULL,
    "dilution" TEXT NOT NULL,
    "dilutionCoeff" DOUBLE PRECISION NOT NULL,
    "touAt" TEXT NOT NULL,
    "endAtHours" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sampleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "assays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "results" (
    "id" TEXT NOT NULL,
    "cfuVial" INTEGER NOT NULL,
    "cfuPerG" DOUBLE PRECISION NOT NULL,
    "logReported" DOUBLE PRECISION,
    "logIse" DOUBLE PRECISION NOT NULL,
    "logDiff" DOUBLE PRECISION,
    "qcNote" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assayId" TEXT NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "samples_code_key" ON "samples"("code");

-- CreateIndex
CREATE UNIQUE INDEX "results_assayId_key" ON "results"("assayId");

-- AddForeignKey
ALTER TABLE "samples" ADD CONSTRAINT "samples_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assays" ADD CONSTRAINT "assays_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "samples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assays" ADD CONSTRAINT "assays_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_assayId_fkey" FOREIGN KEY ("assayId") REFERENCES "assays"("id") ON DELETE CASCADE ON UPDATE CASCADE;
