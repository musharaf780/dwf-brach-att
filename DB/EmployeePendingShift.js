import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'employeePendingShift.db',
    location: 'default',
  },
  () => console.log('Employee Shift Db Connected'),
  error => console.log('❌ Database error: ' + error),
);

export const initEmployeePendingShiftDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS attendance_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        api_call_for TEXT,
        employee_id INTEGER,
        add_date_flag INTEGER,
        loc_date TEXT,
        attachment TEXT,  
        last_sync_seq TEXT,
        isPushed INTEGER,
        createdAt TEXT,
        emp_name TEXT

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
            createdAt,
            emp_name
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.api_call_for,
            data.employee_id,
            data.add_date_flag ? 1 : 0,
            data.loc_date || new Date().toISOString(),
            attachmentJSON,
            data.last_sync_seq,
            data.isPushed ?? 0,
            new Date().toISOString(),
            data.emp_name,
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
export const getAllAttendanceRecords = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM attendance_records;`,
        [],
        (_, result) => {
          const records = [];

          for (let i = 0; i < result.rows.length; i++) {
            const row = result.rows.item(i);

            try {
              row.attachment = JSON.parse(row.attachment);
            } catch {
              row.attachment = {};
            }

            row.add_date_flag = true;

            // ✅ Format loc_date: remove 'T', 'Z', and milliseconds
            if (row.loc_date) {
              row.loc_date = row.loc_date
                .replace('T', ' ')
                .replace('Z', '')
                .split('.')[0];
            }

            records.push(row);
          }

          resolve(records);
        },
        (_, err) => {
          console.log('❌ Fetch attendance error:', err.message);
          reject(err);
        },
      );
    });
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

export const getUnpushedRecords = (success, error) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM attendance_records WHERE isPushed = 0;`,
      [],
      (_, result) => {
        const records = [];
        for (let i = 0; i < result.rows.length; i++) {
          records.push(result.rows.item(i));
        }
        success && success(records);
      },
      (_, err) => {
        console.log('❌ Fetch unpushed records error:', err.message);
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

export const clearPendingAttendanceRecords = (success, error) => {
  db.transaction(tx => {
    tx.executeSql(
      `DELETE FROM attendance_records;`,
      [],
      (_, result) => {
        console.log('🧹 All attendance records deleted successfully');
        success && success(result);
      },
      (_, err) => {
        console.log('❌ Failed to delete records: ' + err.message);
        error && error(err);
      },
    );
  });
};
