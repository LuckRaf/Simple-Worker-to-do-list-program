const db = require('../config/database')

class Notification {
    static async initNotificationTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS Notification (
            id INT AUTO_INCREMENT PRIMARY KEY,
            account_id INT,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (account_id) REFERENCES Account(id)
        )
        `
        await db.execute(sql)
        console.log('Notification table initialized')
    }

    static async create(message, account_id) {
    const [result] = await db.execute(
      `INSERT INTO Notification (message, account_id) VALUES (?, ?)`,
      [message, account_id]
    );
    return result;
  }

    static async getByAccount(account_id) {
        const [rows] = await db.execute(
        `SELECT * FROM Notification WHERE account_id = ? ORDER BY created_at DESC`,
        [account_id]
        );
        return rows;
    }

    static async markAsRead(notification_id) {
        await db.execute(
        `UPDATE Notification SET is_read = TRUE WHERE id = ?`,
        [notification_id]
        );
    }

    static async getAll() {
        const [rows] = await db.execute(`SELECT * FROM Notification ORDER BY created_at DESC`);
        return rows;
  }

  // Ambil semua worker (bisa di NotificationController juga)
    static async getWorkers(user_id) {
        // 1. Ambil workcode admin
        const [adminRows] = await db.execute(
            "SELECT workcode FROM Account WHERE id = ?",
            [user_id]
        );

        if (adminRows.length === 0) return [];

        const workcode = adminRows[0].workcode;

        // 2. Ambil worker dengan workcode yang sama
        const [workers] = await db.execute(
            "SELECT id, username FROM Account WHERE role = 'user' AND workcode = ?",
            [workcode]
        );

        return workers;
}

static async getAllNotifByUser(user_id) {
    const [rows] = await db.execute(
      `SELECT id, message, is_read, created_at
       FROM Notification
       WHERE account_id = ?
       ORDER BY created_at DESC`,
      [user_id]
    );
    return rows;
  }



}

module.exports = Notification;