const bcrypt = require('bcryptjs');
const db = require('./db').default;

// Users
const users = [
  { firstName: 'Mario', lastName: 'Rossi', email: 'mario.rossi@example.com', password: 'password123', role: 'caregiver' },
  { firstName: 'Luca', lastName: 'Bianchi', email: 'luca.bianchi@example.com', password: 'password456', role: 'paziente' },
  { firstName: 'Giulia', lastName: 'Verdi', email: 'giulia.verdi@example.com', password: 'password789', role: 'caregiver' },
  { firstName: 'Paolo', lastName: 'Neri', email: 'paolo.neri@example.com', password: 'password321', role: 'paziente' },
  { firstName: 'Anna', lastName: 'Gialli', email: 'anna.gialli@example.com', password: 'password654', role: 'caregiver' },
];

// Caregivers
const caregivers = [
  { type: 'Professionista', userEmail: 'mario.rossi@example.com' },
  { type: 'Familiare', userEmail: 'giulia.verdi@example.com' },
  { type: 'Professionista', userEmail: 'anna.gialli@example.com' },
];

// Patients (solo condizioni valide)
const patients = [
  { condition: 'Alzheimer', description: 'Paziente 1', caregiverType: 'Professionista', userEmail: 'luca.bianchi@example.com' },
  { condition: 'Demenza Vascolare', description: 'Paziente 2', caregiverType: 'Familiare', userEmail: 'paolo.neri@example.com' },
  { condition: 'MCI (Lieve)', description: 'Paziente 3', caregiverType: 'Professionista', userEmail: 'luca.bianchi@example.com' },
  { condition: 'Altro', description: 'Paziente 4', caregiverType: 'Familiare', userEmail: 'paolo.neri@example.com' },
  { condition: 'Alzheimer', description: 'Paziente 5', caregiverType: 'Professionista', userEmail: 'luca.bianchi@example.com' },
];

// Exercises
const exercises = [
  { type: 'memoria', title: 'Esercizio 1', description: 'Memoria base', difficulty: 1, contentJson: '{}', caregiverType: 'Professionista' },
  { type: 'calcolo', title: 'Esercizio 2', description: 'Calcolo avanzato', difficulty: 2, contentJson: '{}', caregiverType: 'Familiare' },
  { type: 'quiz', title: 'Esercizio 3', description: 'Quiz culturale', difficulty: 3, contentJson: '{}', caregiverType: 'Professionista' },
  { type: 'memoria', title: 'Esercizio 4', description: 'Memoria avanzata', difficulty: 2, contentJson: '{}', caregiverType: 'Professionista' },
  { type: 'calcolo', title: 'Esercizio 5', description: 'Calcolo semplice', difficulty: 1, contentJson: '{}', caregiverType: 'Familiare' },
];

// Memory Boxes
const memoryBoxes = [
  { title: 'Box 1', description: 'Memorie paziente 1', category: 'foto', patientIndex: 0, caregiverType: 'Professionista' },
  { title: 'Box 2', description: 'Memorie paziente 2', category: 'audio', patientIndex: 1, caregiverType: 'Familiare' },
  { title: 'Box 3', description: 'Memorie paziente 3', category: 'video', patientIndex: 2, caregiverType: 'Professionista' },
  { title: 'Box 4', description: 'Memorie paziente 4', category: 'foto', patientIndex: 3, caregiverType: 'Familiare' },
  { title: 'Box 5', description: 'Memorie paziente 5', category: 'audio', patientIndex: 4, caregiverType: 'Professionista' },
];

// Memory Items
const memoryItems = [
  { type: 'foto', url: '1771595202414-festa-dei-50-anni.jpg', title: 'Foto festa', text: 'Compleanno', boxIndex: 0 },
  { type: 'audio', url: '1771427528646-Iris_(Tra_Le_Tue_Poesie).mp3', title: 'Canzone Iris', text: 'Audio speciale', boxIndex: 1 },
  { type: 'video', url: null, title: 'Video divertente', text: 'Video paziente', boxIndex: 2 },
  { type: 'foto', url: '1771595202414-festa-dei-50-anni.jpg', title: 'Foto vacanza', text: 'Estate', boxIndex: 3 },
  { type: 'audio', url: '1771427528646-Iris_(Tra_Le_Tue_Poesie).mp3', title: 'Canzone preferita', text: 'Relax', boxIndex: 4 },
];

// Assignments
const assignments = [
  { patientIndex: 0, exerciseIndex: 0, status: 'da_svolgere' },
  { patientIndex: 1, exerciseIndex: 1, status: 'completato' },
  { patientIndex: 2, exerciseIndex: 2, status: 'da_svolgere' },
  { patientIndex: 3, exerciseIndex: 3, status: 'completato' },
  { patientIndex: 4, exerciseIndex: 4, status: 'da_svolgere' },
];

// Attempts
const attempts = [
  { patientIndex: 0, exerciseIndex: 0, total: 10, correct: 8, wrong: 2, emotionalState: 4 },
  { patientIndex: 1, exerciseIndex: 1, total: 5, correct: 5, wrong: 0, emotionalState: 5 },
  { patientIndex: 2, exerciseIndex: 2, total: 8, correct: 6, wrong: 2, emotionalState: 3 },
  { patientIndex: 3, exerciseIndex: 3, total: 12, correct: 10, wrong: 2, emotionalState: 4 },
  { patientIndex: 4, exerciseIndex: 4, total: 7, correct: 4, wrong: 3, emotionalState: 2 },
];

function seed() {
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO User (First_Name, Last_Name, Email, Password_Hash, Role)
    VALUES (?, ?, ?, ?, ?)
  `);
  const getUserByEmail = db.prepare(`SELECT * FROM User WHERE Email = ?`);

  const insertCaregiver = db.prepare(`INSERT OR IGNORE INTO Caregiver (Type, User_Id) VALUES (?, ?)`);
  const insertPatient = db.prepare(`INSERT OR IGNORE INTO Patient (Condition, Description, Caregiver_Id, User_Id) VALUES (?, ?, ?, ?)`);
  const insertExercise = db.prepare(`INSERT OR IGNORE INTO Exercise (Type, Title, Description, Difficulty_Level, Content_Json, Caregiver_Id) VALUES (?, ?, ?, ?, ?, ?)`);
  const insertMemoryBox = db.prepare(`INSERT OR IGNORE INTO Memory_Box (Title, Description, Category, Patient_Id, Caregiver_Id) VALUES (?, ?, ?, ?, ?)`);
  const insertMemoryItem = db.prepare(`INSERT OR IGNORE INTO Memory_Item (Type, Url, Title, Text, Box_Id) VALUES (?, ?, ?, ?, ?)`);
  const insertAssignment = db.prepare(`INSERT OR IGNORE INTO Assignment (Patient_Id, Exercise_Id, Status) VALUES (?, ?, ?)`);
  const insertAttempt = db.prepare(`INSERT OR IGNORE INTO Attempt (Patient_Id, Exercise_Id, Total_Answers, Correct_Answers, Wrong_Answers, Emotional_State) VALUES (?, ?, ?, ?, ?, ?)`);

  const transaction = db.transaction(() => {
    // Users
    for (const u of users) {
      const hash = bcrypt.hashSync(u.password, 10);
      insertUser.run(u.firstName, u.lastName, u.email, hash, u.role);
    }

    // Caregivers
    for (const c of caregivers) {
      const user = getUserByEmail.get(c.userEmail);
      insertCaregiver.run(c.type, user.Id);
    }

    // Patients
    const patientRows = [];
    for (const p of patients) {
      const user = getUserByEmail.get(p.userEmail);
      const caregiver = db.prepare(`SELECT * FROM Caregiver WHERE Type = ? LIMIT 1`).get(p.caregiverType);
      insertPatient.run(p.condition, p.description, caregiver.Id, user.Id);
      patientRows.push(db.prepare(`SELECT * FROM Patient WHERE User_Id = ? ORDER BY Id DESC LIMIT 1`).get(user.Id));
    }

    // Exercises
    const exerciseRows = [];
    for (const e of exercises) {
      const caregiver = db.prepare(`SELECT * FROM Caregiver WHERE Type = ? LIMIT 1`).get(e.caregiverType);
      insertExercise.run(e.type, e.title, e.description, e.difficulty, e.contentJson, caregiver.Id);
      exerciseRows.push(db.prepare(`SELECT * FROM Exercise WHERE Title = ?`).get(e.title));
    }

    // Memory Boxes
    const boxRows = [];
    for (const b of memoryBoxes) {
      const patient = patientRows[b.patientIndex];
      const caregiver = db.prepare(`SELECT * FROM Caregiver WHERE Type = ? LIMIT 1`).get(b.caregiverType);
      insertMemoryBox.run(b.title, b.description, b.category, patient.Id, caregiver.Id);
      boxRows.push(db.prepare(`SELECT * FROM Memory_Box WHERE Title = ?`).get(b.title));
    }

    // Memory Items
    for (const mi of memoryItems) {
      const box = boxRows[mi.boxIndex];
      insertMemoryItem.run(mi.type, mi.url, mi.title, mi.text, box.Id);
    }

    // Assignments
    for (const a of assignments) {
      const patient = patientRows[a.patientIndex];
      const exercise = exerciseRows[a.exerciseIndex];
      insertAssignment.run(patient.Id, exercise.Id, a.status);
    }

    // Attempts
    for (const at of attempts) {
      const patient = patientRows[at.patientIndex];
      const exercise = exerciseRows[at.exerciseIndex];
      insertAttempt.run(patient.Id, exercise.Id, at.total, at.correct, at.wrong, at.emotionalState);
    }
  });

  transaction();
  console.log('Database seeded successfully');
}

module.exports = seed;