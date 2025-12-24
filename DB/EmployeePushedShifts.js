import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'employeePushedShift.db',
    location: 'default',
  },
  () => console.log('✅ Employee Shift DB Connected'),
  error => console.log('❌ Database error: ' + error),
);
const getYesterdayDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};
export const initializeEmployeePushedShiftTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS attendance_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT,
        api_call_for TEXT,
        loc_date TEXT,
        add_date_flag INTEGER,
        last_sync_seq TEXT,
        isPushed INTEGER DEFAULT 0,
        createdAt TEXT,
        attachment TEXT
      );`,
      [],
      () => console.log('✅ attendance_records table initialized'),
      (_, err) => console.log('❌ Table creation error: ' + err.message),
    );
  });
};

export const insertPushedAttendanceRecord = (record, success, error) => {
  const {
    employee_id,
    api_call_for,
    loc_date,
    add_date_flag,
    last_sync_seq,
    isPushed,
    attachment,
  } = record;
  const createdAt = new Date().toISOString();

  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO attendance_records (
        employee_id, api_call_for, loc_date, add_date_flag,
        last_sync_seq, isPushed, createdAt, attachment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        employee_id,
        api_call_for,
        loc_date,
        add_date_flag ? 1 : 0,
        last_sync_seq,
        isPushed ? 1 : 0,
        createdAt,
        'attachment',
      ],
      (_, result) => {
        console.log('✅ Record inserted successfully');
        success && success(result);
      },
      (_, err) => {
        console.log('❌ Insert error: ' + err.message);
        error && error(err);
      },
    );
  });
};

export const getAllAttendanceRecords = (success, error) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM attendance_records ORDER BY id ASC;`,
      [],
      (_, result) => {
        const rows = result.rows.raw().map(row => ({
          ...row,
          attachment: row.attachment ? JSON.parse(row.attachment) : null,
          add_date_flag: !!row.add_date_flag,
          isPushed: !!row.isPushed,
        }));
        success && success(rows);
      },
      (_, err) => {
        console.log('❌ Fetch error: ' + err.message);
        error && error(err);
      },
    );
  });
};

export const getPushedRecordsCount = (success, error) => {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  db.transaction(tx => {
    tx.executeSql(
      `
      SELECT COUNT(*) as total
      FROM attendance_records
      WHERE substr(createdAt, 1, 10) = ?;
      `,
      [today],
      (_, result) => {
        const count = result.rows.item(0).total;
        success && success(count);
      },
      (_, err) => {
        console.log('❌ Today created count error: ' + err.message);
        error && error(err);
      },
    );
  });
};

export const getPushedRecords = (success, error) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM attendance_records WHERE isPushed = 0;`,
      [],
      (_, result) => {
        const rows = [];
        for (let i = 0; i < result.rows.length; i++) {
          rows.push(result.rows.item(i));
        }
        success && success(rows);
      },
      (_, err) => {
        console.log('❌ Fetch query error: ' + err.message);
        error && error(err);
      },
    );
  });
};
