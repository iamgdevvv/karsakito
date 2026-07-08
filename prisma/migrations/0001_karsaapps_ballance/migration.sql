-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "auth" (
    "hash" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "karsa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "app" TEXT NOT NULL,
    "promptJson" JSONB,
    "result" TEXT NOT NULL,
    "reaction" BOOLEAN,
    "feedback" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "balanceActivityId" TEXT NOT NULL,
    CONSTRAINT "karsa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "karsa_balanceActivityId_fkey" FOREIGN KEY ("balanceActivityId") REFERENCES "balance_activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "karsa_apps" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "token" INTEGER NOT NULL,
    "tokenPromo" INTEGER,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "karsa_apps_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "karsa_apps_category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "karsa_apps_category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "balance" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "token" INTEGER NOT NULL DEFAULT 0,
    "tokenDaily" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "balance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "balance_activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "token" INTEGER NOT NULL,
    "tokenBefore" INTEGER NOT NULL,
    "tokenAfter" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "balanceId" TEXT NOT NULL,
    "senderId" TEXT,
    CONSTRAINT "balance_activity_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "balance" ("userId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "balance_activity_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "karsa_balanceActivityId_key" ON "karsa"("balanceActivityId");

-- CreateIndex
CREATE INDEX "karsa_userId_createdAt_idx" ON "karsa"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "karsa_apps_categoryId_idx" ON "karsa_apps"("categoryId");

-- CreateIndex
CREATE INDEX "balance_activity_balanceId_createdAt_idx" ON "balance_activity"("balanceId", "createdAt");

-- CreateIndex
CREATE INDEX "balance_activity_senderId_idx" ON "balance_activity"("senderId");
