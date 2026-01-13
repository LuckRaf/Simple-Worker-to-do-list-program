// api/index.js
require('dotenv').config()
const express = require('express')
const cors = require('cors')

const Account = require('../BackEnd/model/Account')
const Task = require('../BackEnd/model/Task')
const User = require('../BackEnd/model/User')
const Notification = require('../BackEnd/model/Notification')

const AdministratorController = require('../BackEnd/controller/AdministratorController')
const accountController = require('../BackEnd/controller/AccountController')
const TaskController = require("../BackEnd/controller/TaskController")
const UserController = require('../BackEnd/controller/UserController')
const NotificationController = require('../BackEnd/controller/NotificationController')

const app = express()

/* ================= MIDDLEWARE ================= */
app.use(cors({ origin: '*' }))
app.use(express.json())

/* ================= DEBUG ================= */
app.use((req, res, next) => {
  console.log(`🔥 API HIT: ${req.method} ${req.url}`)
  next()
})

/* ================= ROOT ================= */
app.get('/', (req, res) => {
  res.json({ message: 'API running (vercel)' })
})

/* ================= AUTH ================= */
app.post('/api/register', async (req, res) => {
  try {
    await Account.AccountRegister(
      req.body.username,
      req.body.password,
      req.body.email,
      req.body.full_name,
      req.body.phone_number,
      req.body.role,
      req.body.workcode
    )

    return res.json({ success: true, message: 'Register success' })
  } catch (err) {
    console.error('REGISTER ERROR:', err)
    return res.status(500).json({
      success: false,
      message: err.message || 'Register failed'
    })
  }
})

app.post('/api/login', async (req, res) => {
  try {
    const user = await Account.login(req.body.username, req.body.password)
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    res.json({
      success: true,
      id: user.id,
      role: user.role,
      username: user.username
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

/* ================= EXPORT ================= */
module.exports = app
