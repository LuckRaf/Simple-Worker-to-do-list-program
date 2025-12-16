const User = require("../model/User");

exports.getUserWorkData = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.getById(user_id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Tambahkan data tambahan jika perlu (contoh: totalTasks, history, department)
    const userData = {
      ...user,
      name: user.full_name,
      email: user.phone_number,   // bisa diganti sesuai kebutuhan

      history: [
        { task: "Task A", time: "2025-12-16 10:00" },
        { task: "Task B", time: "2025-12-15 14:00" }
      ]
    };

    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserWorkData = async (req, res) => {
  try {
    const { user_id } = req.params;
    const data = await User.getUserWorkData(user_id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};