const db = require("../config/db");

const User = {
  create: (userData, callback) => {
    const sql = `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `;

    db.query(
      sql,
      [userData.name, userData.email, userData.password],
      callback
    );
  },
  
  findByEmail: (email, callback) => {
    const sql = `
      SELECT * FROM users
      WHERE email = ?
    `;

    db.query(sql, [email], callback);
  },

  findById(id, callback) {
    db.query(
        "SELECT id, name, email FROM users WHERE id = ?",
        [id],
        callback
    );
}
};

module.exports = User;