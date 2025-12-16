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
    await db.execute(
      `
      UPDATE AccountData SET Unattended = Unattended + 1 WHERE account_id = ?
      `,
      [admin_id]
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
static async proceedTask(task_id, admin_id) {
    const [rows] = await db.execute("SELECT * FROM Task WHERE id = ?", [task_id]);
    if (rows.length === 0) throw new Error("Task not found");
    const task = rows[0];

    // Ambil workcode admin
    const [adminRows] = await db.execute("SELECT workcode FROM Account WHERE id = ?", [admin_id]);
    const workcode = adminRows[0]?.workcode;
    if (!workcode) throw new Error("Admin workcode not found");

    let oldStatus = task.status;
    let newStatus = oldStatus;
    let newAttendedBy = task.attendedby;

    // Tentukan status baru
    if (task.status === "unattended") {
        newStatus = "in_progress";
        newAttendedBy = admin_id;
    } else if (task.status === "in_progress") {
        newStatus = "on_review";
    } else if (task.status === "on_review") {
        newStatus = "completed";
    } else {
        throw new Error("Task already completed");
    }

    // Update task
    await db.execute(
        "UPDATE Task SET status = ?, attendedby = ? WHERE id = ?",
        [newStatus, newAttendedBy, task_id]
    );

    // ================= UPDATE ACCOUNTDATA =================
    const statusMap = {
        unattended: "Unattended",
        in_progress: "Attended",
        on_review: "OnReview",
        completed: "Completed",
    };

    if (statusMap[oldStatus] && statusMap[newStatus]) {
        if (task.attendedby === admin_id || !task.attendedby) {
            // Admin proceed task miliknya sendiri → update admin
            await db.execute(
                `UPDATE AccountData
                 SET ${statusMap[oldStatus]} = GREATEST(${statusMap[oldStatus]} - 1, 0),
                     ${statusMap[newStatus]} = ${statusMap[newStatus]} + 1
                 WHERE account_id = ?`,
                [admin_id]
            );
        } else {
            // Task sebelumnya diambil worker → update worker
            await db.execute(
                `UPDATE AccountData
                 SET ${statusMap[oldStatus]} = GREATEST(${statusMap[oldStatus]} - 1, 0),
                     ${statusMap[newStatus]} = ${statusMap[newStatus]} + 1
                 WHERE account_id = ?`,
                [task.attendedby]
            );
        }
    }

    // Ambil kembali task
    const [updated] = await db.execute(
        `SELECT t.*, a.username AS attended_username
         FROM Task t
         LEFT JOIN Account a ON t.attendedby = a.id
         WHERE t.id = ?`,
        [task_id]
    );

    return updated[0];
}

  static async getTasksByUser(user_id) {
    const [rows] = await db.execute(
      `SELECT t.*, a.username AS attended_username
       FROM Task t
       LEFT JOIN Account a ON t.attendedby = a.id
       WHERE t.attendedby = ? OR t.status = 'unattended'
       ORDER BY t.id DESC`,
      [user_id]
    );

    return rows;
  }

  // Proceed task (worker hanya boleh UNATTENDED → ATTENDED)
static async proceedTaskWorker(task_id, user_id) {
    console.log("Proceeding task:", task_id, "by user:", user_id);

    // Ambil task
    const [rows] = await db.execute("SELECT * FROM Task WHERE id = ?", [task_id]);
    if (rows.length === 0) throw new Error("Task not found");
    const task = rows[0];

    if (task.status !== "unattended")
        throw new Error("Cannot proceed this task yet (Only UNATTENDED → IN_PROGRESS allowed)");

    // ================= CEK DEPENDENCY =================
    let depArray = [];
    try { depArray = task.dependency ? JSON.parse(task.dependency) : []; } catch {}
    for (let id of depArray) {
        const [depRows] = await db.execute("SELECT status FROM Task WHERE id = ?", [id]);
        if (depRows.length === 0) continue;
        if (depRows[0].status !== "completed") {
            throw new Error(`Dependency task #${id} is not completed`);
        }
    }

    // ================= CARI ADMIN =================
    // Ambil workcode dari worker
    const [workerRows] = await db.execute("SELECT workcode FROM Account WHERE id = ?", [user_id]);
    const workcode = workerRows[0]?.workcode;
    if (!workcode) throw new Error("Worker workcode not found");

    // Ambil admin dengan workcode sama dan role='admin'
    const [adminRows] = await db.execute(
        "SELECT id FROM Account WHERE workcode = ? AND role = 'admin' LIMIT 1",
        [workcode]
    );
    const adminId = adminRows[0]?.id;

    // ================= UPDATE TASK =================
    await db.execute(
        "UPDATE Task SET status = 'in_progress', attendedby = ? WHERE id = ?",
        [user_id, task_id]
    );

    // ================= UPDATE ACCOUNTDATA =================
    // Worker bertambah Attended
    await db.execute(
        `UPDATE AccountData
         SET Attended = Attended + 1 
         WHERE account_id = ?`,
        [user_id]
    );

    await db.execute(
        `UPDATE AccountData
         SET Unattended = Unattended - 1
         WHERE account_id = ?`,
        [user_id]
    )

    // Admin yang membuat task berkurang Unattended
    

    // ================= AMBIL TASK TERBARU =================
    const [updatedRows] = await db.execute(
        `SELECT t.*, a.username AS attended_username
         FROM Task t
         LEFT JOIN Account a ON t.attendedby = a.id
         WHERE t.id = ?`,
        [task_id]
    );

    return updatedRows[0];
}





}

module.exports = Task;
