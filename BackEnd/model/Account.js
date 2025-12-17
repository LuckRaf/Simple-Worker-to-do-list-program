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

  static async getWorkData(user_id) {
    // Ambil data user
    const [userRows] = await db.execute(
      `SELECT id, username, role, email, full_name AS name, department, created_at, workcode 
       FROM Account WHERE id = ?`,
      [user_id]
    );

    if (userRows.length === 0) throw new Error("User not found");

    const user = userRows[0];

    // Total tasks completed
    const [totalRows] = await db.execute(
      `SELECT COUNT(*) AS totalTasks FROM Task 
       WHERE attendedby = ? AND status = 'completed'`,
      [user_id]
    );

    const totalTasks = totalRows[0]?.totalTasks || 0;

    // Recent activities (ambil 5 terbaru)
    const [historyRows] = await db.execute(
      `SELECT title AS task, created_at AS time 
       FROM Task WHERE attendedby = ? 
       ORDER BY created_at DESC LIMIT 5`,
      [user_id]
    );

    // Format time sederhana
    const history = historyRows.map(h => ({
      task: h.task,
      time: h.time ? new Date(h.time).toLocaleString() : "-"
    }));
    console.log(user.created_at);

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email,
      department: user.department,
      created_at: user.created_at,
      workcode: user.workcode,
      totalTasks,
      history
    };
  }

}

module.exports = Account
