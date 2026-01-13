require('dotenv').config();
const express = require('express');
const cors = require('cors');

const Account = require('./model/Account');
const Task = require('./model/Task');
const User = require('./model/User');
const Notification = require('./model/Notification');

const AdministratorController = require('./controller/AdministratorController');
const accountController = require('./controller/AccountController');
const TaskController = require("./controller/TaskController");
const UserController = require('./controller/UserController');
const NotificationController = require('./controller/NotificationController');

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

/* ================= ROOT ================= */
app.get('/', (req, res) => {
  res.json({ message: 'API running' });
});

/* ================= AUTH ================= */

// REGISTER
app.post('/api/register', async (req, res) => {
  console.log("🔥 REGISTER HIT", req.body);
  try {
    if (!req.body) {
      return res.status(400).json({ success: false, message: "Empty body" })
    }


    await Account.AccountRegister(
      req.body.username,
      req.body.password,
      req.body.email,
      req.body.full_name,
      req.body.phone_number,
      req.body.role,
      req.body.workcode
    )

    return res.status(200).json({
      success: true,
      message: "Register success"
    })

  } catch (err) {
    console.error("REGISTER FAILED:", err)

    // ⛑️ PAKSA JSON RESPONSE
    return res.status(500).json({
      success: false,
      message: err?.message || "Register failed"
    })
  }
})

// LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Account.login(username, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    res.json({
      success: true,
      id: user.id,
      role: user.role,
      username: user.username
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error"
    });
  }
});

/* ================= ADMIN ================= */
app.get('/admin/group-data/:user_id', AdministratorController.getGroupData);

app.post("/task", TaskController.createTask);
app.get("/task/admin/:user_id", TaskController.getTaskByAdmin);
app.patch("/task/proceed/:task_id", TaskController.proceedTask);

/* ================= WORKER ================= */
app.get('/task/user/:user_id', TaskController.getTaskByWorker);
app.patch('/task/proceed-worker/:task_id', TaskController.proceedTaskWorker);

/* ================= OTHER ================= */
app.get('/group/:user_id', accountController.getGroupMembers);
app.get('/user/work-data/:user_id', UserController.getUserWorkData);

app.get('/user/completed-work/:user_id', async (req, res) => {
  try {
    const completedWork = await User.getUserCompletedWorkData(req.params.user_id);

    if (!completedWork) {
      return res.status(404).json({ message: "No completed work found" });
    }

    res.json(completedWork);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= NOTIFICATION ================= */
app.get("/notification/workers/:user_id", async (req, res) => {
  try {
    const workers = await Notification.getWorkers(req.params.user_id);
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/notification/admin", NotificationController.createNotification);
app.get("/notification/admin/:user_id", NotificationController.getAdminNotifications);
app.get('/notification/user/:user_id', NotificationController.getAllNotif);

/* ================= INIT DB (SERVERLESS SAFE) ================= */
(async () => {
  try {
    await Account.initAccountTable();
    await Task.initTaskTable();
    await Notification.initNotificationTable();
    console.log("✅ Tables initialized");
  } catch (err) {
    console.error("❌ Init error:", err);
  }
})();

/* ================= EXPORT (WAJIB UNTUK VERCEL) ================= */
module.exports = app;
