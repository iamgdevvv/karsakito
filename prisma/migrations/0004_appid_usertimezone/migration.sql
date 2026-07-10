-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "karsa_apps";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "karsa_app" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "token" INTEGER NOT NULL,
    "tokenPromo" INTEGER,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "karsa_app_name_key" ON "karsa_app"("name");

-- CreateIndex
CREATE INDEX "karsa_app_category_idx" ON "karsa_app"("category");
