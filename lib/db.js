const Database = require('better-sqlite3');
const db = new Database('database.db',);

try{
    db.exec(`
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS "User" (
	"Id"	INTEGER,
	"First_Name"	TEXT NOT NULL,
	"Last_Name"	TEXT,
	"Email"	TEXT NOT NULL UNIQUE,
	"Password_Hash"	TEXT NOT NULL,
	"Created_At"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"Role" TEXT CHECK("Role" IN ('caregiver', 'paziente')),
	PRIMARY KEY("Id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "Caregiver" (
	"Id"	INTEGER NOT NULL,
	"Type"	TEXT NOT NULL,
	"User_Id"	INTEGER NOT NULL,
	PRIMARY KEY("Id"),
	CONSTRAINT "check_type" CHECK("Type" IN ('Familiare', 'Professionista')),
	FOREIGN KEY("User_Id") REFERENCES "User"("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Patient" (
	"Id"	INTEGER,
	"Condition"	TEXT,
	"Description"	TEXT,
	"Caregiver_Id"	INTEGER NOT NULL,
	"User_Id"	INTEGER NOT NULL,
	"Deleted_At"	DATETIME DEFAULT NULL,
	PRIMARY KEY("Id" AUTOINCREMENT),
	FOREIGN KEY("Caregiver_Id") REFERENCES "Caregiver"("Id") ON DELETE CASCADE,
	FOREIGN KEY("User_Id") REFERENCES "User"("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Exercise" (
        "Id"    INTEGER,
        "Type"  TEXT NOT NULL CHECK("Type" IN ('memoria', 'calcolo', 'quiz')),
        "Title" TEXT NOT NULL,
        "Description"   TEXT,
        "Difficulty_Level"      INTEGER,
        "Content_Json"  TEXT,
        "Created_At"    DATETIME DEFAULT CURRENT_TIMESTAMP,
        "Caregiver_Id"  INTEGER NOT NULL,
		"Deleted_At" DATETIME DEFAULT NULL,
        PRIMARY KEY("Id" AUTOINCREMENT),
        FOREIGN KEY("Caregiver_Id") REFERENCES "Caregiver"("Id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "Memory_Box" (
        "Id"    INTEGER,
        "Title" TEXT NOT NULL,
        "Description"   TEXT,
        "Category"      TEXT,
        "Created_At"    DATETIME DEFAULT CURRENT_TIMESTAMP,
        "Patient_Id"    INTEGER NOT NULL,
        "Caregiver_Id" INTEGER NOT NULL,
        "Deleted_At"    DATETIME DEFAULT NULL,
        PRIMARY KEY("Id" AUTOINCREMENT),
        FOREIGN KEY("Patient_Id") REFERENCES "Patient"("Id"),
        FOREIGN KEY ("Caregiver_Id") REFERENCES "Caregiver"("Id")
);
CREATE TABLE IF NOT EXISTS "Memory_Item" (
        "Id"    INTEGER,
        "Type"  TEXT NOT NULL CHECK("Type" IN ('audio', 'foto', 'video')),
        "Url"   TEXT,
        "Title" TEXT NOT NULL,
        "Text"  TEXT,
        "Date"  DATETIME DEFAULT NULL,
        "Location"      TEXT,
        "Deleted_At"    DATETIME DEFAULT NULL,
        "Box_Id"        INTEGER NOT NULL,
        PRIMARY KEY("Id" AUTOINCREMENT),
        FOREIGN KEY("Box_Id") REFERENCES "Memory_Box"("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Assignment" (
        "Id"    INTEGER,
        "Patient_Id"    INTEGER NOT NULL,
        "Exercise_Id"   INTEGER NOT NULL,
        "Status"        TEXT DEFAULT 'da_svolgere' CHECK("Status" IN ('da_svolgere', 'completato')),
        "Assigned_At"   DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY("Id" AUTOINCREMENT),
        FOREIGN KEY("Exercise_Id") REFERENCES "Exercise"("Id") ON DELETE CASCADE,
        FOREIGN KEY("Patient_Id") REFERENCES "Patient"("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Attempt" (
        "Id"    INTEGER,
        "Patient_Id"    INTEGER NOT NULL,
        "Exercise_Id"   INTEGER NOT NULL,
        "Total_Answers" INTEGER DEFAULT 0,
        "Correct_Answers"       INTEGER DEFAULT 0,
        "Wrong_Answers" INTEGER DEFAULT 0,
        "Executed_At"   DATETIME DEFAULT CURRENT_TIMESTAMP,
        "Emotional_State"       INTEGER CHECK("Emotional_State" BETWEEN 1 AND 5),
        PRIMARY KEY("Id" AUTOINCREMENT),
        FOREIGN KEY("Exercise_Id") REFERENCES "Exercise"("Id") ON DELETE CASCADE,
        FOREIGN KEY("Patient_Id") REFERENCES "Patient"("Id") ON DELETE CASCADE
);

COMMIT;
`);
} catch (err){
    console.error(err.message)
}

export default db;