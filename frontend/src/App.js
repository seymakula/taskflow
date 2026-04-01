import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://3.120.139.109:5000/api';

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
    await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
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

      {/* İstatistik Kartları */}
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

      {/* Görev Ekleme Formu */}
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

      {/* Görev Listesi */}
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