import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import pfp from "/src/assets/checkmark.png";
import Sidebar from "../component/SideBarA.jsx";
import "./MainAdmin.css";

function MainAdmin() {
  const { user_id } = useAuth(); // Ambil user_id dari context

  const [workData, setWorkData] = useState({
    Attended: 9999,
    OnReview: 999,
    Completed: 9999,
  });

  // Fetch admin group data dari backend
  useEffect(() => {
    if (!user_id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/admin/group-data/${user_id}`);
        const data = await res.json();

        if (res.ok) {
          setWorkData({
            Attended: data.totalAttended || 0,
            OnReview: data.totalOnReview || 0,
            Completed: data.totalCompleted || 0,
          });
        } else {
          console.error("Failed to fetch admin group data:", data.message);
        }
      } catch (err) {
        console.error("Server error:", err);
      }
    };

    fetchData();
  }, [user_id]);

  // Hitung Unattended (misal total task = sum semua)
  const totalTasks = workData.Attended + workData.OnReview + workData.Completed;
  const Unattended = Math.max(0, totalTasks - workData.Attended); // Bisa disesuaikan logikanya

  return (
    <div className="AdminHome">
      <Sidebar profilePic={pfp} username={`Admin (${user_id})`} />

      <div className="HomeA">
        <div className="WelcomeBox">
          Welcome, Admin {user_id ? `(${user_id})` : ""}
        </div>

        <div className="WorkCounter">
          <div className="WorkCounterStatus attended">
            <span className="CounterLabel">Attended</span>
            <span className="CounterNumber">{workData.Attended}</span>
          </div>

          <div className="WorkCounterStatus unattended">
            <span className="CounterLabel">Unattended</span>
            <span className="CounterNumber">{Unattended}</span>
          </div>

          <div className="WorkCounterStatus review">
            <span className="CounterLabel">On Review</span>
            <span className="CounterNumber">{workData.OnReview}</span>
          </div>

          <div className="WorkCounterStatus completed">
            <span className="CounterLabel">Completed</span>
            <span className="CounterNumber">{workData.Completed}</span>
          </div>
        </div>

        {/* bagian bawah tetap */}
        <div className="LowerSection">
          <div className="BoxCard HistoryBox">
            <h3 className="BoxTitle">Recent Activity</h3>
            <div className="HistoryList">
              <div className="HistoryRow">
                <span className="HistoryIcon">📝</span>
                <span className="HistoryText">Rina completed task "Fix Login Bug"</span>
                <span className="HistoryTime">10 mins ago</span>
              </div>
              <div className="HistoryRow">
                <span className="HistoryIcon">📤</span>
                <span className="HistoryText">Diko uploaded a document</span>
                <span className="HistoryTime">30 mins ago</span>
              </div>
              <div className="HistoryRow">
                <span className="HistoryIcon">✔️</span>
                <span className="HistoryText">Andi updated progress on Project X</span>
                <span className="HistoryTime">1 hour ago</span>
              </div>
            </div>
          </div>

          <div className="BoxCard WorkDoneBox">
            <h3 className="BoxTitle">Work Done Today</h3>
            <div className="WorkDoneContent">
              <span className="WorkDoneNumber">{workData.Completed}</span>
              <span className="WorkDoneLabel">Tasks Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainAdmin;
