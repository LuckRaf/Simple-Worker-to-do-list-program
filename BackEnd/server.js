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
  try {
    // ================= VALIDASI BODY =================
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is empty"
      });
    }

    const {
      username,
      password,
      email,
      full_name,
      phone_number,
      role,
      workcode
    } = req.body;

    // ================= VALIDASI FIELD =================
    if (!username || !password || !email || !full_name) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    if (role === "user" && !workcode) {
      return res.status(400).json({
        success: false,
        message: "Work code is required for user role"
      });
    }

    // ================= PROSES REGISTER =================
    const result = await Account.AccountRegister(
      username,
      password,
      email,
      full_name,
      phone_number || null,
      role || "user",
      workcode || null
    );

    // ================= RESPONSE PASTI JSON =================
    return res.status(201).json({
      success: true,
      message: "Register success",
      data: result || null
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);

    // ================= ERROR KHUSUS MYSQL =================
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists"
      });
    }

    // ================= FALLBACK ERROR =================
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error"
    });
  }
});

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
