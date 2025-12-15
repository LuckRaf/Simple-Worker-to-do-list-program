import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../context/AuthContext"
import './Login.css'

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [showRegister, setShowRegister] = useState(false)
  const [regData, setRegData] = useState({
    username: "",
    password: "",
    email: "",
    full_name: "",
    phone_number: "",
    role: "user",
    workcode: ""
  })

  const navigate = useNavigate()
  const { login } = useAuth()

  // ========== LOGIN ==========
  const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // ✅ Simpan role & user_id di AuthContext
      login(data.role, data.id);

      // Redirect sesuai role
      if (data.role === "admin") navigate("/MainAdmin");
      else navigate("/MainUser");
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};


  // ========== REGISTER ==========
  const generateRandomCode = (length = 10) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"
    let code = ""
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const handleGenerateCode = () => {
    const code = generateRandomCode()
    setRegData({ ...regData, workcode: code })
  }

  const handleRegister = async () => {
    try {
      // Jika user, workcode wajib
      if (regData.role === "user" && !regData.workcode) {
        alert("Please enter work code provided by your administrator")
        return
      }

      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regData)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || "Register failed")
        return
      }

      alert("Register success!")
      setShowRegister(false)
      setRegData({
        username: "",
        password: "",
        email: "",
        full_name: "",
        phone_number: "",
        role: "user",
        workcode: ""
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
              onChange={e => setRegData({ ...regData, role: e.target.value, workcode: "" })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <br />

            <div className='Workcode'>
              {regData.role === "user" ? (
                <input
                  placeholder="Work Code from Admin"
                  value={regData.workcode}
                  onChange={e => setRegData({ ...regData, workcode: e.target.value })}
                />
              ) : (
                <>
                  <input
                    placeholder="Generated Work Code"
                    value={regData.workcode}
                    readOnly
                  />
                  <br />
                  <button type="button" onClick={handleGenerateCode}>
                    Generate
                  </button>
                </>
              )}
            </div>
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
