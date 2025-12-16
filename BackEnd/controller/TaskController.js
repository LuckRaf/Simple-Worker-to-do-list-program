const Task = require("../model/Task");

// ================= ADMIN ROUTES =================
exports.getTaskByAdmin = async (req, res) => {
  try {
    const { user_id } = req.params;
    const tasks = await Task.getTaskByAdmin(user_id);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = await Task.createTask(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.proceedTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { user_id } = req.body;
    const task = await Task.proceedTask(task_id, user_id);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= WORKER ROUTES =================
exports.getTaskByWorker = async (req, res) => {
  try {
    const { user_id } = req.params;
    const tasks = await Task.getTasksByUser(user_id); // method di model
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.proceedTaskWorker = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { user_id } = req.body;

    // Worker hanya bisa proceed UNATTENDED → IN_PROGRESS
    const task = await Task.proceedTaskWorker(task_id, user_id);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
