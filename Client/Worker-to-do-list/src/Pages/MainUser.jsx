import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./MainUser.css";
import pfp from "/src/assets/checkmark.png";
import Sidebar from "../component/SideBarW.jsx";

function UserHome() {
  const { user_id } = useAuth();
  const { username } = useAuth();

  const [workData, setWorkData] = useState({
    Attended: 0,
    OnReview: 0,
    Completed: 0,
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
            Attended: data.Attended || 0,
            OnReview: data.OnReview || 0,
            Completed: data.Completed || 0,
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

  const Pending = Math.max(
    0,
    workData.Attended + workData.OnReview - workData.Completed
  );

  return (
    <div className="UserHomeContainer">
      <Sidebar profilePic={pfp} username={username} />

      <div className="UserHomeContent">
        <div className="UserWelcomeBox">
          Welcome, User {user_id ? `(${user_id})` : ""}
        </div>

        <div className="UserWorkCounter">
          <div className="UserWorkStatus pending">
            <span className="UserCounterLabel">Pending</span>
            <span className="UserCounterNumber">{Pending}</span>
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
              <div className="UserHistoryRow">
                <span className="UserHistoryIcon">📝</span>
                <span className="UserHistoryText">
                  You completed a task
                </span>
                <span className="UserHistoryTime">Recently</span>
              </div>

              <div className="UserHistoryRow">
                <span className="UserHistoryIcon">✔️</span>
                <span className="UserHistoryText">
                  Progress updated
                </span>
                <span className="UserHistoryTime">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
