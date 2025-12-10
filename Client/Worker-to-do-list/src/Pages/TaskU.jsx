import { useState } from 'react';
import './TaskU.css';
import pfp from '/src/assets/checkmark.png';
import Sidebar from "../component/SideBarW.jsx";

function TaskUser() {
  const tasks = [
    { title: "Task 1", status: "UNATTENDED" },
    { title: "Task 2", status: "ATTENDED" },
    { title: "Task 3", status: "ON REVIEW" },
    { title: "Task 4", status: "DONE" },
    { title: "Task 5", status: "ATTENDED" },
  ];

  const [selectedTask, setSelectedTask] = useState(null);

  const renderTasks = () => {
    return tasks.map((task, index) => (
      <div
        key={index}
        className="UserTaskItem"
        onClick={() => setSelectedTask(task)}
      >
        <div className="UserTaskTitle">{task.title}</div>
        <div className="UserTaskDependencies">Dependencies: None</div>
      </div>
    ));
  };

  return (
    <div className="UserTaskContainer">
      <Sidebar profilePic={pfp} username={"User"}/>

      <div className="UserAllTaskContainer"> 
        <div className="UserWelcomeBox-Work">
          My Work
        </div>
        
        <div className='UserKanbanModel'>
          {["UNATTENDED", "ATTENDED", "ON REVIEW", "DONE"].map((status, i) => (
            <div key={i} className='UserTaskSection'>
              <div className='UserTaskStatus'>{status}</div>
              <div className='UserTaskList'>{renderTasks()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {selectedTask && (
        <div className="UserOverlay" onClick={() => setSelectedTask(null)}>
          <div className="UserOverlayContent" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedTask.title}</h3>
            <p>Dependencies: None</p>
            <p>Task details:</p>
            <ul>
              <li>Assigned to: You</li>
              <li>Due date: 2025-12-10</li>
              <li>Status: {selectedTask.status}</li>
            </ul>
            <button onClick={() => setSelectedTask(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskUser;
