BEGIN TRANSACTION;

DROP TABLE IF EXISTS "Utenti";
CREATE TABLE "Utenti" (
	"ID"	INTEGER,
	"Nome"	TEXT NOT NULL,
	"Cognome"	TEXT,
	"Email"	TEXT NOT NULL UNIQUE,
	"Password_hash"	TEXT NOT NULL,
	"Data_Creazione"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"Ruolo" TEXT CHECK("Ruolo" IN ('caregiver', 'paziente')),
	PRIMARY KEY("ID" AUTOINCREMENT)
);

DROP TABLE IF EXISTS "Caregivers";
CREATE TABLE "Caregivers" (
	"ID"	INTEGER NOT NULL,
	"Tipologia"	TEXT NOT NULL,
	"Utente_id"	INTEGER NOT NULL,
	PRIMARY KEY("ID"),
	CONSTRAINT "check_Tipologia" CHECK("Tipologia" IN ("Familiare", "Professionista")),
	FOREIGN KEY("Utente_id") REFERENCES "Utenti"("ID") ON DELETE CASCADE
);

DROP TABLE IF EXISTS "Pazienti";
CREATE TABLE "Pazienti" (
	"ID"	INTEGER,
	-- DA NOTIFICARE
	"Patologia"	TEXT,
	"Descrizione"	TEXT,
	"Caregiver_id"	INTEGER NOT NULL,
	"Utente_id"	INTEGER NOT NULL,
	"Data_Eliminazione"	DATETIME DEFAULT NULL,
	PRIMARY KEY("ID" AUTOINCREMENT),
	FOREIGN KEY("Caregiver_id") REFERENCES "Caregivers"("ID") ON DELETE CASCADE,
	FOREIGN KEY("Utente_id") REFERENCES "Utenti"("ID") ON DELETE CASCADE
);

DROP TABLE IF EXISTS "Esercizi";
CREATE TABLE "Esercizi" (
	"ID"	INTEGER,
	"Tipo"	TEXT NOT NULL CHECK("tipo" IN ('memoria', 'calcolo', 'quiz')),
	"Titolo"	TEXT NOT NULL,
	"Descrizione"	TEXT,
	"Livello_Difficolta"	INTEGER,
	"Contenuto_Json"	TEXT,
	"Data_Creazione"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"Caregiver_id"	INTEGER NOT NULL,
	PRIMARY KEY("ID" AUTOINCREMENT),
	FOREIGN KEY("Caregiver_id") REFERENCES "Caregivers"("ID") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "Memory_boxs";
CREATE TABLE "Memory_boxs" (
	"ID"	INTEGER,
	"Titolo"	TEXT NOT NULL,
	"Descrizione"	TEXT,
	"Categoria"	TEXT,
	"Data_Creazione"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"Paziente_id"	INTEGER NOT NULL,
	"Caregiver_id" INTEGER NOT NULL,
	PRIMARY KEY("ID" AUTOINCREMENT),
	FOREIGN KEY("Paziente_id") REFERENCES "Pazienti"("id"),
	FOREIGN KEY ("Caregiver_id") REFERENCES "Caregivers"("ID") 
);
DROP TABLE IF EXISTS "Memory_items";
CREATE TABLE "Memory_items" (
	"ID"	INTEGER,
	"Tipo"	TEXT NOT NULL CHECK("Tipo" IN ('audio', 'foto', 'video')),
	"Url"	TEXT,
	"Titolo"	TEXT NOT NULL,
	"Testo"	TEXT,
	"Datazione"	DATETIME DEFAULT NULL,
	"Luogo"	TEXT,
	"Box_id"	INTEGER NOT NULL,
	PRIMARY KEY("ID" AUTOINCREMENT),
	FOREIGN KEY("Box_id") REFERENCES "Memory_boxs"("ID") ON DELETE CASCADE
);



DROP TABLE IF EXISTS "Assegnazioni";
CREATE TABLE "Assegnazioni" (
	"ID"	INTEGER,
	"Paziente_id"	INTEGER NOT NULL,
	"Esercizio_id"	INTEGER NOT NULL,
	-- DA NOTIFICARE
	"Stato"	TEXT DEFAULT 'da_svolgere' CHECK("stato" IN ('da_svolgere', 'completato')), 

	"Data_Assegnazione"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("ID" AUTOINCREMENT),
	FOREIGN KEY("Esercizio_id") REFERENCES "Esercizi"("ID") ON DELETE CASCADE,
	FOREIGN KEY("Paziente_id") REFERENCES "Pazienti"("ID") ON DELETE CASCADE
);

DROP TABLE IF EXISTS "Svolgimenti";
CREATE TABLE "Svolgimenti" (
	"ID"	INTEGER,
	"Paziente_id"	INTEGER NOT NULL,
	"Esercizio_id"	INTEGER NOT NULL,
	"Risposte_totali"	INTEGER DEFAULT 0,
	"Risposte_corrette"	INTEGER DEFAULT 0,
	"Risposte_sbagliate"	INTEGER DEFAULT 0,
	"Data_Esecuzione"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	-- RIFLETTERE SU QUESTO CAMPO
	"Completato"	BOOLEAN DEFAULT 0,
	-- FAR AGGIUNGERE LO STATO EMOTIVO
	"Stato_Emotivo"	INTEGER CHECK("Stato_Emotivo" BETWEEN 1 AND 5),
	PRIMARY KEY("ID" AUTOINCREMENT),
	FOREIGN KEY("Esercizio_id") REFERENCES "Esercizi"("ID") ON DELETE CASCADE,
	FOREIGN KEY("Paziente_id") REFERENCES "Pazienti"("ID") ON DELETE CASCADE
);

COMMIT;
