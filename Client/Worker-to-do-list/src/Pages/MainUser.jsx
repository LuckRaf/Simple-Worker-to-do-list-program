import { useState } from 'react';
import './MainUser.css';
import pfp from '/src/assets/checkmark.png';
import Sidebar from "../component/SideBarW.jsx";

function UserHome() {

  return (
    <div className="UserHomeContainer">
      <Sidebar profilePic={pfp} username={"User"} />

      <div className="UserHomeContent">
        <div className="UserWelcomeBox">
          Welcome, User
        </div>

        <div className="UserWorkCounter">
          <div className="UserWorkStatus pending">
            <span className="UserCounterLabel">Pending</span>
            <span className="UserCounterNumber">5</span>
          </div>

          <div className="UserWorkStatus inprogress">
            <span className="UserCounterLabel">In Progress</span>
            <span className="UserCounterNumber">8</span>
          </div>

          <div className="UserWorkStatus completed">
            <span className="UserCounterLabel">Completed</span>
            <span className="UserCounterNumber">12</span>
          </div>
        </div>

        <div className="UserLowerSection">
          <div className="UserBoxCard UserHistoryBox">
            <h3 className="UserBoxTitle">My Recent Tasks</h3>

            <div className="UserHistoryList">
              <div className="UserHistoryRow">
                <span className="UserHistoryIcon">📝</span>
                <span className="UserHistoryText">You completed task "Fix Login Bug"</span>
                <span className="UserHistoryTime">10 mins ago</span>
              </div>

              <div className="UserHistoryRow">
                <span className="UserHistoryIcon">📤</span>
                <span className="UserHistoryText">You uploaded document "Project Plan"</span>
                <span className="UserHistoryTime">30 mins ago</span>
              </div>

              <div className="UserHistoryRow">
                <span className="UserHistoryIcon">✔️</span>
                <span className="UserHistoryText">You updated progress on Task X</span>
                <span className="UserHistoryTime">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default UserHome;
