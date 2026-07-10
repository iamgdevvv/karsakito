-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_karsa_app" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "token" INTEGER NOT NULL,
    "tokenPromo" INTEGER,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_karsa_app" ("category", "id", "label", "name", "token", "tokenPromo", "visible") SELECT "category", "id", "label", "name", "token", "tokenPromo", "visible" FROM "karsa_app";
DROP TABLE "karsa_app";
ALTER TABLE "new_karsa_app" RENAME TO "karsa_app";
CREATE UNIQUE INDEX "karsa_app_name_key" ON "karsa_app"("name");
CREATE INDEX "karsa_app_category_idx" ON "karsa_app"("category");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
