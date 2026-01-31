/**
 * Autonomous System Dashboard
 * Monitor and control the autonomous email-to-project system
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AutonomousDashboard.css';

const API_BASE = 'http://localhost:8000';

const AutonomousDashboard = () => {
    const [systemStatus, setSystemStatus] = useState(null);
    const [projects, setProjects] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [recentDecisions, setRecentDecisions] = useState([]);
    const [loading, setLoading] = useState(true);
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

    // Fetch active projects
    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${API_BASE}/api/autonomous/projects`);
            setProjects(response.data.projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    // Check emails manually
    const checkEmails = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE}/api/autonomous/check-emails`);
            setEmailCheckResult(response.data);
            await fetchStatus();
            await fetchProjects();
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
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchStatus(),
                fetchTeamMembers(),
                fetchDecisions(),
                fetchProjects()
            ]);
            setLoading(false);
        };
        loadData();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchStatus();
            fetchProjects();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    if (loading && !systemStatus) {
        return <div className="loading">Loading autonomous system...</div>;
    }

    return (
        <div className="autonomous-dashboard">
            <header className="dashboard-header">
                <h1>🤖 Autonomous Email-to-Project System</h1>
                <p>Zero Manual Coordination Required</p>
            </header>

            {/* System Status */}
            <div className="status-section">
                <div className="status-card">
                    <h2>System Status</h2>
                    <div className="status-indicator">
                        <span className={`status-dot ${systemStatus?.status === 'running' ? 'active' : 'inactive'}`}></span>
                        <span className="status-text">{systemStatus?.status || 'Unknown'}</span>
                    </div>
                    <div className="stats-grid">
                        <div className="stat">
                            <div className="stat-value">{systemStatus?.stats?.emails_processed || 0}</div>
                            <div className="stat-label">Emails Processed</div>
                        </div>
                        <div className="stat">
                            <div className="stat-value">{systemStatus?.stats?.projects_created || 0}</div>
                            <div className="stat-label">Projects Created</div>
                        </div>
                        <div className="stat">
                            <div className="stat-value">{systemStatus?.stats?.active_projects || 0}</div>
                            <div className="stat-label">Active Projects</div>
                        </div>
                    </div>
                    <div className="action-buttons">
                        <button onClick={checkEmails} disabled={loading} className="btn-primary">
                            📧 Check Emails Now
                        </button>
                        <button onClick={testConnection} className="btn-secondary">
                            🔌 Test Connection
                        </button>
                    </div>
                </div>
            </div>

            {/* Email Check Result */}
            {emailCheckResult && (
                <div className={`alert ${emailCheckResult.success ? 'alert-success' : 'alert-error'}`}>
                    {emailCheckResult.success ? (
                        <>
                            <strong>✅ Email check complete!</strong>
                            <p>Found {emailCheckResult.emails_found} project email(s)</p>
                            {emailCheckResult.emails && emailCheckResult.emails.length > 0 && (
                                <ul>
                                    {emailCheckResult.emails.map((email, idx) => (
                                        <li key={idx}>
                                            <strong>{email.subject}</strong> from {email.from}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    ) : (
                        <>
                            <strong>❌ Error</strong>
                            <p>{emailCheckResult.error}</p>
                        </>
                    )}
                </div>
            )}

            {/* Team Members */}
            <div className="team-section">
                <h2>👥 Team Workload</h2>
                <div className="team-grid">
                    {teamMembers.map(member => (
                        <div key={member.id} className="team-card">
                            <h3>{member.name}</h3>
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
                                        backgroundColor: member.utilization > 80 ? '#ef4444' : member.utilization > 50 ? '#f59e0b' : '#10b981'
                                    }}
                                ></div>
                            </div>
                            <div className="workload-text">
                                {member.current_workload} / {member.max_capacity} days ({member.utilization}%)
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Decisions */}
            <div className="decisions-section">
                <h2>⚖️ Recent AI Decisions</h2>
                {recentDecisions.length > 0 ? (
                    <div className="decisions-list">
                        {recentDecisions.map((decision, idx) => (
                            <div key={idx} className="decision-card">
                                <div className="decision-header">
                                    <span className="project-id">{decision.project_id}</span>
                                    <span className={`priority-badge priority-${decision.priority_level.toLowerCase()}`}>
                                        {decision.priority_level}
                                    </span>
                                    <span className="priority-score">Score: {decision.priority_score}</span>
                                </div>
                                <div className="decision-reasoning">
                                    <strong>Reasoning:</strong>
                                    <ul>
                                        {decision.reasoning.map((reason, ridx) => (
                                            <li key={ridx}>{reason}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-data">No decisions yet. Check emails to process projects.</p>
                )}
            </div>

            {/* Active Projects */}
            <div className="projects-section">
                <h2>📊 Active Projects</h2>
                {projects.length > 0 ? (
                    <div className="projects-list">
                        {projects.map((project, idx) => (
                            <div key={idx} className="project-card">
                                <h3>{project.project_type}</h3>
                                <p><strong>Budget:</strong> Rs.{project.budget?.toLocaleString()}</p>
                                <p><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
                                <p><strong>Priority:</strong> {project.priority_level}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-data">No active projects. System will create projects from incoming emails.</p>
                )}
            </div>

            {/* Workflow Diagram */}
            <div className="workflow-section">
                <h2>🔄 Autonomous Workflow</h2>
                <div className="workflow-diagram">
                    <div className="workflow-step">
                        <div className="step-icon">📧</div>
                        <div className="step-title">Email Agent</div>
                        <div className="step-desc">Monitors inbox</div>
                    </div>
                    <div className="workflow-arrow">→</div>
                    <div className="workflow-step">
                        <div className="step-icon">🤖</div>
                        <div className="step-title">Requirement Agent</div>
                        <div className="step-desc">Extracts details</div>
                    </div>
                    <div className="workflow-arrow">→</div>
                    <div className="workflow-step">
                        <div className="step-icon">⚖️</div>
                        <div className="step-title">Decision Agent</div>
                        <div className="step-desc">Calculates priority</div>
                    </div>
                    <div className="workflow-arrow">→</div>
                    <div className="workflow-step">
                        <div className="step-icon">👥</div>
                        <div className="step-title">Team Agent</div>
                        <div className="step-desc">Assigns tasks</div>
                    </div>
                    <div className="workflow-arrow">→</div>
                    <div className="workflow-step">
                        <div className="step-icon">✉️</div>
                        <div className="step-title">Communication</div>
                        <div className="step-desc">Notifies client</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutonomousDashboard;
