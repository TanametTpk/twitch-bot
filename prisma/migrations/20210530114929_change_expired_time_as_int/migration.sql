/*
  Warnings:

  - You are about to alter the column `expired_time` on the `Equipment` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Equipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "characterId" INTEGER NOT NULL,
    "expired_time" INTEGER NOT NULL,
    "last_time_check" DATETIME NOT NULL,
    "atk" INTEGER NOT NULL,
    FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Equipment" ("atk", "characterId", "expired_time", "id", "last_time_check") SELECT "atk", "characterId", "expired_time", "id", "last_time_check" FROM "Equipment";
DROP TABLE "Equipment";
ALTER TABLE "new_Equipment" RENAME TO "Equipment";
CREATE UNIQUE INDEX "Equipment_characterId_unique" ON "Equipment"("characterId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
