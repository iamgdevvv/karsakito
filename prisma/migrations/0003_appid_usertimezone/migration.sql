-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_karsa_apps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "token" INTEGER NOT NULL,
    "tokenPromo" INTEGER,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT NOT NULL
);
INSERT INTO "new_karsa_apps" ("category", "label", "name", "token", "tokenPromo", "visible") SELECT "category", "label", "name", "token", "tokenPromo", "visible" FROM "karsa_apps";
DROP TABLE "karsa_apps";
ALTER TABLE "new_karsa_apps" RENAME TO "karsa_apps";
CREATE UNIQUE INDEX "karsa_apps_name_key" ON "karsa_apps"("name");
CREATE INDEX "karsa_apps_category_idx" ON "karsa_apps"("category");
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Jakarta',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_user" ("createdAt", "email", "id", "isActive", "name", "role", "updatedAt") SELECT "createdAt", "email", "id", "isActive", "name", "role", "updatedAt" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
