import React from 'react';
import './ProfileUser.css';
import pfp from '/src/assets/checkmark.png';

import SidebarA from "../component/SideBarA.jsx";
import SidebarU from "../component/SideBarW.jsx";

function ProfileUser() {
  const user = {
    name: "John Doe",
    role: "Staff",
    department: "IT",
    email: "john.doe@example.com",
    totalTasks: 35,
    history: [
      { task: "Fix Login Bug", time: "10 mins ago" },
      { task: "Upload Project Plan", time: "30 mins ago" },
      { task: "Update Task X", time: "1 hour ago" },
    ]
  };

  return (
    <div className="UserProfileContainer">
      <SidebarU profilePic={pfp} username="test" />

      <div className="UserProfileContent">
        {/* Nama & Data Singkat */}
        <div className="UserProfileHeader">
          <h2 className="UserName">{user.name}</h2>
          <p className="UserRole">{user.role} - {user.department}</p>
          <p className="UserEmail">{user.email}</p>
        </div>

        {/* Total pekerjaan */}
        <div className="UserTotalTasks">
          <span className="UserTotalLabel">Total Tasks Completed</span>
          <span className="UserTotalNumber">{user.totalTasks}</span>
        </div>

        {/* History */}
        <div className="UserHistoryBox">
          <h3 className="UserHistoryTitle">Recent Activities</h3>
          <div className="UserHistoryList">
            {user.history.map((item, index) => (
              <div key={index} className="UserHistoryRow">
                <span className="UserHistoryIcon">📝</span>
                <span className="UserHistoryText">{item.task}</span>
                <span className="UserHistoryTime">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileUser;
