import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Importing the CSS file

function Dashboard() {
  return (
    <div className="container">
      {/* Information Section */}
      <div className="info-section">
        <h3>NAME - RISHI VERMA</h3>
        <p>DEGREE - BTECH CSE</p>
        <p>PASSOUT YEAR - 2025</p>
        
      </div>

      {/* Title for Technical Assignment */}
      <h2 className="title">Technical Project: Calendar Application for Communication Tracking</h2>
      
      {/* Metrics Section (Buttons) */}
      <div className="metricsContainer">
        <div className="metric">
          <Link to="/admin" className="metric-link">
            <h3>Admin</h3>
          </Link>
        </div>
        <div className="metric">
          <Link to="/client" className="metric-link">
            <h3>Client</h3>
          </Link>
        </div>
        <div className="metric">
          <Link to="/calender" className="metric-link">
            <h3>Client Calendar View</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
