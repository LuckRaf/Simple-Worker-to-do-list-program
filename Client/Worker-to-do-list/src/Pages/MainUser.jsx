import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./MainUser.css";
import pfp from "/src/assets/checkmark.png";
import Sidebar from "../component/SideBarW.jsx";

function UserHome() {
  const { user_id, username } = useAuth();

  const [workData, setWorkData] = useState({
    Unattended: 0,
    Attended: 0,
    OnReview: 0,
    Completed: 0,
    history: [],
  });

  // Fetch user work data
  useEffect(() => {
    if (!user_id) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/user/work-data/${user_id}`);
        const data = await res.json();

        if (res.ok) {
          setWorkData({
            Attended: data.tasks.attended || 99,
            OnReview: data.tasks.on_review || 99,
            Completed:data.tasks.completed || 99,
            history: Array.isArray(data.history) ? data.history : [],
          });
        } else {
          console.error("Failed to fetch user data:", data.message);
        }
      } catch (err) {
        console.error("Server error:", err);
      }
    };

    fetchUserData();
  }, [user_id]);

  // Pending = total tasks not completed yet (unattended + attended + on review)
  const Pending =
    (workData.Unattended || 0) +
    (workData.Attended || 0) +
    (workData.OnReview || 0);

  return (
    <div className="UserHomeContainer">
      <Sidebar profilePic={pfp} username={username} />

      <div className="UserHomeContent">
        <div className="UserWelcomeBox">
          Welcome, {username} {user_id ? `(${user_id})` : ""}
        </div>

        <div className="UserWorkCounter">
          <div className="UserWorkStatus pending">
            <span className="UserCounterLabel">Pending</span>
            <span className="UserCounterNumber">{workData.Attended}</span>
          </div>

          <div className="UserWorkStatus inprogress">
            <span className="UserCounterLabel">On Review</span>
            <span className="UserCounterNumber">{workData.OnReview}</span>
          </div>

          <div className="UserWorkStatus completed">
            <span className="UserCounterLabel">Completed</span>
            <span className="UserCounterNumber">{workData.Completed}</span>
          </div>
        </div>

        {/* LOWER SECTION */}
        <div className="UserLowerSection">
          <div className="UserBoxCard UserHistoryBox">
            <h3 className="UserBoxTitle">My Recent Tasks</h3>

            <div className="UserHistoryList">
              {workData.history.length > 0 ? (
                workData.history.map((item, index) => (
                  <div key={index} className="UserHistoryRow">
                    <span className="UserHistoryIcon">📝</span>
                    <span className="UserHistoryText">{item.task}</span>
                    <span className="UserHistoryTime">{item.time}</span>
                  </div>
                ))
              ) : (
                <div className="UserHistoryRow">
                  <span className="UserHistoryText">None</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
