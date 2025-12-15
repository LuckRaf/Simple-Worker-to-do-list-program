const Task = require("../model/Task");

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
