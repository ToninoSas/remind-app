BEGIN TRANSACTION;
DROP TABLE IF EXISTS "Assegnazioni";
CREATE TABLE "Assegnazioni" (
	"id"	INTEGER,
	"paziente_id"	INTEGER NOT NULL,
	"esercizio_id"	INTEGER NOT NULL,
	"stato"	TEXT DEFAULT 'assegnato' CHECK("stato" IN ('assegnato', 'in_corso', 'completato')),
	"data_assegnazione"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("esercizio_id") REFERENCES "Esercizi"("id") ON DELETE CASCADE,
	FOREIGN KEY("paziente_id") REFERENCES "Pazienti"("id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "Esercizi";
CREATE TABLE "Esercizi" (
	"id"	INTEGER,
	"tipo"	TEXT NOT NULL CHECK("tipo" IN ('memoria', 'calcolo', 'quiz')),
	"titolo"	TEXT NOT NULL,
	"descrizione"	TEXT,
	"livello_difficolta"	INTEGER,
	"contenuto_json"	TEXT,
	"data_creazione"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"creatore_id"	INTEGER NOT NULL,
	"attivo"	INTEGER DEFAULT 1,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("creatore_id") REFERENCES "Utenti"("id")
);
DROP TABLE IF EXISTS "Memory_boxs";
CREATE TABLE "Memory_boxs" (
	"id"	INTEGER,
	"titolo"	TEXT NOT NULL,
	"descrizione"	TEXT,
	"categoria"	TEXT,
	"data_creazione"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"paziente_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("paziente_id") REFERENCES "Pazienti"("id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "Memory_items";
CREATE TABLE "Memory_items" (
	"id"	INTEGER,
	"tipo"	TEXT NOT NULL CHECK("tipo" IN ('audio', 'testo', 'video')),
	"url"	TEXT,
	"titolo"	TEXT NOT NULL,
	"descrizione"	TEXT,
	"datazione"	TEXT,
	"luogo"	TEXT,
	"box_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("box_id") REFERENCES "Memory_boxs"("id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "Pazienti";
CREATE TABLE "Pazienti" (
	"id"	INTEGER,
	"patologia"	TEXT,
	"descrizione"	TEXT,
	"caregiver_id"	INTEGER NOT NULL,
	"utente_id"	INTEGER,
	"attivo"	INTEGER DEFAULT 1,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("caregiver_id") REFERENCES "Utenti"("id") ON DELETE CASCADE,
	FOREIGN KEY("utente_id") REFERENCES "Utenti"("id") ON DELETE SET NULL
);
DROP TABLE IF EXISTS "Svolgimenti";
CREATE TABLE "Svolgimenti" (
	"id"	INTEGER,
	"paziente_id"	INTEGER NOT NULL,
	"esercizio_id"	INTEGER NOT NULL,
	"risposte_totali"	INTEGER DEFAULT 0,
	"risposte_corrette"	INTEGER DEFAULT 0,
	"risposte_sbagliate"	INTEGER DEFAULT 0,
	"data_esecuzione"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"completato"	BOOLEAN DEFAULT 0,
	"stato_emotivo"	INTEGER CHECK("stato_emotivo" BETWEEN 1 AND 5),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("esercizio_id") REFERENCES "Esercizi"("id") ON DELETE CASCADE,
	FOREIGN KEY("paziente_id") REFERENCES "Pazienti"("id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "Utenti";
CREATE TABLE "Utenti" (
	"id"	INTEGER,
	"nome"	TEXT NOT NULL,
	"email"	TEXT NOT NULL UNIQUE,
	"password_hash"	TEXT NOT NULL,
	"data_creazione"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"ruolo"	TEXT NOT NULL CHECK("ruolo" IN ('caregiver', 'paziente')),
	PRIMARY KEY("id" AUTOINCREMENT)
);
COMMIT;
