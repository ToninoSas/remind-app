// const bcrypt = require('bcryptjs');
// import db from "@/lib/db";


// function seed() {

//   const transaction = db.transaction(() => {

//     // =============================
//     // RESET DATABASE (DEV MODE)
//     // =============================
//     db.exec(`PRAGMA foreign_keys = OFF`);

//     db.exec(`
//       DELETE FROM Attempt;
//       DELETE FROM Assignment;
//       DELETE FROM Memory_Item;
//       DELETE FROM Memory_Box;
//       DELETE FROM Exercise;
//       DELETE FROM Patient;
//       DELETE FROM Caregiver;
//       DELETE FROM User;
//     `);

//     db.exec(`PRAGMA foreign_keys = ON`);

//     // =============================
//     // USERS
//     // =============================
//     const insertUser = db.prepare(`
//       INSERT INTO User (First_Name, Last_Name, Email, Password_Hash, Role)
//       VALUES (?, ?, ?, ?, ?)
//     `);

//     const users = [
//       ['Mario', 'Rossi', 'mario.rossi@example.com', 'password123', 'caregiver'],
//       ['Giulia', 'Verdi', 'giulia.verdi@example.com', 'password456', 'caregiver'],
//       ['Anna', 'Gialli', 'anna.gialli@example.com', 'password789', 'caregiver'],
//       ['Luca', 'Bianchi', 'luca.bianchi@example.com', 'password321', 'paziente'],
//       ['Paolo', 'Neri', 'paolo.neri@example.com', 'password654', 'paziente'],
//     ];

//     for (const u of users) {
//       const hash = bcrypt.hashSync(u[3], 10);
//       insertUser.run(u[0], u[1], u[2], hash, u[4]);
//     }

//     const getUser = db.prepare(`SELECT * FROM User WHERE Email = ?`);

//     // =============================
//     // CAREGIVERS (collegati ai loro user)
//     // =============================
//     const insertCaregiver = db.prepare(`
//       INSERT INTO Caregiver (Type, User_Id)
//       VALUES (?, ?)
//     `);

//     const caregiver1User = getUser.get('mario.rossi@example.com');
//     const caregiver2User = getUser.get('giulia.verdi@example.com');
//     const caregiver3User = getUser.get('anna.gialli@example.com');

//     insertCaregiver.run('Professionista', caregiver1User.Id);
//     insertCaregiver.run('Familiare', caregiver2User.Id);
//     insertCaregiver.run('Professionista', caregiver3User.Id);

//     const caregivers = db.prepare(`SELECT * FROM Caregiver`).all();

//     // =============================
//     // PATIENTS (ognuno associato ad un caregiver reale)
//     // =============================
//     const insertPatient = db.prepare(`
//       INSERT INTO Patient (Condition, Description, Caregiver_Id, User_Id)
//       VALUES (?, ?, ?, ?)
//     `);

//     const patientUser1 = getUser.get('luca.bianchi@example.com');
//     const patientUser2 = getUser.get('paolo.neri@example.com');

//     insertPatient.run('Alzheimer', 'Paziente 1', caregivers[0].Id, patientUser1.Id);
//     insertPatient.run('Demenza Vascolare', 'Paziente 2', caregivers[1].Id, patientUser2.Id);
//     insertPatient.run('MCI (Lieve)', 'Paziente 3', caregivers[2].Id, patientUser1.Id);
//     insertPatient.run('Altro', 'Paziente 4', caregivers[0].Id, patientUser2.Id);
//     insertPatient.run('Alzheimer', 'Paziente 5', caregivers[1].Id, patientUser1.Id);

//     const patients = db.prepare(`SELECT * FROM Patient`).all();

//     // =============================
//     // EXERCISES (creati da caregiver reali)
//     // =============================
//     const insertExercise = db.prepare(`
//       INSERT INTO Exercise (Type, Title, Description, Difficulty_Level, Content_Json, Caregiver_Id)
//       VALUES (?, ?, ?, ?, ?, ?)
//     `);

//     insertExercise.run('memoria', 'Memoria Base', 'Allenamento memoria', 1, '{}', caregivers[0].Id);
//     insertExercise.run('calcolo', 'Calcolo Facile', 'Addizioni semplici', 1, '{}', caregivers[1].Id);
//     insertExercise.run('quiz', 'Quiz Cultura', 'Domande generali', 2, '{}', caregivers[2].Id);
//     insertExercise.run('memoria', 'Memoria Avanzata', 'Sequenze complesse', 3, '{}', caregivers[0].Id);
//     insertExercise.run('calcolo', 'Calcolo Avanzato', 'Moltiplicazioni', 2, '{}', caregivers[1].Id);

//     const exercises = db.prepare(`SELECT * FROM Exercise`).all();

//     // =============================
//     // MEMORY BOX (usa caregiver del paziente)
//     // =============================
//     const insertBox = db.prepare(`
//       INSERT INTO Memory_Box (Title, Description, Category, Patient_Id, Caregiver_Id)
//       VALUES (?, ?, ?, ?, ?)
//     `);

//     for (let i = 0; i < patients.length; i++) {
//       insertBox.run(
//         `Ricordi ${i + 1}`,
//         `Box memoria paziente ${i + 1}`,
//         'foto',
//         patients[i].Id,
//         patients[i].Caregiver_Id //usa lo stesso caregiver del paziente
//       );
//     }

//     const boxes = db.prepare(`SELECT * FROM Memory_Box`).all();

//     // =============================
//     // MEMORY ITEMS
//     // =============================
//     const insertItem = db.prepare(`
//       INSERT INTO Memory_Item (Type, Url, Title, Text, Box_Id)
//       VALUES (?, ?, ?, ?, ?)
//     `);

//     insertItem.run('foto', '/uploads/1771595202414-festa-dei-50-anni.jpg', 'Foto festa', 'Compleanno', boxes[0].Id);
//     insertItem.run('audio', '/uploads/1771427528646-Iris_(Tra_Le_Tue_Poesie).mp3', 'Canzone Iris', 'Audio speciale', boxes[1].Id);
//     insertItem.run('video', null, 'Video ricordo', 'Ricordo video', boxes[2].Id);
//     insertItem.run('foto', '/uploads/1771595202414-festa-dei-50-anni.jpg', 'Foto vacanza', 'Estate', boxes[3].Id);
//     insertItem.run('audio', '/uploads/1771427528646-Iris_(Tra_Le_Tue_Poesie).mp3', 'Canzone preferita', 'Relax', boxes[4].Id);

//     // =============================
//     // ASSIGNMENT (coerente)
//     // =============================
//     const insertAssignment = db.prepare(`
//       INSERT INTO Assignment (Patient_Id, Exercise_Id, Status)
//       VALUES (?, ?, ?)
//     `);

//     for (let i = 0; i < 5; i++) {
//       insertAssignment.run(
//         patients[i].Id,
//         exercises[i].Id,
//         i % 2 === 0 ? 'da_svolgere' : 'completato'
//       );
//     }

//     // =============================
//     // ATTEMPTS (coerente con assignment)
//     // =============================
//     const insertAttempt = db.prepare(`
//       INSERT INTO Attempt (Patient_Id, Exercise_Id, Total_Answers, Correct_Answers, Wrong_Answers, Emotional_State)
//       VALUES (?, ?, ?, ?, ?, ?)
//     `);

//     for (let i = 0; i < 5; i++) {
//       insertAttempt.run(
//         patients[i].Id,
//         exercises[i].Id,
//         10,
//         8,
//         2,
//         4
//       );
//     }

//   });

//   try {
//     transaction();
//     console.log("Seed completato con integrità referenziale rispettata");
//   } catch (err) {
//     console.error("Errore durante il seed:", err.message);
//   }
// }

// export default seed;