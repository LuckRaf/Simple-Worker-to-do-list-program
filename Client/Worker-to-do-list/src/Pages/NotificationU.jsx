import React from 'react';
import './NotificationU.css';
import pfp from '/src/assets/checkmark.png';
import Sidebar from "../component/SideBarW.jsx";

function NotificationUser() {
  const notifications = [
    { type: "announcement", title: "Meeting Reminder", message: "Don't forget the team meeting at 10 AM", time: "5 mins ago" },
    { type: "admin", title: "Task Update", message: "Your task 'Fix Login Bug' has been verified", time: "30 mins ago" },
    { type: "announcement", title: "Holiday Notice", message: "Office will be closed on 25th December", time: "1 hour ago" },
  ];

  return (
    <div className="UserNotifContainer">
      <Sidebar profilePic={pfp} username={"User"} />

      <div className="UserNotifContent">
        <h2 className="UserNotifTitle">Notifications</h2>
        <ul className="UserNotifList">
          {notifications.map((notif, index) => (
            <li key={index} className={`UserNotifItem ${notif.type}`}>
              <span className="UserNotifIcon">{notif.type === "admin" ? "🛠️" : "📢"}</span>
              <div className="UserNotifText">
                <span className="UserNotifItemTitle">{notif.title}</span>
                <span className="UserNotifItemMessage">{notif.message}</span>
              </div>
              <span className="UserNotifTime">{notif.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default NotificationUser;
