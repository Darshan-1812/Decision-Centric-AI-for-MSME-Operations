import React, { useState } from 'react';
import './StaffInterface.css';

const StaffInterface = ({ staffId = "S1" }) => {
  const [tasks, setTasks] = useState([
    {
      task_id: 'T101',
      name: 'Pack Order #124',
      deadline: '4 hours',
      priority: 'high',
      status: 'pending'
    },
    {
      task_id: 'T102',
      name: 'Quality Check - Batch 45',
      deadline: '8 hours',
      priority: 'medium',
      status: 'pending'
    },
    {
      task_id: 'T103',
      name: 'Inventory Count - Section A',
      deadline: '1 day',
      priority: 'low',
      status: 'pending'
    }
  ]);

  const handleStart = (taskId) => {
    setTasks(tasks.map(task => 
      task.task_id === taskId 
        ? { ...task, status: 'in-progress' }
        : task
    ));
  };

  const handleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.task_id === taskId 
        ? { ...task, status: 'completed' }
        : task
    ));
  };

  return (
    <div className="staff-interface">
      <header className="staff-header">
        <h1>My Tasks</h1>
        <div className="staff-info">Staff ID: {staffId}</div>
      </header>

      <div className="task-list">
        {tasks.map(task => (
          <div 
            key={task.task_id} 
            className={`task-card ${task.priority}`}
          >
            <div className="task-header">
              <h3>{task.name}</h3>
              <span className={`priority-badge ${task.priority}`}>
                {task.priority}
              </span>
            </div>
            
            <div className="task-details">
              <div className="detail-item">
                <span className="label">Deadline:</span>
                <span className="value">{task.deadline}</span>
              </div>
              <div className="detail-item">
                <span className="label">Task ID:</span>
                <span className="value">{task.task_id}</span>
              </div>
            </div>

            <div className="task-actions">
              {task.status === 'pending' && (
                <button 
                  className="btn-start"
                  onClick={() => handleStart(task.task_id)}
                >
                  ▶ Start Task
                </button>
              )}
              
              {task.status === 'in-progress' && (
                <button 
                  className="btn-complete"
                  onClick={() => handleComplete(task.task_id)}
                >
                  ✓ Mark as Done
                </button>
              )}
              
              {task.status === 'completed' && (
                <button className="btn-completed" disabled>
                  ✓ Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {tasks.filter(t => t.status !== 'completed').length === 0 && (
        <div className="no-tasks">
          <h2>🎉 All tasks completed!</h2>
          <p>Great work! Check back later for new assignments.</p>
        </div>
      )}
    </div>
  );
};

export default StaffInterface;
