-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "student_id" TEXT NOT NULL,
    "student_nickname" TEXT DEFAULT 'Unknow',
    "student_firstname" TEXT DEFAULT 'Unknow',
    "student_lastname" TEXT DEFAULT 'Unknow',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "History" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "student_id" TEXT NOT NULL,
    "student_nickname" TEXT DEFAULT 'Unknow',
    "student_firstname" TEXT DEFAULT 'Unknow',
    "student_lastname" TEXT DEFAULT 'Unknow',
    "geton_at" DATETIME NOT NULL,
    "getoff_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
