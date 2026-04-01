import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://127.0.0.1:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Görevleri API'den çek
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();
    setTasks(data);
  };

  // Yeni görev ekle
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

  // Görevi tamamlandı yap
  const completeTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    });
    fetchTasks();
  };

  // Görevi sil
  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    fetchTasks();
  };

  return (
    <div className="container">
      <h1>📝 TaskFlow</h1>

      {/* Görev Ekleme Formu */}
      <div className="form">
        <input
          type="text"
          placeholder="Görev başlığı..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Açıklama (opsiyonel)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addTask}>Ekle</button>
      </div>

      {/* Görev Listesi */}
      <div className="task-list">
        {tasks.length === 0 && <p className="empty">Henüz görev yok!</p>}
        {tasks.map((task) => (
          <div key={task.id} className={`task ${task.status}`}>
            <div className="task-info">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span className={`badge ${task.status}`}>
                {task.status === 'completed' ? '✅ Tamamlandı' : '⏳ Bekliyor'}
              </span>
            </div>
            <div className="task-buttons">
              {task.status === 'pending' && (
                <button className="complete-btn" onClick={() => completeTask(task.id)}>
                  Tamamla
                </button>
              )}
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;