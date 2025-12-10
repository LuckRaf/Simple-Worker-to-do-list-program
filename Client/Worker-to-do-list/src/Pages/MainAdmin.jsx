import { useState } from 'react'
import './MainAdmin.css'
import pfp from '/src/assets/checkmark.png';
import Sidebar from "../component/SideBarA.jsx";

function MainAdmin() {

  return (
    <div className="AdminHome">
      <Sidebar profilePic={pfp} username={"Admin"} />

      <div className="HomeA">
        <div className="WelcomeBox">
          Welcome, Admin
        </div>
        <div className="WorkCounter">
        </div>
    

        <div className="WorkCounter">
          <div className="WorkCounterStatus attended">
            <span className="CounterLabel">Attended</span>
            <span className="CounterNumber">20</span>
          </div>

          <div className="WorkCounterStatus unattended">
            <span className="CounterLabel">Unattended</span>
            <span className="CounterNumber">20</span>
          </div>

          <div className="WorkCounterStatus review">
            <span className="CounterLabel">On Review</span>
            <span className="CounterNumber">20</span>
          </div>

          <div className="WorkCounterStatus completed">
            <span className="CounterLabel">Completed</span>
            <span className="CounterNumber">20</span>
          </div>
        </div>
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

          {/* RIGHT: Work Done Today */}
          <div className="BoxCard WorkDoneBox">
            <h3 className="BoxTitle">Work Done Today</h3>

            <div className="WorkDoneContent">
              <span className="WorkDoneNumber">12</span>
              <span className="WorkDoneLabel">Tasks Completed</span>
            </div>
          </div>

        </div>



      </div>
    </div>
  )
}

export default MainAdmin
