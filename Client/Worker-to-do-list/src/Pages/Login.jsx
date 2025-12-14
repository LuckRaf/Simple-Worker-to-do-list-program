import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../context/AuthContext"
import './Login.css'

function Login() {
  // LOGIN STATE
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // REGISTER STATE
  const [showRegister, setShowRegister] = useState(false)
  const [regData, setRegData] = useState({
    username: "",
    password: "",
    email: "",
    full_name: "",
    phone_number: "",
    role: "user"
  })

  const navigate = useNavigate()
  const { login } = useAuth()

  /* ================= LOGIN ================= */
  const handleLogin = () => {
    if (username === "admin") {
      login(username)
      navigate("/MainAdmin")
    } else if (username === "user") {
      login(username)
      navigate("/MainUser")
    } else {
      alert("Invalid username!")
    }
  }

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(regData)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || "Register failed")
        return
      }

      alert("Register success!")
      setShowRegister(false)

      // reset form
      setRegData({
        username: "",
        password: "",
        email: "",
        full_name: "",
        phone_number: "",
        role: "user"
      })

    } catch (error) {
      alert("Server error")
      console.error(error)
    }
  }

  return (
    <div className="MainFrame">
      <div className="Login-box">

        <div className="Login-title">
          {showRegister ? "Register" : "Sign in"}
        </div>

        <br />

        {/* ================= LOGIN FORM ================= */}
        {!showRegister && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <br />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <br />

            <div className="Login-actions">
              <button className="Login-button" onClick={handleLogin}>
                Login
              </button>

              <button
                className="Register-link"
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </div>
          </>
        )}

        {/* ================= REGISTER FORM ================= */}
        {showRegister && (
          <div className="Register-overlay">

            <input
              placeholder="Username"
              value={regData.username}
              onChange={e => setRegData({ ...regData, username: e.target.value })}
            />
            <br />

            <input
              type="email"
              placeholder="Email"
              value={regData.email}
              onChange={e => setRegData({ ...regData, email: e.target.value })}
            />
            <br />

            <input
              type="password"
              placeholder="Password"
              value={regData.password}
              onChange={e => setRegData({ ...regData, password: e.target.value })}
            />
            <br />

            <input
              placeholder="Full Name"
              value={regData.full_name}
              onChange={e => setRegData({ ...regData, full_name: e.target.value })}
            />
            <br />

            <input
              placeholder="Phone Number"
              value={regData.phone_number}
              onChange={e => setRegData({ ...regData, phone_number: e.target.value })}
            />
            <br />

            <select
              value={regData.role}
              onChange={e => setRegData({ ...regData, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <br />

            <div className="Login-actions">
              <button className="Login-button" onClick={handleRegister}>
                Register
              </button>

              <button
                className="Register-link"
                onClick={() => setShowRegister(false)}
              >
                Back to Login
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default Login
