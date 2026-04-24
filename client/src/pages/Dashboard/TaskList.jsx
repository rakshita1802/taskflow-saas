import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending', due_date: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.due_date) {
        payload.due_date = null;
      }
      
      if (editingId) {
        await api.put(`/tasks/${editingId}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert('Error saving task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingId(task.id);
      setFormData({ 
        title: task.title, 
        description: task.description || '', 
        status: task.status, 
        due_date: task.due_date ? task.due_date.substring(0, 10) : '' 
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', status: 'pending', due_date: '' });
    }
    setShowModal(true);
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>Task Board</h1>
          <p>Manage your daily goals and objectives.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> New Task
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {tasks.map(task => (
          <div key={task.id} className="card">
            <div className="flex justify-between items-center mb-4">
              <span className={`badge badge-${task.status === 'completed' ? 'completed' : task.status === 'in-progress' ? 'progress' : 'pending'}`}>
                {task.status.replace('-', ' ')}
              </span>
              <div className="flex gap-2">
                <button onClick={() => openModal(task)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(task.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 style={{ fontSize: '1.125rem' }}>{task.title}</h3>
            <p style={{ fontSize: '0.875rem' }}>{task.description || 'No description provided.'}</p>
            
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {task.due_date && <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>}
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="glass-panel text-center" style={{ gridColumn: '1 / -1', padding: '4rem' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>No tasks found</h3>
            <p>You're all caught up! Create a new task to get started.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 className="mb-4">{editingId ? 'Edit Task' : 'Create Task'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="flex gap-4">
                <div className="form-group flex-1">
                  <label className="form-label">Status</label>
                  <select className="form-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label className="form-label">Due Date</label>
                  <input type="date" className="form-input" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
