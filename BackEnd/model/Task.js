const db = require("../config/database");

class Task {

  static async initTaskTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS Task (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        status ENUM('unattended','in_progress','on_review','completed')
          DEFAULT 'unattended',
        attendedby INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        Deadline DATE,
        workcode VARCHAR(20),
        dependency JSON DEFAULT NULL,
        FOREIGN KEY (attendedby) REFERENCES Account(id)
          ON DELETE SET NULL
      )
    `;
    await db.execute(sql);
  }

  // ================= CREATE TASK =================
  static async createTask({ title, description, Deadline, admin_id, dependency }) {
    const [rows] = await db.execute(
      "SELECT workcode FROM Account WHERE id = ?",
      [admin_id]
    );

    if (rows.length === 0) throw new Error("Admin not found");

    const workcode = rows[0].workcode;

    const [result] = await db.execute(
      `
      INSERT INTO Task (title, description, Deadline, workcode, dependency)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        title,
        description,
        Deadline,
        workcode,
        JSON.stringify(dependency || [])
      ]
    );

    const [task] = await db.execute(
      `
      SELECT t.*, a.username AS attended_username
      FROM Task t
      LEFT JOIN Account a ON t.attendedby = a.id
      WHERE t.id = ?
      `,
      [result.insertId]
    );

    return task[0];
  }

  // ================= GET TASK BY ADMIN =================
  static async getTaskByAdmin(user_id) {
    const [rows] = await db.execute(
      "SELECT workcode FROM Account WHERE id = ?",
      [user_id]
    );

    if (rows.length === 0) return [];

    const workcode = rows[0].workcode;

    const [tasks] = await db.execute(
      `
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.Deadline,
        t.dependency,
        t.attendedby,
        a.username AS attended_username
      FROM Task t
      LEFT JOIN Account a ON t.attendedby = a.id
      WHERE t.workcode = ?
      ORDER BY t.created_at DESC
      `,
      [workcode]
    );

    return tasks;
  }

  // ================= PROCEED TASK =================
  static async proceedTask(task_id, user_id) {
    const [rows] = await db.execute(
      "SELECT status, attendedby FROM Task WHERE id = ?",
      [task_id]
    );

    if (rows.length === 0) throw new Error("Task not found");

    const task = rows[0];
    let newStatus = task.status;
    let newAttendedBy = task.attendedby;

    if (task.status === "unattended") {
      newStatus = "in_progress";
      newAttendedBy = user_id;
    }
    else if (task.status === "in_progress") {
      newStatus = "on_review";
    }
    else if (task.status === "on_review") {
      newStatus = "completed";
    }
    else {
      throw new Error("Task already completed");
    }

    await db.execute(
      "UPDATE Task SET status = ?, attendedby = ? WHERE id = ?",
      [newStatus, newAttendedBy, task_id]
    );

    const [updated] = await db.execute(
      `
      SELECT t.*, a.username AS attended_username
      FROM Task t
      LEFT JOIN Account a ON t.attendedby = a.id
      WHERE t.id = ?
      `,
      [task_id]
    );

    return updated[0];
  }
}

module.exports = Task;
