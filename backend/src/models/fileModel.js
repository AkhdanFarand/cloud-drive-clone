const db = require("../config/db");

const File = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO files
      (user_id, original_name, object_name, file_size, mime_type)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        data.user_id,
        data.original_name,
        data.object_name,
        data.file_size,
        data.mime_type,
      ],
      callback
    );
  },

  findByUserId: (userId, callback) => {
    const sql = `
      SELECT
        id,
        original_name,
        file_size,
        mime_type,
        created_at
      FROM files
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;

    db.query(sql, [userId], callback);
  },

  findById: (id, callback) => {
    const sql = `
      SELECT *
      FROM files
      WHERE id = ?
    `;

    db.query(sql, [id], callback);
  },

  delete: (id, callback) => {
    const sql = `
      DELETE FROM files
      WHERE id = ?
    `;

    db.query(sql, [id], callback);
  },

  updateName: (id, originalName, callback) => {
    const sql = `
      UPDATE files
      SET original_name = ?
      WHERE id = ?
    `;
  
    db.query(sql, [originalName, id], callback);
  },
};

module.exports = File;