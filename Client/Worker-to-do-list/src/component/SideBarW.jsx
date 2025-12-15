import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SideBarA.css';
import check from '/src/assets/checkmark.png';


function SideBarA({ profilePic, username }) {
    const navigate = useNavigate();
    const location = useLocation();
    const menuItems = [ 
    { path: '/mainUser', icon: check, label: 'Home' },
    { path: '/ProfileU', icon: check, label: 'Profile' },
    { path: '/NotificationU', icon: check, label: 'Notification' },
    { path: '/taskListU', icon: check, label: 'Task List' },
    { path: '/Group', icon: check, label: 'Group' },
    { path: '/logout', icon: check, label: 'Log Out' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="sidebar">
        {/* Profile Section */}
        <div className="sidebar-section">
            <h1>MANAGEMENT</h1>
            <img 
                src={profilePic || '/PageRoutingTest.png'} 
                alt={username || 'Profile'} 
                className="sidebar-pic" 
            />
            {username && <p className="sidebar-username">{username}</p>}
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
        <p><b>MAIN MENU</b></p>
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <img src={item.icon} alt={item.label} className="sidebar-icon" />
            {item.label}
          </button>
        ))}
        

        
      </nav>
    </aside>
    )

}

export default SideBarA; 