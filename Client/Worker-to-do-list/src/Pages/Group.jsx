import { useEffect, useState } from "react";
import "./Group.css";
import pfp from "/src/assets/checkmark.png";
import SidebarA from "../component/SideBarA.jsx";
import SidebarU from "../component/SideBarW.jsx";
import { useAuth } from "../context/AuthContext";

function Productivity() {
  const { user_id, account_type } = useAuth();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!user_id) return;

    const fetchGroup = async () => {
      try {
        const res = await fetch(`http://localhost:3000/group/${user_id}`);
        const data = await res.json();

        if (data.success) {
          setMembers(data.members);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchGroup();
  }, [user_id]);

  return (
    <div className="GroupContainer">
      {account_type === "admin" ? (
        <SidebarA profilePic={pfp} username="Admin" />
      ) : (
        <SidebarU profilePic={pfp} username="User" />
      )}

      <div className="GroupContent">
        <h2 className="GroupTitle">Team Members</h2>

        <ul className="GroupList">
          {members.map((member) => (
            <li key={member.id} className={`GroupItem ${member.role}`}>
              <span className="GroupIcon">
                {member.role === "admin" ? "🛡️" : "👤"}
              </span>

              <div className="GroupText">
                <span className="GroupName">{member.full_name}</span>
                <span className="GroupUsername">@{member.username}</span>
              </div>

              <span className="GroupRole">{member.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Productivity;
