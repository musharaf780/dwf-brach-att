import SQLite from 'react-native-sqlite-storage';

// db create
const db = SQLite.openDatabase(
  {
    name: 'authsuccess.db',
    location: 'default',
  },
  () => {
    console.log('database connected');
  },
  error => {
    console.log('database error' + error);
  },
);

export const initAuthDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS auth (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        access_token TEXT,
        refresh_token TEXT,
        token_type TEXT,
        expires_in INTEGER,
        scope TEXT,
        user_id INTEGER,
        login_type TEXT,
        success INTEGER,
        user_found INTEGER,
        password_correct INTEGER
      );`,
      [],
      () => console.log('Auth table ready'),
      (_, error) => console.log('Auth table creation error:', error.message),
    );
  });
};

export const saveAuthData = data => {
  const {
    access_token,
    refresh_token,
    token_type,
    expires_in,
    scope,
    user_id,
    login_type,
    success,
    user_found,
    password_correct,
  } = data;

  db.transaction(tx => {
    tx.executeSql(
      `INSERT OR REPLACE INTO auth 
       (id, access_token, refresh_token, token_type, expires_in, scope, user_id, login_type, success, user_found, password_correct)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        access_token,
        refresh_token,
        token_type,
        expires_in,
        scope,
        user_id,
        login_type,
        success ? 1 : 0,
        user_found ? 1 : 0,
        password_correct ? 1 : 0,
      ],
      () => console.log('Auth data saved'),
      (_, error) => console.log('Error saving auth data:', error.message),
    );
  });
};
export const getAuthData = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM auth WHERE id = 1',
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0));
          } else {
            resolve(null);
          }
        },
        (_, error) => reject(error),
      );
    });
  });
};

export const clearAuthData = () => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM auth WHERE id = 1',
      [],
      () => console.log('Auth data cleared'),
      (_, error) => console.log('Error clearing auth data:', error.message),
    );
  });
};
