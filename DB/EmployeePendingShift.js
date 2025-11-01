import SQLite from 'react-native-sqlite-storage';

// Database creation
const db = SQLite.openDatabase(
  {
    name: 'employeePendingShift.db',
    location: 'default',
  },
  () => console.log('Employee Shift Db Connected'),
  error => console.log('❌ Database error: ' + error),
);

// Table creation
export const initEmployeePendingShiftDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS attendance_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        api_call_for TEXT,
        employee_id INTEGER,
        add_date_flag INTEGER,
        loc_date TEXT,
        attachment TEXT,        -- full JSON string
        last_sync_seq TEXT,
        isPushed INTEGER,
        createdAt TEXT
      );`,
      [],
      () => console.log('✅ Table created successfully'),
      error => console.log('❌ Table creation error: ' + error.message),
    );
  });
};

export const insertAttendanceRecord = data => {
  return new Promise((resolve, reject) => {
    try {
      const attachmentJSON = JSON.stringify(data.attachment || {});

      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO attendance_records (
            api_call_for,
            employee_id,
            add_date_flag,
            loc_date,
            attachment,
            last_sync_seq,
            isPushed,
            createdAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.api_call_for,
            data.employee_id,
            data.add_date_flag ? 1 : 0,
            data.loc_date || new Date().toISOString(),
            attachmentJSON,
            data.last_sync_seq,
            data.isPushed ?? 0,
            new Date().toISOString(),
          ],
          (_, result) => {
            console.log('✅ Insert attendance success:', result);
            resolve(result);
          },
          (_, err) => {
            console.log('❌ Insert attendance error:', err.message);
            reject(err);
          },
        );
      });
    } catch (err) {
      console.log('❌ JSON stringify error:', err);
      reject(err);
    }
  });
};

export const getAllAttendanceRecords = (success, error) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM attendance_records;`,
      [],
      (_, result) => {
        const records = [];
        for (let i = 0; i < result.rows.length; i++) {
          const row = result.rows.item(i);
          try {
            // Convert attachment back into object
            row.attachment = JSON.parse(row.attachment);
          } catch {
            row.attachment = {};
          }
          records.push(row);
        }

        console.log(JSON.stringify(records));
        success && success(records);
      },
      (_, err) => {
        console.log('❌ Fetch attendance error: ' + err.message);
        error && error(err);
      },
    );
  });
};

export const getUnpushedRecordsCount = (success, error) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT COUNT(*) as total FROM attendance_records WHERE isPushed = 0;`,
      [],
      (_, result) => {
        const count = result.rows.item(0).total;
        success && success(count);
      },
      (_, err) => {
        console.log('❌ Count query error: ' + err.message);
        error && error(err);
      },
    );
  });
};

export const markAsPushed = (id, success, error) => {
  db.transaction(tx => {
    tx.executeSql(
      `UPDATE attendance_records SET isPushed = 1 WHERE id = ?;`,
      [id],
      (_, result) => {
        console.log(`✅ Record ${id} marked as pushed`);
        success && success(result);
      },
      (_, err) => {
        console.log('❌ Update error: ' + err.message);
        error && error(err);
      },
    );
  });
};
