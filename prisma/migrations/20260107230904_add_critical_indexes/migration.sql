-- Add indexes for Ability model
CREATE INDEX IF NOT EXISTS "Ability_classId_idx" ON "Ability"("classId");
CREATE INDEX IF NOT EXISTS "Ability_name_idx" ON "Ability"("name");

-- Add indexes for Passive model
CREATE INDEX IF NOT EXISTS "Passive_classId_idx" ON "Passive"("classId");
CREATE INDEX IF NOT EXISTS "Passive_name_idx" ON "Passive"("name");

-- Add index for Stigma model
CREATE INDEX IF NOT EXISTS "Stigma_name_idx" ON "Stigma"("name");

-- Add indexes for Build model
CREATE INDEX IF NOT EXISTS "Build_classId_idx" ON "Build"("classId");
CREATE INDEX IF NOT EXISTS "Build_userId_idx" ON "Build"("userId");
CREATE INDEX IF NOT EXISTS "Build_private_idx" ON "Build"("private");

-- Add indexes and unique constraints for BuildAbility
CREATE INDEX IF NOT EXISTS "BuildAbility_buildId_idx" ON "BuildAbility"("buildId");
CREATE INDEX IF NOT EXISTS "BuildAbility_abilityId_idx" ON "BuildAbility"("abilityId");
CREATE UNIQUE INDEX IF NOT EXISTS "BuildAbility_buildId_abilityId_key" ON "BuildAbility"("buildId", "abilityId");

-- Add indexes and unique constraints for BuildPassive
CREATE INDEX IF NOT EXISTS "BuildPassive_buildId_idx" ON "BuildPassive"("buildId");
CREATE INDEX IF NOT EXISTS "BuildPassive_passiveId_idx" ON "BuildPassive"("passiveId");
CREATE UNIQUE INDEX IF NOT EXISTS "BuildPassive_buildId_passiveId_key" ON "BuildPassive"("buildId", "passiveId");

-- Add indexes and unique constraints for BuildStigma
CREATE INDEX IF NOT EXISTS "BuildStigma_buildId_idx" ON "BuildStigma"("buildId");
CREATE INDEX IF NOT EXISTS "BuildStigma_stigmaId_idx" ON "BuildStigma"("stigmaId");
CREATE UNIQUE INDEX IF NOT EXISTS "BuildStigma_buildId_stigmaId_key" ON "BuildStigma"("buildId", "stigmaId");

-- Add indexes for SpecialtyChoice
CREATE INDEX IF NOT EXISTS "SpecialtyChoice_abilityId_idx" ON "SpecialtyChoice"("abilityId");
CREATE INDEX IF NOT EXISTS "SpecialtyChoice_stigmaId_idx" ON "SpecialtyChoice"("stigmaId");
CREATE INDEX IF NOT EXISTS "SpecialtyChoice_unlockLevel_idx" ON "SpecialtyChoice"("unlockLevel");
