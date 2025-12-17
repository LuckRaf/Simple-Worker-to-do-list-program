import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import './ProfileUser.css';
import pfp from '/src/assets/checkmark.png';

import SidebarA from "../component/SideBarA.jsx";
import SidebarU from "../component/SideBarW.jsx";

function ProfileUser() {
  const { username, role, user_id } = useAuth();
  const [userData, setUserData] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (!user_id) return;

    // Ambil data utama user
    fetch(`http://localhost:3000/user/work-data/${user_id}`)
      .then(res => res.json())
      .then(data => {
        // Ambil completed task
        fetch(`http://localhost:3000/user/completed-work/${user_id}`)
          .then(res2 => res2.json())
          .then(completedData => {
            setUserData({
              ...data,
              totalTasks: completedData ? completedData.Completed : 0
            });
          })
          .catch(err2 => {
            console.error("Failed to fetch completed tasks:", err2);
            setUserData({
              ...data,
              totalTasks: 0
            });
          });
      })
      .catch(err => {
        console.error("Failed to fetch user data:", err);
        setUserData(null);
      });
  }, [user_id]);

  if (!userData) return <div>Loading...</div>;

  const {
    name,
    role: userRole,
    email,
    totalTasks,
    history,
    created_at,
    workcode
  } = userData;

  const SidebarComponent = userRole === "admin" ? SidebarA : SidebarU;

  return (
    <div className="UserProfileContainer">
      <SidebarComponent profilePic={pfp} username={username || name} />

      <div className="UserProfileContent">
        {/* Nama & Data Singkat */}
        <div className="UserProfileHeader">
          <h2 className="UserName">{name}</h2>
          <p className="UserRole">{userRole} </p>
          <p className="UserEmail">{email}</p>
          <p className="UserJoinedAt">Joined at: {formatDate(created_at)}</p>
        </div>

        {/* Total pekerjaan */}
        <div className="UserTotalTasks">
          <span className="UserTotalLabel">Total Tasks Completed</span>
          <span className="UserTotalNumber">{totalTasks}</span>

          <div className="TaskProgressBar">
            <div
              className="TaskProgressFill"
              style={{ width: `${Math.min(totalTasks, 100)}%` }}
            />
          </div>
        </div>

        {/* History */}
        <div className="UserHistoryBox">
          <h3 className="UserHistoryTitle">Recent Activities</h3>
          <div className="UserHistoryList">
            {history && history.length > 0 ? (
              history.map((item, index) => (
                <div key={index} className="UserHistoryRow">
                  <span className="UserHistoryIcon">📝</span>
                  <span className="UserHistoryText">{item.task}</span>
                  <span className="UserHistoryTime">{item.time}</span>
                </div>
              ))
            ) : (
              <div className="UserHistoryRow">
                <span className="UserHistoryText">
                  {totalTasks === 0 ? "No tasks completed yet" : "No recent activities"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Workcode */}
        {workcode && (
          <div className="UserWorkcode">
            <span className="WorkcodeLabel">Workcode:</span>
            <span className="WorkcodeValue">{workcode}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileUser;
