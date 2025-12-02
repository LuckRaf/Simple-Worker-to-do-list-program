import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../context/AuthContext";
import './Login.css'

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth();

  const handleLogin = () => {
    if (username === "admin") {
      login(username);
      navigate("/MainAdmin") // go to admin page
    } else if (username === "user") {
      login(username);
      navigate("/MainUser") // go to user page
    } else {
      alert("Invalid username!") // optional
    }
  }

  return (
    <div className="MainFrame">
      <div className="Login-box">
        <div className="Login-title">
          Sign in
        </div>
        <br />
        <input 
          type="text" 
          placeholder="User" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <br />
        <input 
          type="password" 
          placeholder="Password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <br />
        <button className="Login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  )
}

export default Login
