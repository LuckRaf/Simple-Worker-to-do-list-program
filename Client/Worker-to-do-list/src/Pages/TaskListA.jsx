import { useState } from 'react';
import './TaskListA.css';
import pfp from '/src/assets/PageRoutingTest.png';
import Sidebar from "../component/SideBarA.jsx";

function TaskA() {
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
        className="TaskItem"
        onClick={() => setSelectedTask(task)}
      >
        <div className="TaskTitle">{task.title}</div>
        <div className="TaskDependencies">Dependencies: None</div>
      </div>
    ));
  };

  return (
    <div className="TaskContainer">
      <Sidebar profilePic={pfp} username={"Admin"}/>
      <div className="AllTaskContainer"> 

        {/* Kanban title */}
        <h2 className="SectionTitle">Work Status</h2>
        <div className='KanbanModel'>
          {["UNATTENDED", "ATTENDED", "ON REVIEW", "DONE"].map((status, i) => (
            <div key={i} className='Tasksection'>
              <div className='TaskStatus'>{status}</div>
              <div className='TaskList'>{renderTasks()}</div>
            </div>
          ))}
        </div>

        {/* LogTable title */}
        <h2 className="SectionTitle">Task Status</h2>
        <div className='LogTable'>
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Attended By</th>
                <th>Status</th>
                <th>Verified By</th>
                <th>Date Taken</th>
                <th>Date Finished</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.title}</td>
                  <td>{task.status === "DONE" ? "John Doe" : "Jane Smith"}</td>
                  <td>{task.status}</td>
                  <td>{task.status === "DONE" ? "Admin" : "-"}</td>
                  <td>2025-12-01</td>
                  <td>{task.status === "DONE" ? "2025-12-02" : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overlay */}
      {selectedTask && (
        <div className="Overlay" onClick={() => setSelectedTask(null)}>
          <div className="OverlayContent" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedTask.title}</h3>
            <p>Dependencies: None</p>
            <p>Some random task info:</p>
            <ul>
              <li>Assigned to: John Doe</li>
              <li>Due date: 2025-12-10</li>
              <li>Status: In Progress</li>
            </ul>
            <button onClick={() => setSelectedTask(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskA;
