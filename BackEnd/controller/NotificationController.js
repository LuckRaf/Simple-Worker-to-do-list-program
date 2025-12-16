const Notification = require("../model/Notification");
const db = require("../config/database");

class NotificationController {

  // Ambil semua worker
  static async getWorkers(admin_id) {
  try {
    // Cari workcode admin
    const [adminRow] = await db.execute(
      "SELECT workcode FROM Account WHERE id = ?",
      [admin_id]
    );

    if (!adminRow || adminRow.length === 0) return [];

    const adminWorkcode = adminRow[0].workcode;

    // Ambil semua worker yang workcode-nya sama dengan admin
    const [workers] = await db.execute(
      "SELECT id, username FROM Account WHERE role='worker' AND workcode = ?",
      [adminWorkcode]
    );

    return workers;
  } catch (err) {
    console.error(err);
    throw err;
  }
}


  // Admin buat notifikasi
  static async createNotification(req, res) {
    try {
      const { message, worker_id, admin_id } = req.body;

      if (!message) return res.status(400).json({ error: "Message required" });
      if (!admin_id) return res.status(400).json({ error: "Admin ID required" });

      // Jika worker_id null → broadcast ke semua worker
      if (!worker_id) {
        const [workers] = await db.execute("SELECT id FROM Account WHERE role='worker'");
        for (let w of workers) {
          await Notification.create(message, w.id);
        }
      } else {
        await Notification.create(message, worker_id);
      }

      // Simpan juga untuk admin sendiri
      await Notification.create(message, admin_id);

      res.json({ message: "Notification sent" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  // Ambil notifikasi admin berdasarkan params
  static async getAdminNotifications(req, res) {
    try {
      const { user_id } = req.params; // ambil dari URL
      if (!user_id) return res.status(400).json({ error: "User ID required" });

      const notifs = await Notification.getByAccount(user_id);
      res.json(notifs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  static async getAllNotif(req, res) {
    try {
      const { user_id } = req.params;

      if (!user_id) {
        return res.status(400).json({ error: "user_id required" });
      }

      const notifications = await Notification.getAllNotifByUser(user_id);
      res.json(notifications);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = NotificationController;
