const db = require("../config/database"); 

class User {
    static async getById(user_id) {
        const sql = `
        SELECT username, full_name, phone_number, role, created_at, workcode
        FROM Account
        WHERE id = ?
        `;
        const [rows] = await db.execute(sql, [user_id]);
        return rows[0];
    }

    static async getUserCompletedWorkData(user_id) {
        const sql = `
        SELECT Completed from AccountData Where account_id = ?
        `;
        const [rows] = await db.execute(sql, [user_id]);
        return rows[0];
    }

    static async getUserWorkData(user_id) {
  // Ambil data user dasar
  const [userRows] = await db.execute(
    `SELECT id, username, role, email, created_at, full_name AS name
     FROM Account WHERE id = ?`,
    [user_id]
  );

  if (userRows.length === 0) throw new Error("User not found");

  const user = userRows[0];

  // Hitung jumlah task berdasarkan status
  const [statusRows] = await db.execute(
    `SELECT 
       SUM(Unattended) AS unattended,
       SUM(Attended) AS attended,
       SUM(OnReview) AS on_review,
       SUM(Completed) AS completed
     FROM accountdata
     WHERE account_id = ?`,
    [user_id]
  );

  const taskStatus = statusRows[0] || { unattended: 0, attended: 0, on_review: 0, completed: 0 };

  // Ambil recent activities (5 task terbaru)
  const [historyRows] = await db.execute(
    `SELECT title AS task, created_at AS time
     FROM Task 
     WHERE attendedby = ? 
     ORDER BY created_at DESC 
     LIMIT 5`,
    [user_id]
  );

  const history = historyRows.length > 0
    ? historyRows.map(h => ({
        task: h.task,
        time: h.time ? new Date(h.time).toLocaleString() : "-"
      }))
    : [{ task: "None", time: "-" }];

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    email: user.email,
    tasks: taskStatus,
    created_at: user.created_at,
    history
  };
}

}

module.exports = User;