import { useState } from 'react'
import './Activity.css'
import pfp from '/src/assets/PageRoutingTest.png';
import Sidebar from "../component/SideBarA.jsx";


function Activity() {
  const [count, setCount] = useState(0)

  return (
    
    <div className="Activity">
      <Sidebar profilePic={pfp} username={'Admin'}/>
    
    </div>
  )
}

export default Activity