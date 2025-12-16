import React, { useState, useEffect } from "react";
import './NotificationA.css';
import pfp from '/src/assets/checkmark.png';
import Sidebar from "../component/SideBarA.jsx";
import { useAuth } from "../context/AuthContext";

function NotificationA() {
  const { username, user_id } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");

  useEffect(() => {
    fetchNotifications();
    fetchWorkers();
  }, []);

  // Ambil notifikasi admin
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:3000/notification/admin/${user_id}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Fetch notifications error:", err);
    }
  };

  // Ambil daftar worker
  const fetchWorkers = async () => {
    try {
      const res = await fetch(`http://localhost:3000/notification/workers/${user_id}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setWorkers(data);

      // otomatis pilih worker pertama
      if (data.length > 0) setSelectedWorker(data[0].id);
    } catch (err) {
      console.error("Fetch workers error:", err);
    }
  };


  // Kirim notifikasi
  const sendNotification = async () => {
    if (!message.trim()) return;
    if (!selectedWorker) return alert("Please select a worker");

    try {
      const res = await fetch("http://localhost:3000/notification/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          worker_id: selectedWorker,
          admin_id: user_id
        })
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      setMessage("");
      setShowOverlay(false);
      fetchNotifications();
    } catch (err) {
      console.error("Send notification error:", err);
    }
  };

  return (
    <div className="NotifAdminContainer">
      <Sidebar profilePic={pfp} username={username} />

      <div className="NotifAdminContent">
        <h2 className="NotifAdminTitle">Notifications</h2>
        <button className="NotifAdminBtn" onClick={() => setShowOverlay(true)}>
          Create Notification
        </button>

        {notifications.length === 0 ? (
          <div className="NotifAdminEmpty">No new notifications</div>
        ) : (
          <ul className="NotifAdminList">
            {notifications.map((notif, index) => (
              <li
                key={index}
                className={`NotifAdminItem ${notif.is_read ? "read" : "unread"}`}
              >
                <span className="NotifAdminIcon">{notif.is_read ? "📢" : "🛠️"}</span>
                <div className="NotifAdminMessage">
                  <span className="NotifAdminItemTitle">{notif.message}</span>
                  <span className="NotifAdminTime">
                    {new Date(notif.created_at).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {showOverlay && (
          <div className="NotifAdminOverlay">
            <div className="NotifAdminOverlayContent">
              <h3 style={{ color: "black" }}>Create Notification {selectedWorker[1]}</h3>
              <textarea
                placeholder="Enter notification message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <select
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
              >
                {workers.length === 0 ? (
                  <option value="">No workers available</option>
                ) : (
                  workers.map((worker) => (
                    <option key={worker.id} value={worker.id}>
                      {worker.username}
                    </option>
                  ))
                )}
              </select>
              <div className="NotifAdminOverlayBtns">
                <button onClick={sendNotification}>Send</button>
                <button onClick={() => setShowOverlay(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationA;
