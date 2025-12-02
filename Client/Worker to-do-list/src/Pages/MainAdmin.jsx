import { useState } from 'react'
import './MainAdmin.css'
import pfp from '/src/assets/PageRoutingTest.png';
import Sidebar from "../component/SideBarA.jsx";


function MainAdmin() {
  const [count, setCount] = useState(0)

  return (
    
    <div className="AdminHome">
      <Sidebar profilePic={pfp} username={"page test"}/>
      <div classname="HomeA">
        
      </div>
  
    </div>
  )
}

export default MainAdmin
