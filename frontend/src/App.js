import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const API_URL = 'http://3.120.139.109:5000/api';

function Pomodoro() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const WORK_TIME = workMinutes * 60;
  const BREAK_TIME = breakMinutes * 60;

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(workMinutes * 60);
  }, [workMinutes]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (!isBreak) {
            setPomodoroCount(c => c + 1);
            setIsBreak(true);
            return BREAK_TIME;
          } else {
            setIsBreak(false);
            return WORK_TIME;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isBreak, WORK_TIME, BREAK_TIME]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const progress = isBreak
    ? ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100
    : ((WORK_TIME - timeLeft) / WORK_TIME) * 100;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const applySettings = () => {
    setIsEditing(false);
    reset();
  };

  return (
    <div className="pomodoro">
      <h2 className="pomodoro-title">
        {isBreak ? '☕ Mola Zamanı' : '🍅 Pomodoro'}
      </h2>

      {isEditing ? (
        <div className="pomodoro-settings">
          <div className="setting-row">
            <label>Çalışma (dk)</label>
            <input
              type="number"
              value={workMinutes}
              min="1"
              max="60"
              onChange={(e) => setWorkMinutes(Number(e.target.value))}
            />
          </div>
          <div className="setting-row">
            <label>Mola (dk)</label>
            <input
              type="number"
              value={breakMinutes}
              min="1"
              max="30"
              onChange={(e) => setBreakMinutes(Number(e.target.value))}
            />
          </div>
          <button className="pomo-btn start" onClick={applySettings}>
            ✓ Uygula
          </button>
        </div>
      ) : (
        <>
          <div className="pomodoro-circle">
            <svg viewBox="0 0 120 120" className="circle-svg">
              <circle cx="60" cy="60" r={radius} className="circle-bg" />
              <circle
                cx="60" cy="60" r={radius}
                className={`circle-progress ${isBreak ? 'break' : 'work'}`}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="pomodoro-time">
              <span className="time-display">{minutes}:{seconds}</span>
              <span className="time-label">{isBreak ? 'Mola' : 'Çalışma'}</span>
            </div>
          </div>
          <div className="pomodoro-buttons">
            <button
              className={`pomo-btn ${isRunning ? 'stop' : 'start'}`}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? '⏸ Durdur' : '▶ Başlat'}
            </button>
            <button className="pomo-btn reset" onClick={reset}>
              🔄 Sıfırla
            </button>
            <button className="pomo-btn settings" onClick={() => { setIsRunning(false); setIsEditing(true); }}>
              ⚙️
            </button>
          </div>
          <div className="pomodoro-count">
            {pomodoroCount > 0 && `🍅 ${pomodoroCount} pomodoro tamamlandı`}
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();
    setTasks(data);
  };

  const addTask = async () => {
    if (!title) return;
    await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    setTitle('');
    setDescription('');
    fetchTasks();
  };

  const completeTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, description: editDescription }),
    });
    setEditingTask(null);
    fetchTasks();
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="container">
      <div className="header">
        <h1>📝 TaskFlow</h1>
        <p className="subtitle">Görevlerini yönet, hedeflerine ulaş</p>
      </div>

      <Pomodoro />

      <div className="stats">
        <div className="stat-card total">
          <span className="stat-number">{total}</span>
          <span className="stat-label">Toplam</span>
        </div>
        <div className="stat-card pending">
          <span className="stat-number">{pending}</span>
          <span className="stat-label">Bekliyor</span>
        </div>
        <div className="stat-card completed">
          <span className="stat-number">{completed}</span>
          <span className="stat-label">Tamamlandı</span>
        </div>
      </div>

      <div className="form">
        <input
          type="text"
          placeholder="Görev başlığı..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <input
          type="text"
          placeholder="Açıklama (opsiyonel)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addTask}>+ Görev Ekle</button>
      </div>

      <div className="task-list">
        {tasks.length === 0 && (
          <div className="empty">
            <p>🎯 Henüz görev yok!</p>
            <p>Yukarıdan yeni bir görev ekle</p>
          </div>
        )}
        {tasks.map((task) => (
          <div key={task.id} className={`task ${task.status}`}>
            {editingTask === task.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <div className="edit-buttons">
                  <button className="save-btn" onClick={() => saveEdit(task.id)}>Kaydet</button>
                  <button className="cancel-btn" onClick={() => setEditingTask(null)}>İptal</button>
                </div>
              </div>
            ) : (
              <>
                <div className="task-info">
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  <span className={`badge ${task.status}`}>
                    {task.status === 'completed' ? '✅ Tamamlandı' : '⏳ Bekliyor'}
                  </span>
                </div>
                <div className="task-buttons">
                  {task.status === 'pending' && (
                    <button className="complete-btn" onClick={() => completeTask(task.id)}>✓</button>
                  )}
                  <button className="edit-btn" onClick={() => startEdit(task)}>✏️</button>
                  <button className="delete-btn" onClick={() => deleteTask(task.id)}>🗑️</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;