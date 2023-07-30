/*
  Warnings:

  - You are about to drop the column `scenarioId` on the `MechanismOfInjury` table. All the data in the column will be lost.
  - You are about to drop the column `scenarioId` on the `Symptom` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MechanismOfInjury" DROP CONSTRAINT "MechanismOfInjury_scenarioId_fkey";

-- DropForeignKey
ALTER TABLE "Symptom" DROP CONSTRAINT "Symptom_scenarioId_fkey";

-- AlterTable
ALTER TABLE "MechanismOfInjury" DROP COLUMN "scenarioId";

-- AlterTable
ALTER TABLE "Symptom" DROP COLUMN "scenarioId";

-- CreateTable
CREATE TABLE "_MechanismOfInjuryToScenario" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ScenarioToSymptom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MechanismOfInjuryToScenario_AB_unique" ON "_MechanismOfInjuryToScenario"("A", "B");

-- CreateIndex
CREATE INDEX "_MechanismOfInjuryToScenario_B_index" ON "_MechanismOfInjuryToScenario"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ScenarioToSymptom_AB_unique" ON "_ScenarioToSymptom"("A", "B");

-- CreateIndex
CREATE INDEX "_ScenarioToSymptom_B_index" ON "_ScenarioToSymptom"("B");

-- AddForeignKey
ALTER TABLE "_MechanismOfInjuryToScenario" ADD CONSTRAINT "_MechanismOfInjuryToScenario_A_fkey" FOREIGN KEY ("A") REFERENCES "MechanismOfInjury"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MechanismOfInjuryToScenario" ADD CONSTRAINT "_MechanismOfInjuryToScenario_B_fkey" FOREIGN KEY ("B") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScenarioToSymptom" ADD CONSTRAINT "_ScenarioToSymptom_A_fkey" FOREIGN KEY ("A") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScenarioToSymptom" ADD CONSTRAINT "_ScenarioToSymptom_B_fkey" FOREIGN KEY ("B") REFERENCES "Symptom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
