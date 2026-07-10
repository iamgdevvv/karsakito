-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "karsa_apps_category";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "workspace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "workspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workspace_window" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "props" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "karsaId" TEXT NOT NULL,
    CONSTRAINT "workspace_window_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workspace_window_karsaId_fkey" FOREIGN KEY ("karsaId") REFERENCES "karsa" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_karsa_apps" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "token" INTEGER NOT NULL,
    "tokenPromo" INTEGER,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT NOT NULL
);
INSERT INTO "new_karsa_apps" ("name", "token", "tokenPromo", "visible") SELECT "name", "token", "tokenPromo", "visible" FROM "karsa_apps";
DROP TABLE "karsa_apps";
ALTER TABLE "new_karsa_apps" RENAME TO "karsa_apps";
CREATE INDEX "karsa_apps_category_idx" ON "karsa_apps"("category");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "workspace_userId_createdAt_idx" ON "workspace"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_window_karsaId_key" ON "workspace_window"("karsaId");
