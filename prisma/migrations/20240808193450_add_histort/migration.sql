-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_History" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "student_id" TEXT NOT NULL,
    "student_nickname" TEXT,
    "student_firstname" TEXT,
    "student_lastname" TEXT,
    "geton_at" DATETIME NOT NULL,
    "getoff_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_History" ("created_at", "getoff_at", "geton_at", "id", "student_firstname", "student_id", "student_lastname", "student_nickname", "updated_at") SELECT "created_at", "getoff_at", "geton_at", "id", "student_firstname", "student_id", "student_lastname", "student_nickname", "updated_at" FROM "History";
DROP TABLE "History";
ALTER TABLE "new_History" RENAME TO "History";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
