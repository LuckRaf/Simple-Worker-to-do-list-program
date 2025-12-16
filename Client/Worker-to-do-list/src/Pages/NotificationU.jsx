import React, { useState, useEffect } from "react";
import "./NotificationU.css";
import pfp from "/src/assets/checkmark.png";
import Sidebar from "../component/SideBarW.jsx";
import { useAuth } from "../context/AuthContext";

function NotificationU() {
  const { username, user_id } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:3000/notification/user/${user_id}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Fetch user notifications error:", err);
    }
  };

  return (
    <div className="NotifUserContainer">
      <Sidebar profilePic={pfp} username={username} />

      <div className="NotifUserContent">
        <h2 className="NotifUserTitle">My Notifications</h2>

        {notifications.length === 0 ? (
          <div className="NotifUserEmpty">No notifications</div>
        ) : (
          <ul className="NotifUserList">
            {notifications.map((notif, index) => (
              <li
                key={index}
                className={`NotifUserItem ${notif.is_read ? "read" : "unread"}`}
              >
                <span className="NotifUserIcon">
                  {notif.is_read ? "📩" : "🔔"}
                </span>

                <div className="NotifUserMessage">
                  <span className="NotifUserText">{notif.message}</span>
                  <span className="NotifUserTime">
                    {new Date(notif.created_at).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NotificationU;
