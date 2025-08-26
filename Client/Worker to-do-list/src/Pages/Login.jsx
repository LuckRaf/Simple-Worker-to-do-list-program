import { useState } from 'react'
import './Login.css'

function Login() {
  const [count, setCount] = useState(0)

  return (
    <div className="MainFrame">
      <div className="Login-box">
        <div className="Login-title">
          Sign in
        </div>
        <br></br>
        <input type="text" placeholder="User">
        </input>
         <br></br>
        <input type="password" placeholder="Password">
        </input>
        <br></br>
        <button className="Login-button">Login</button>
      </div>
    </div>
  )
}

export default Login
