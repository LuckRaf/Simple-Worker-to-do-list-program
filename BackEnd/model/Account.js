const db = require('../config/database')

class Account {

  static async initAccountTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS Account (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        full_name VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20),
        role ENUM('user','admin') DEFAULT 'user',
        workcode VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    const sql2 = ` 
      CREATE TABLE IF NOT EXISTS AccountData (
        account_id INT PRIMARY KEY,
        Attended INT DEFAULT 0,
        OnReview INT DEFAULT 0,
        Completed INT DEFAULT 0,
        FOREIGN KEY (account_id) REFERENCES Account(id)
      )
    `
    await db.execute(sql)
    await db.execute(sql2)
    console.log('Account table initialized')
  }

  static async AccountRegister(username, password, email, full_name, phone_number, role, workcode) {
    const sql = `
      INSERT INTO Account
      (username, password, email, full_name, phone_number, role, workcode)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    const [result] = await db.execute(sql, [
      username, password, email, full_name, phone_number, role, workcode
    ])

    const sql2 = ` 
      INSERT INTO AccountData
      (account_id, Attended, OnReview, Completed)
      VALUES (LAST_INSERT_ID(), 0, 0, 0)
    `
    await db.execute(sql2)
    return result
  }

  static async login(username, password) {
    const sql = `SELECT * FROM Account WHERE username = ? AND password = ?`;
    const [rows] = await db.execute(sql, [username, password]);

    if (rows.length === 0) return null;

    return rows[0]; // akan mengembalikan object { id, username, role, ... }
  }

  // model/Account.js
  static async getGroupMembers(user_id) {
    // Ambil workcode user
    const workcodeSql = `SELECT workcode FROM Account WHERE id = ?`;
    const [rows] = await db.execute(workcodeSql, [user_id]);

    if (rows.length === 0) return [];

    const workcode = rows[0].workcode;

    // Ambil semua akun dengan workcode sama
    const membersSql = `
      SELECT id, username, full_name, role
      FROM Account
      WHERE workcode = ?
    `;

    const [members] = await db.execute(membersSql, [workcode]);
    return members;
  }


  static async getRole (user_id) {
    const sql = `SELECT role FROM Account WHERE id = ?`;
    const [rows] = await db.execute(sql, [user_id]);
    if (rows.length === 0) return null;

    return rows[0].role; // mengembalikan 'user' atau 'admin'
  }

  static async

}

module.exports = Account
