require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Account = require('./model/Account');
const AdministratorController = require('./controller/AdministratorController');
const accountController = require('./controller/AccountController');
const TaskController = require("./controller/TaskController");
const Task = require('./model/Task');
const UserController = require('./controller/UserController');
const app = express();
const User = require('./model/User');

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// ======= ROOT =======
app.get('/', (req, res) => {
  res.json({ message: 'API running' });
});

// ======= ACCOUNT =======
// Register
app.post('/register', async (req, res) => {
  try {
    const { username, password, email, full_name, phone_number, role, workcode } = req.body;
    await Account.AccountRegister(username, password, email, full_name, phone_number, role, workcode);
    res.json({ message: 'Register success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Register failed' });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Account.login(username, password);
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    res.json({
      success: true,
      id: user.id,
      role: user.role,
      username: user.username
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======= ADMIN ROUTES =======
// Get admin group data
app.get('/admin/group-data/:user_id', AdministratorController.getGroupData);

// Task admin
app.post("/task", TaskController.createTask);
app.get("/task/admin/:user_id", TaskController.getTaskByAdmin);
app.patch("/task/proceed/:task_id", TaskController.proceedTask); // admin proceed

// ======= WORKER ROUTES =======
// Get tasks for worker
app.get('/task/user/:user_id', TaskController.getTaskByWorker);
// Proceed task worker (UNATTENDED → ATTENDED)
app.patch('/task/proceed-worker/:task_id', TaskController.proceedTaskWorker);

// ======= OTHER =======
app.get('/group/:user_id', accountController.getGroupMembers);

app.get('/user/work-data/:user_id', UserController.getUserWorkData);



app.get('/user/completed-work/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    // Panggil function dari model
    const completedWork = await User.getUserCompletedWorkData(user_id);

    if (!completedWork) {
      return res.status(404).json({ message: "No completed work found" });
    }

    res.json(completedWork);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



// ======= INIT TABLES & START SERVER =======
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  await Account.initAccountTable();
  await Task.initTaskTable();
});
