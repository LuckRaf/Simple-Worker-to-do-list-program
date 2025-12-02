import { useState } from 'react'
import './TaskListA.css'
import pfp from '/src/assets/PageRoutingTest.png';
import Sidebar from "../component/SideBarA.jsx";


function TaskA() {
  const [count, setCount] = useState(0)

  return (
    
    <div className="TaskContainer">
      <Sidebar profilePic={pfp} />
      <div className="TaskContainerKanban"> 


      </div>
    </div>
  )
}

export default TaskA