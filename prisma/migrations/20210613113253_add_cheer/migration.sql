-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "cheer" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_User" ("hash", "id", "name") SELECT "hash", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User.hash_unique" ON "User"("hash");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
