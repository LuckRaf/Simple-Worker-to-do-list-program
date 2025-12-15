const db = require('../config/database');
const Administrator = require('../model/Administrator');
const Account = require('../model/Account');

class AdministratorController {

  // Endpoint untuk mengambil summary data group berdasarkan user_id
  static async getGroupData(req, res) {
    try {
      const { user_id } = req.params; // ambil dari params URL

      if (!user_id) return res.status(400).json({ success: false, message: "User ID required" });

      const result = await Administrator.getAdminGroupData(user_id);

      if (!result) return res.status(404).json({ success: false, message: "User not found" });

      res.json({
        success: true,
        data: result // { totalAttended, totalOnReview, totalCompleted }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

module.exports = AdministratorController;