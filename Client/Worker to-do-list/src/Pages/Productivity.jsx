import { useState } from 'react'
import './Productivity.css'
import pfp from '/src/assets/PageRoutingTest.png';
import Sidebar from "../component/SideBarA.jsx";


function Productivity() {
  const [count, setCount] = useState(0)

  return (
    
    <div className="MainFrame">
      <Sidebar profilePic={pfp} />
    
    </div>
  )
}

export default Productivity