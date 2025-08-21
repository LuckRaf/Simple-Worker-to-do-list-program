import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="MainFrame">
      <div className="Login-box">
        <div className="Login-title">
          Login
        </div>
        User
        <input type="text" placeholder="Enter your text here">
        </input>
        password 
        <input type="text" placeholder="Enter your text here">
        </input>
      </div>
    </div>
  )
}

export default App
