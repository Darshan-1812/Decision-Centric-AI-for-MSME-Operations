import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OwnerDashboard from './components/owner/OwnerDashboard';
import StaffInterface from './components/staff/StaffInterface';
import AutonomousDashboard from './components/autonomous/AutonomousDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="main-nav">
          <div className="nav-brand">
            <h2>🤖 MSME AI Operations</h2>
          </div>
          <div className="nav-links">
            <Link to="/autonomous">Autonomous System</Link>
            <Link to="/owner">Owner Dashboard</Link>
            <Link to="/staff">Staff Interface</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/autonomous" element={<AutonomousDashboard />} />
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/staff" element={<StaffInterface />} />
        </Routes>
      </div>
    </Router>
  );
}

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>Decision-Centric AI for MSME Operations</h1>
        <p className="tagline">
          One unified platform where AI decides, staff executes, and owners oversee.
        </p>

        <div className="cta-buttons">
          <Link to="/autonomous" className="btn-primary">
            🤖 Autonomous System
          </Link>
          <Link to="/owner" className="btn-secondary">
            👑 Owner Dashboard
          </Link>
          <Link to="/staff" className="btn-secondary">
            👷 Staff Interface
          </Link>
        </div>
      </div>

      <section className="features">
        <div className="feature">
          <h3>🎯 Autonomous Decision Making</h3>
          <p>AI agents continuously monitor operations and make coordinated decisions</p>
        </div>
        <div className="feature">
          <h3>📧 Email-to-Project Automation</h3>
          <p>Client emails automatically become managed projects with zero manual coordination</p>
        </div>
        <div className="feature">
          <h3>⚡ Automatic Task Assignment</h3>
          <p>Staff automatically receive prioritized tasks based on skills and availability</p>
        </div>
      </section>
    </div>
  );
};

export default App;
