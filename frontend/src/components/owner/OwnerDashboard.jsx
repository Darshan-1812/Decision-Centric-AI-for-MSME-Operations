import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OwnerDashboard.css';

const API_BASE = 'http://localhost:8000';

const OwnerDashboard = () => {
  const [systemStatus, setSystemStatus] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [recentDecisions, setRecentDecisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailCheckResult, setEmailCheckResult] = useState(null);

  // Fetch system status
  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/autonomous/status`);
      setSystemStatus(response.data);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/autonomous/team-members`);
      setTeamMembers(response.data.team_members);
    } catch (error) {
      console.error('Error fetching team:', error);
    }
  };

  // Fetch recent decisions
  const fetchDecisions = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/autonomous/recent-decisions`);
      setRecentDecisions(response.data.decisions);
    } catch (error) {
      console.error('Error fetching decisions:', error);
    }
  };

  // Check emails manually
  const checkEmails = async () => {
    setLoading(true);
    setEmailCheckResult(null);
    try {
      const response = await axios.post(`${API_BASE}/api/autonomous/check-emails`);
      setEmailCheckResult(response.data);
      await fetchStatus();
    } catch (error) {
      console.error('Error checking emails:', error);
      setEmailCheckResult({ success: false, error: error.message });
    }
    setLoading(false);
  };

  // Test email connection
  const testConnection = async () => {
    try {
      const response = await axios.post(`${API_BASE}/api/autonomous/test-connection`);
      alert(response.data.message);
    } catch (error) {
      alert('Connection test failed: ' + error.message);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchStatus();
    fetchTeamMembers();
    fetchDecisions();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStatus();
      fetchDecisions();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="owner-dashboard">
      <header className="dashboard-header">
        <h1>🤖 Autonomous MSME Operations</h1>
        <div className="user-info">
          <span className={`status-indicator ${systemStatus?.status === 'running' ? 'active' : ''}`}>
            ● {systemStatus?.status || 'Unknown'}
          </span>
        </div>
      </header>

      {/* Email Check Result Alert */}
      {emailCheckResult && (
        <div className={`alert ${emailCheckResult.success ? 'alert-success' : 'alert-error'}`}>
          {emailCheckResult.success ? (
            <>
              <strong>✅ Email check complete!</strong> Found {emailCheckResult.emails_found} project email(s)
              {emailCheckResult.emails && emailCheckResult.emails.length > 0 && (
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  {emailCheckResult.emails.map((email, idx) => (
                    <li key={idx}><strong>{email.subject}</strong> from {email.from}</li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <><strong>❌ Error:</strong> {emailCheckResult.error}</>
          )}
        </div>
      )}

      {/* Top Section - Overview Cards */}
      <section className="overview-cards">
        <div className="card">
          <h3>📧 Emails Processed</h3>
          <div className="card-value">{systemStatus?.stats?.emails_processed || 0}</div>
          <span className="card-trend">Autonomous monitoring</span>
        </div>

        <div className="card">
          <h3>📊 Active Projects</h3>
          <div className="card-value">{systemStatus?.stats?.projects_created || 0}</div>
          <span className="card-trend">AI-managed</span>
        </div>

        <div className="card">
          <h3>👥 Team Members</h3>
          <div className="card-value">{teamMembers.length}</div>
          <span className="card-trend">
            {teamMembers.filter(m => m.utilization > 80).length} overloaded
          </span>
        </div>

        <div className="card">
          <h3>⚖️ AI Decisions</h3>
          <div className="card-value">{recentDecisions.length}</div>
          <span className="card-trend">Auto-prioritized</span>
        </div>
      </section>

      {/* Email Actions */}
      <section className="email-actions">
        <button onClick={checkEmails} disabled={loading} className="btn-primary">
          📧 {loading ? 'Checking...' : 'Check Emails Now'}
        </button>
        <button onClick={testConnection} className="btn-secondary">
          🔌 Test Gmail Connection
        </button>
      </section>

      {/* Team Workload Section */}
      <section className="team-workload">
        <h2>👥 Team Workload & Capacity</h2>
        <div className="team-grid">
          {teamMembers.map(member => (
            <div key={member.id} className="team-member-card">
              <div className="member-header">
                <h3>{member.name}</h3>
                <span className={`utilization-badge ${member.utilization > 80 ? 'high' :
                    member.utilization > 50 ? 'medium' : 'low'
                  }`}>
                  {member.utilization}%
                </span>
              </div>
              <div className="skills">
                {member.skills.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
              <div className="workload-bar">
                <div
                  className="workload-fill"
                  style={{
                    width: `${member.utilization}%`,
                    backgroundColor: member.utilization > 80 ? '#ef4444' :
                      member.utilization > 50 ? '#f59e0b' : '#10b981'
                  }}
                ></div>
              </div>
              <div className="workload-text">
                {member.current_workload} / {member.max_capacity} days
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Decisions Feed */}
      <section className="ai-decisions">
        <h2>🧠 AI Decision Feed</h2>
        <div className="decision-list">
          {recentDecisions.length > 0 ? (
            recentDecisions.map((decision, idx) => (
              <div key={idx} className="decision-item">
                <div className="decision-icon">⚖️</div>
                <div className="decision-content">
                  <h4>Project Prioritized: {decision.project_id}</h4>
                  <div className="priority-info">
                    <span className={`priority-badge ${decision.priority_level.toLowerCase()}`}>
                      {decision.priority_level}
                    </span>
                    <span className="priority-score">Score: {decision.priority_score}</span>
                  </div>
                  <p><strong>Reasoning:</strong></p>
                  <ul>
                    {decision.reasoning.map((reason, ridx) => (
                      <li key={ridx}>{reason}</li>
                    ))}
                  </ul>
                  <span className="decision-time">Just now</span>
                </div>
                <div className="decision-actions">
                  <button className="btn-approved">✓ Auto-Approved</button>
                </div>
              </div>
            ))
          ) : (
            <div className="decision-item">
              <div className="decision-icon">📧</div>
              <div className="decision-content">
                <h4>Waiting for Project Emails</h4>
                <p>Click "Check Emails Now" to scan inbox for new project requests</p>
                <span className="decision-time">System ready</span>
              </div>
              <div className="decision-actions">
                <button className="btn-view" onClick={checkEmails}>Check Now</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Autonomous Workflow Info */}
      <section className="workflow-info">
        <h2>🔄 Autonomous Workflow</h2>
        <div className="workflow-steps">
          <div className="workflow-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>📧 Email Monitoring</h4>
              <p>Scans darshangirase18@gmail.com for project requests</p>
            </div>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>🤖 AI Extraction</h4>
              <p>Extracts budget, deadline, requirements</p>
            </div>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>⚖️ Priority Scoring</h4>
              <p>40% deadline + 25% payment + 15% value</p>
            </div>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>👥 Team Assignment</h4>
              <p>Auto-assigns based on skills & workload</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OwnerDashboard;
