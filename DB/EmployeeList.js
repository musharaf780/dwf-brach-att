import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'employeelist.db' });

export const initEmployeeDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY,
        allow_chkin_outzone INTEGER,
        allow_chkout_outzone INTEGER,
        allow_in_branch_att INTEGER,
        branch_outlet_id INTEGER,
        company_branch_id INTEGER,
        company_id INTEGER,
        curr_geoatt_id TEXT,
        curr_geobv_id TEXT,
        curr_geosess_id TEXT,
        department_id INTEGER,
        geolocation_hr_attendance INTEGER,
        is_geobv_active INTEGER,
        is_geosess_active INTEGER,
        latest_attendance INTEGER,
        latest_session INTEGER,
        name TEXT,
        need_bv_face_tracking_att INTEGER,
        need_face_tracking_att INTEGER,
        need_live_tracking_att INTEGER,
        partner_id INTEGER,
        user_id INTEGER,
        value TEXT,
        checkIn INTEGER
      );`,
      [],
      () => console.log('✅ employees table created successfully'),
      (_, error) => console.log('❌ table creation error: ' + error.message),
    );
  });
};
export const insertEmployeeList = records => {
  if (!Array.isArray(records)) {
    console.log('❌ Expected an array of records');
    return;
  }

  db.transaction(
    tx => {
      records.forEach(record => {
        tx.executeSql(
          `INSERT OR REPLACE INTO employees (
          id,
          allow_chkin_outzone,
          allow_chkout_outzone,
          allow_in_branch_att,
          branch_outlet_id,
          company_branch_id,
          company_id,
          curr_geoatt_id,
          curr_geobv_id,
          curr_geosess_id,
          department_id,
          geolocation_hr_attendance,
          is_geobv_active,
          is_geosess_active,
          latest_attendance,
          latest_session,
          name,
          need_bv_face_tracking_att,
          need_face_tracking_att,
          need_live_tracking_att,
          partner_id,
          user_id,
          value,
          checkIn
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            record.id,
            record.allow_chkin_outzone ? 1 : 0,
            record.allow_chkout_outzone ? 1 : 0,
            record.allow_in_branch_att ? 1 : 0,
            record.branch_outlet_id,
            record.company_branch_id,
            record.company_id,
            record.curr_geoatt_id ? String(record.curr_geoatt_id) : null,
            record.curr_geobv_id ? String(record.curr_geobv_id) : null,
            record.curr_geosess_id ? String(record.curr_geosess_id) : null,
            record.department_id,
            record.geolocation_hr_attendance ? 1 : 0,
            record.is_geobv_active ? 1 : 0,
            record.is_geosess_active ? 1 : 0,
            record.latest_attendance,
            record.latest_session,
            record.name,
            record.need_bv_face_tracking_att ? 1 : 0,
            record.need_face_tracking_att ? 1 : 0,
            record.need_live_tracking_att ? 1 : 0,
            record.partner_id,
            record.user_id,
            record.value,
            record.checkIn ? 1 : 0,
          ],
          null,
          (_, error) => console.log('❌ Insert error:', error.message),
        );
      });
    },
    error => console.log('❌ Transaction error:', error.message),
    () => console.log('✅ All records inserted successfully'),
  );
};
