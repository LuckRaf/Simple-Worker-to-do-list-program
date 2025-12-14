const db = require('../config/database')
const bcrypt = require('bcrypt')

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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    await db.execute(sql)
    console.log('Account table initialized')
  }

  static async AccountRegister(
    username,
    password,
    email,
    full_name,
    phone_number,
    role
  ) {
    // 🔐 HASH PASSWORD
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const sql = `
      INSERT INTO Account 
      (username, password, email, full_name, phone_number, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `

    const [result] = await db.execute(sql, [
      username,
      hashedPassword,
      email,
      full_name,
      phone_number,
      role
    ])

    return result
  }
}

module.exports = Account
