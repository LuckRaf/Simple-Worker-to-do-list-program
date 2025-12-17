import { useState, useEffect } from "react";
import Sidebar from "../component/SideBarW.jsx";
import { useAuth } from "../context/AuthContext";
import pfp from '/src/assets/checkmark.png';
import './TaskU.css';

function TaskUser() {
  const { user_id } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  // ================= FETCH TASK =================
  useEffect(() => {
    if (!user_id) return;

    fetch(`http://localhost:3000/task/user/${user_id}`)
      .then(res => res.json())
      .then(data => setTasks(Array.isArray(data) ? data : []))
      .catch(() => setTasks([]));
  }, [user_id]);

  // ================= HELPER =================
  const renderDependencyTitles = (dep) => {
  if (!dep) return "-"; // null atau undefined
  try {
    const arr = JSON.parse(dep);
    if (!arr || arr.length === 0) return "-"; // kosong
    return arr.map(id => tasks.find(t => t.id === id)?.title || `#${id}`).join(", ");
  } catch {
    return "-"; // jika parsing gagal
  }
};


const handleProceed = async (task) => {
  // hanya boleh proceed jika status bukan COMPLETED
  if (task.status === "completed") {
    return alert("Cannot proceed this task (Already completed)");
  }

  // cek dependency (hanya untuk UNATTENDED)
  if (task.status === "unattended") {
    const depIds = task.dependency ? JSON.parse(task.dependency) : [];
    const depNotDone = depIds.some(id => tasks.find(t => t.id === id)?.status !== "completed");
    if (depNotDone) {
      return alert("Dependency not done");
    }
  }

  try {
    const res = await fetch(`http://localhost:3000/task/proceed-worker/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Failed to proceed task");

    setTasks(prev => prev.map(t => (t.id === task.id ? data : t)));
    setSelectedTask(null);
  } catch (err) {
    alert("Error connecting to server");
  }
};


  // ================= RENDER TASK =================
  const renderTasks = (status) => {
    return tasks
      .filter(t => {
        const statusMap = {
          unattended: "UNATTENDED",
          in_progress: "ATTENDED",
          on_review: "ON REVIEW",
          completed: "COMPLETED"
        };
        return statusMap[t.status] === status;
      })
      .map(task => (
        <div key={task.id} className="UserTaskItem" onClick={() => setSelectedTask(task)}>
          <div className="UserTaskTitle">{task.title}</div>
          <div className="UserTaskDependencies">Dependency: {renderDependencyTitles(task.dependency)}</div>
          <div className="UserTaskDeadline">Due: {formatDate(task.Deadline)}</div>
        </div>
      ));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="UserTaskContainer">
      <Sidebar profilePic={pfp} username={"User"} />

      <div className="UserAllTaskContainer"> 
        <div className="UserWelcomeBox-Work">Work</div>

        <div className='UserKanbanModel'>
          {["UNATTENDED", "ATTENDED", "ON REVIEW", "COMPLETED"].map((status, i) => (
            <div key={i} className='UserTaskSection'>
              <div className='UserTaskStatus'>{status}</div>
              <div className='UserTaskList'>{renderTasks(status)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {selectedTask && (
        <div className="UserOverlay" onClick={() => setSelectedTask(null)}>
          <div className="UserOverlayContent" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedTask.title}</h3>
            <p>Dependencies: {renderDependencyTitles(selectedTask.dependency)}</p>
            <p>Task details:</p>
            <ul>
              <li>Assigned to: {selectedTask.attended_username || "Unassigned"}</li>
              <li>Due date: {formatDate(selectedTask.Deadline)}</li>
              <li>Status: {selectedTask.status}</li>
            </ul>
            {(selectedTask.status === "unattended" || selectedTask.status === "in_progress") && (
              <button onClick={() => handleProceed(selectedTask)}>Proceed</button>
            )}

            <button onClick={() => setSelectedTask(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskUser;
