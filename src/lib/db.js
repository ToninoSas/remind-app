const Database = require('better-sqlite3');
const db = new Database('database.db', { verbose: console.log });

db.exec(`
PRAGMA foreign_keys = ON;

-- 1. UTENTI
CREATE TABLE IF NOT EXISTS Utenti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    data_creazione DATETIME DEFAULT CURRENT_TIMESTAMP,
    ruolo TEXT CHECK(ruolo IN ('caregiver', 'paziente')) NOT NULL
);

-- 2. PAZIENTI (Punta a Utenti)
CREATE TABLE IF NOT EXISTS Pazienti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patologia TEXT,
    descrizione TEXT,
    caregiver_id INTEGER NOT NULL,
    utente_id INTEGER,
    FOREIGN KEY (caregiver_id) REFERENCES Utenti(id) ON DELETE CASCADE,
    FOREIGN KEY (utente_id) REFERENCES Utenti(id) ON DELETE SET NULL
);

-- 3. ESERCIZI (Corretto riferimento a Utenti)
CREATE TABLE IF NOT EXISTS Esercizi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT CHECK(tipo IN ('memoria', 'calcolo','quiz')) NOT NULL,
    titolo TEXT NOT NULL,
    descrizione TEXT,
    livello_difficolta INTEGER,
    contenuto_json TEXT,
    data_creazione DATETIME DEFAULT CURRENT_TIMESTAMP,
    creatore_id INTEGER NOT NULL,
    FOREIGN KEY (creatore_id) REFERENCES Utenti(id)
);

-- 4. ASSEGNAZIONI (Corretti riferimenti a Pazienti ed Esercizi)
CREATE TABLE IF NOT EXISTS Assegnazioni (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paziente_id INTEGER NOT NULL,
    esercizio_id INTEGER NOT NULL,
    stato TEXT CHECK(stato IN ('assegnato', 'in_corso', 'completato')) DEFAULT 'assegnato',
    data_assegnazione DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paziente_id) REFERENCES Pazienti(id) ON DELETE CASCADE,
    FOREIGN KEY (esercizio_id) REFERENCES Esercizi(id) ON DELETE CASCADE
);

-- 5. SVOLGIMENTI (Corretti riferimenti a Pazienti ed Esercizi)
CREATE TABLE IF NOT EXISTS Svolgimenti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paziente_id INTEGER NOT NULL,
    esercizio_id INTEGER NOT NULL,
    risposte_totali INTEGER DEFAULT 0,
    risposte_corrette INTEGER DEFAULT 0,
    risposte_sbagliate INTEGER DEFAULT 0,
    data_esecuzione DATETIME DEFAULT CURRENT_TIMESTAMP,
    completato BOOLEAN DEFAULT 0,
    stato_emotivo INTEGER CHECK (stato_emotivo BETWEEN 1 AND 5),
    FOREIGN KEY (paziente_id) REFERENCES Pazienti(id) ON DELETE CASCADE,
    FOREIGN KEY (esercizio_id) REFERENCES Esercizi(id) ON DELETE CASCADE
);

-- 6. MEMORY BOX
CREATE TABLE IF NOT EXISTS Memory_boxs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titolo TEXT NOT NULL,
    descrizione TEXT,
    categoria TEXT,
    data_creazione DATETIME DEFAULT CURRENT_TIMESTAMP,
    paziente_id INTEGER NOT NULL,
    FOREIGN KEY (paziente_id) REFERENCES Pazienti(id) ON DELETE CASCADE
);

-- 7. MEMORY ITEM
CREATE TABLE IF NOT EXISTS Memory_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT CHECK(tipo IN ('audio', 'testo', 'video')) NOT NULL,
    url TEXT,
    titolo TEXT NOT NULL,
    descrizione TEXT,
    datazione TEXT,
    luogo TEXT,
    box_id INTEGER NOT NULL,
    FOREIGN KEY (box_id) REFERENCES Memory_boxs(id) ON DELETE CASCADE
);
`);

export default db;