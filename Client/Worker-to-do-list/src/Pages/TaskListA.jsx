import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../component/SideBarA.jsx";
import pfp from "/src/assets/checkmark.png";
import "./TaskListA.css";

function TaskA() {
  const { user_id } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    Deadline: "",
    dependency: []
  });

  // ================= FETCH TASK =================
  useEffect(() => {
    if (!user_id) return;

    fetch(`http://localhost:3000/task/admin/${user_id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed fetch task");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setTasks(data);
        else setTasks([]);
      })
      .catch(() => setTasks([]));
  }, [user_id]);

  // ================= HELPER =================
// ================= PARSE DEPENDENCY STRING =================
// ================= PARSE DEPENDENCY STRING =================
const parseDependencyString = (depStr) => {
  if (!depStr || typeof depStr !== "string") return [];

  // hapus kutip luar jika ada
  let cleanStr = depStr.trim();
  if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
    cleanStr = cleanStr.slice(1, -1);
  }

  const result = [];
  let current = "";

  for (let i = 0; i < cleanStr.length; i++) {
    const char = cleanStr[i];

    if (char === "[" || char === "]" || char === " ") continue;
    else if (char === ",") {
      if (current.length > 0) {
        result.push(Number(current));
        current = "";
      }
    } else {
      current += char;
    }
  }

  if (current.length > 0) result.push(Number(current));

  return result;
};

// ================= RENDER DEPENDENCY TITLES =================
const renderDependencyTitles = (dependency) => {
  if (!dependency) return "-";

  // parsing string menjadi array angka
  const depArray = parseDependencyString(dependency);

  if (!Array.isArray(depArray) || depArray.length === 0) return "-";

  // mapping ID ke judul task
  return depArray
    .map(id => tasks.find(t => t.id === id)?.title || `#${id}`)
    .join(", ");
};







  // ================= CREATE TASK =================
  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.Deadline)
      return alert("Title & Deadline required");

    const res = await fetch("http://localhost:3000/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newTask, admin_id: user_id })
    });

    const data = await res.json();

    if (res.ok) {
      setTasks(prev => [data, ...prev]);
      setShowAdd(false);
      setNewTask({ title: "", description: "", Deadline: "", dependency: [] });
    } else {
      alert(data.message);
    }
  };

  // ================= PROCEED TASK =================
  const handleProceed = async task => {
  let depArray = [];
  try {
    depArray = JSON.parse(task.dependency || "[]");
  } catch {
    depArray = [];
  }

  // cek semua dependency
  const unmetDeps = depArray.filter(
    id => tasks.find(t => t.id === id)?.status !== "completed"
  );

  if (unmetDeps.length > 0) {
    alert("Cannot proceed. Dependency not done: " + unmetDeps.join(", "));
    return;
  }

  // jika semua dependency completed, proceed
  const res = await fetch(
    `http://localhost:3000/task/proceed/${task.id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id })
    }
  );

  const data = await res.json();
  if (!res.ok) return alert(data.message);

  setTasks(prev => prev.map(t => (t.id === task.id ? data : t)));
  setSelectedTask(null);
};


  // ================= RENDER TASK =================
  const renderTasks = status => {
    if (!Array.isArray(tasks)) return null;

    return tasks
      .filter(t => t.status === status)
      .map(task => (
        <div
          key={task.id}
          className="TaskItem"
          onClick={() => setSelectedTask(task)}
        >
          <div className="TaskTitle">{task.title}</div>

          <div className="TaskDependencies">
            Deadline:{" "}
            {task.Deadline
              ? new Date(task.Deadline).toLocaleDateString()
              : "-"}
          </div>

          <div className="TaskDependencies">
            Dependency: {renderDependencyTitles(task.dependency)}
          </div>

          <div className="TaskDependencies">
            Attended By: {task.attended_username || "-"}
          </div>
        </div>
      ));
  };

  return (
    <div className="TaskContainer">
      <Sidebar profilePic={pfp} username="Admin" />

      <div className="AllTaskContainer">
        <div className="WelcomeBox-Work">Work Status</div>

        <button onClick={() => setShowAdd(true)}>+ Add Task</button>

        <div className="KanbanModel">
          {[
            { key: "unattended", label: "UNATTENDED" },
            { key: "in_progress", label: "ATTENDED" },
            { key: "on_review", label: "ON REVIEW" },
            { key: "completed", label: "COMPLETED" }
          ].map(col => (
            <div key={col.key} className="Tasksection">
              <div className="TaskStatus">{col.label}</div>
              <div className="TaskList">{renderTasks(col.key)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD TASK OVERLAY */}
      {showAdd && (
  <div className="Overlay" onClick={() => setShowAdd(false)}>
    <div
      className="OverlayContent AddTaskOverlay"
      onClick={e => e.stopPropagation()}
    >
      <h3>Add Task</h3>

      <div className="FormGroup">
        <label>Title</label>
        <input
          placeholder="Task title"
          value={newTask.title}
          onChange={e =>
            setNewTask({ ...newTask, title: e.target.value })
          }
        />
      </div>

      <div className="FormGroup">
        <label>Description</label>
        <textarea
          placeholder="Task description"
          value={newTask.description}
          onChange={e =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
      </div>

      <div className="FormGroup">
        <label>Deadline</label>
        <input
          type="date"
          value={newTask.Deadline}
          onChange={e =>
            setNewTask({ ...newTask, Deadline: e.target.value })
          }
        />
      </div>

      <div className="FormGroup">
        <label>Dependency</label>

        <div className="DependencyBox">
          {tasks.length === 0 && (
            <div className="EmptyDependency">No task available</div>
          )}

          {tasks.map(t => (
            <label key={t.id} className="DependencyItem">
              <span>{t.title}</span>
              <input
                type="checkbox"
                value={t.id}
                checked={newTask.dependency.includes(t.id)}
                onChange={e => {
                  const id = Number(e.target.value);
                  setNewTask(prev => ({
                    ...prev,
                    dependency: e.target.checked
                      ? [...prev.dependency, id]
                      : prev.dependency.filter(d => d !== id)
                  }));
                }}
              />
         
            </label>
          ))}
        </div>
      </div>

      <div className="OverlayActions">
        <button onClick={handleCreateTask}>Create</button>
        <button className="CancelBtn" onClick={() => setShowAdd(false)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


      {/* DETAIL OVERLAY */}
      {selectedTask && (
        <div className="Overlay" onClick={() => setSelectedTask(null)}>
          <div className="OverlayContent" onClick={e => e.stopPropagation()}>
            <h3>{selectedTask.title}</h3>
            <p>{selectedTask.description}</p>
            <p>Status: {selectedTask.status}</p>
            <p>Dependency: {renderDependencyTitles(selectedTask.dependency)}</p>
            <p>Attended By: {selectedTask.attended_username || "-"}</p>

            <button onClick={() => handleProceed(selectedTask)}>
              Proceed
            </button>
            <button onClick={() => setSelectedTask(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskA;
