require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Account = require('./model/Account')
const AdministratorController = require('./controller/AdministratorController') // import controller

const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'API running' })
})

// REGISTER
app.post('/register', async (req, res) => {
  try {
    const { username, password, email, full_name, phone_number, role, workcode } = req.body
    await Account.AccountRegister(username, password, email, full_name, phone_number, role, workcode)
    res.json({ message: 'Register success' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message || 'Register failed' })
  }
})

// LOGIN
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Account.login(username, password);

    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, role: user.role, id: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ========== NEW: GET ADMIN GROUP DATA ==========
app.get('/admin/group-data/:user_id', AdministratorController.getGroupData);

const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
  await Account.initAccountTable()
})
