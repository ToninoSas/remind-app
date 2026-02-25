const bcrypt = require('bcryptjs');
const db = require('./db').default; // importa il tuo db.js

// Dati placeholder simili al TS
const users = [
  { firstName: 'Mario', lastName: 'Rossi', email: 'mario.rossi@example.com', password: 'password123', role: 'caregiver' },
  { firstName: 'Luca', lastName: 'Bianchi', email: 'luca.bianchi@example.com', password: '123456', role: 'paziente' },
];

const caregivers = [
  { type: 'Professionista', userEmail: 'mario.rossi@example.com' },
];

const patients = [
  { condition: 'Alzheimer', description: 'Paziente 1', caregiverType: 'Professionista', userEmail: 'luca.bianchi@example.com' },
];

const exercises = [
  { type: 'memoria', title: 'Esercizio 1', description: 'Descrizione esercizio', difficulty: 1, contentJson: '{}', caregiverType: 'Professionista' },
];

function seed() {
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO User (First_Name, Last_Name, Email, Password_Hash, Role)
    VALUES (?, ?, ?, ?, ?)
  `);
  const getUserByEmail = db.prepare(`SELECT * FROM User WHERE Email = ?`);

  const insertCaregiver = db.prepare(`
    INSERT OR IGNORE INTO Caregiver (Type, User_Id) VALUES (?, ?)
  `);

  const getCaregiverByTypeAndUser = db.prepare(`
    SELECT * FROM Caregiver WHERE Type = ? AND User_Id = ?
  `);

  const insertPatient = db.prepare(`
    INSERT OR IGNORE INTO Patient (Condition, Description, Caregiver_Id, User_Id)
    VALUES (?, ?, ?, ?)
  `);

  const insertExercise = db.prepare(`
    INSERT OR IGNORE INTO Exercise (Type, Title, Description, Difficulty_Level, Content_Json, Caregiver_Id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    // Users
    for (const u of users) {
      const hash = bcrypt.hashSync(u.password, 10);
      insertUser.run(u.firstName, u.lastName, u.email, hash, u.role);
    }

    // Caregiver
    for (const c of caregivers) {
      const user = getUserByEmail.get(c.userEmail);
      if (!user) throw new Error(`User not found for Caregiver: ${c.userEmail}`);
      insertCaregiver.run(c.type, user.Id);
    }

    // Patients
    for (const p of patients) {
      const user = getUserByEmail.get(p.userEmail);
      if (!user) throw new Error(`User not found for Patient: ${p.userEmail}`);

      const caregiver = db.prepare(`
        SELECT c.* FROM Caregiver c
        JOIN User u ON c.User_Id = u.Id
        WHERE c.Type = ? LIMIT 1
      `).get(p.caregiverType);

      if (!caregiver) throw new Error(`Caregiver not found for type: ${p.caregiverType}`);

      insertPatient.run(p.condition, p.description, caregiver.Id, user.Id);
    }

    // Exercises
    for (const e of exercises) {
      const caregiver = db.prepare(`
        SELECT c.* FROM Caregiver c
        WHERE c.Type = ? LIMIT 1
      `).get(e.caregiverType);

      if (!caregiver) throw new Error(`Caregiver not found for exercise: ${e.caregiverType}`);
      insertExercise.run(e.type, e.title, e.description, e.difficulty, e.contentJson, caregiver.Id);
    }
  });

  transaction();
  console.log('Database seeded successfully');
}

module.exports = seed;