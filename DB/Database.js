import SQLite from 'react-native-sqlite-storage';

// db create
const db = SQLite.openDatabase(
  {
    name: 'studentAapp.db',
    location: 'default',
  },
  () => {
    console.log('database connected');
  },
  error => {
    console.log('database error' + error);
  },
);

// table creation

export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT NOT NULL, 
      age INTEGER,
      image STRING
      );`,
      [],
      () => {
        console.log('table created successfully');
      },
      error => {
        console.log('table creation error: ' + error.message);
      },
    );
  });
};

// CRUD
export const insertStudent = (name, age, success, error) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO students (name, age) VALUES (?, ?);`,
      [name, age],
      (_, result) => {
        console.log('Student inserted successfully');
        success(result);
      },
      (_, err) => {
        console.log('Insert student error: ' + err.message);
        error(err);
      },
    );
  });
};

export const getAllStudents = (success, error) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM students;`,
      [],
      (_, result) => {
        const students = [];
        for (let i = 0; i < result.rows.length; i++) {
          students.push(result.rows.item(i));
        }
        console.log('All students:', students);
        success(students);
      },
      (_, err) => {
        console.log('Get students error: ' + err.message);
        error(err);
      },
    );
  });
};

export const updateStudentName = (id, newName, success, error) => {
  db.transaction(tx => {
    tx.executeSql(
      `UPDATE students SET name = ? WHERE id = ?;`,
      [newName, id],
      (_, result) => {
        console.log(`Student with ID ${id} updated successfully`);
        success(result);
      },
      (_, err) => {
        console.log('Update error: ' + err.message);
        error(err);
      },
    );
  });
};
