require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Account = require('./model/Account')

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

app.post('/register', async (req, res) => {
  try {
    const { username, password, email, full_name, phone_number, role } = req.body

    await Account.AccountRegister(
      username,
      password,
      email,
      full_name,
      phone_number,
      role
    )

    res.json({ message: 'Register success' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Register failed' })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
  await Account.initAccountTable()
})



