-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_balance_activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "token" INTEGER NOT NULL,
    "tokenBefore" INTEGER NOT NULL DEFAULT 0,
    "tokenAfter" INTEGER NOT NULL DEFAULT 0,
    "tokenDailyBefore" INTEGER NOT NULL DEFAULT 0,
    "tokenDailyAfter" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "balanceId" TEXT NOT NULL,
    "senderId" TEXT,
    CONSTRAINT "balance_activity_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "balance" ("userId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "balance_activity_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_balance_activity" ("balanceId", "createdAt", "description", "id", "senderId", "token", "tokenAfter", "tokenBefore", "type") SELECT "balanceId", "createdAt", "description", "id", "senderId", "token", "tokenAfter", "tokenBefore", "type" FROM "balance_activity";
DROP TABLE "balance_activity";
ALTER TABLE "new_balance_activity" RENAME TO "balance_activity";
CREATE INDEX "balance_activity_balanceId_createdAt_idx" ON "balance_activity"("balanceId", "createdAt");
CREATE INDEX "balance_activity_senderId_idx" ON "balance_activity"("senderId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
