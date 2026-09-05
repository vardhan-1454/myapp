import React, { useState, useEffect } from 'react';
import { 
  Database, Server, RefreshCw, Plus, Trash2, Edit3, CheckCircle, 
  AlertTriangle, ShieldCheck, Terminal, Layers, Search, ExternalLink 
} from 'lucide-react';
import { fetchHealth, fetchItems, createItem, updateItem, deleteItem } from './services/api';

export default function App() {
  const [health, setHealth] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('records'); // 'records' | 'schema' | 'sql'

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    status: 'pending',
    priority: 'medium'
  });

  const loadData = async () => {
    setLoading(true);
    const healthRes = await fetchHealth();
    setHealth(healthRes);

    const itemsRes = await fetchItems();
    if (itemsRes.data) {
      setItems(itemsRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Auto ping every 10s
    return () => clearInterval(interval);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingId) {
      await updateItem(editingId, formData);
    } else {
      await createItem(formData);
    }

    setShowModal(false);
    setEditingId(null);
    setFormData({ title: '', description: '', category: 'General', status: 'pending', priority: 'medium' });
    loadData();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category || 'General',
      status: item.status || 'pending',
      priority: item.priority || 'medium'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await deleteItem(id);
      loadData();
    }
  };

  const isConnected = health?.database?.status === 'connected';

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container">
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', padding: '0.6rem', borderRadius: '12px', display: 'flex' }}>
              <Database size={28} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                myapp Dashboard
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Node.js Express + MySQL Database Control Center
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Status Badge */}
          <div className={`badge ${isConnected ? 'badge-connected' : 'badge-disconnected'}`}>
            <span className="ping-dot" />
            {isConnected ? 'MySQL Connected' : 'MySQL Offline (Fallback)'}
          </div>

          <button onClick={loadData} className="btn btn-secondary btn-sm" title="Refresh Connection Data">
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>
        </div>
      </header>

      {/* System Banner / Info */}
      <div className="glass-card" style={{ marginBottom: '2rem', background: isConnected ? 'rgba(16, 185, 129, 0.05)' : 'rgba(245, 158, 11, 0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <Server size={14} /> Express API Server
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              http://localhost:5000
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <Database size={14} /> Database Host
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {isConnected ? `${health.database.host} (myapp_db)` : '127.0.0.1:3306 (Disconnected)'}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <ShieldCheck size={14} /> Connection Mode
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: isConnected ? '#34d399' : '#fbbf24' }}>
              {isConnected ? 'Active Pool (mysql2)' : 'In-Memory Simulation'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button 
              onClick={() => { setEditingId(null); setFormData({ title: '', description: '', category: 'General', status: 'pending', priority: 'medium' }); setShowModal(true); }}
              className="btn btn-primary"
            >
              <Plus size={16} /> Add Record
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('records')} 
          className={`btn ${activeTab === 'records' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          <Layers size={14} /> Records ({items.length})
        </button>
        <button 
          onClick={() => setActiveTab('schema')} 
          className={`btn ${activeTab === 'schema' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          <Database size={14} /> Schema & Setup
        </button>
        <button 
          onClick={() => setActiveTab('sql')} 
          className={`btn ${activeTab === 'sql' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          <Terminal size={14} /> SQL Queries
        </button>
      </div>

      {/* Tab 1: Records Grid */}
      {activeTab === 'records' && (
        <>
          {/* Controls Bar */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search items by title or description..." 
                className="form-input" 
                style={{ width: '100%', paddingLeft: '2.5rem' }} 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="form-select" 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Cards List */}
          {filteredItems.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <AlertTriangle size={40} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <p>No records found matching your filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {filteredItems.map(item => (
                <div key={item.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span className={`badge badge-status-${item.status}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                      <span className={`badge badge-priority-${item.priority}`}>
                        {item.priority}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', minHeight: '2.5rem' }}>
                      {item.description || 'No description provided.'}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Category: <strong>{item.category}</strong>
                    </span>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(item)} className="btn btn-secondary btn-sm" title="Edit Record">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm" title="Delete Record">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab 2: Schema & Setup */}
      {activeTab === 'schema' && (
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            MySQL Database Table Schema (`items`)
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Executed automatically on initial database setup via <code style={{ color: 'var(--accent-cyan)' }}>backend/db/init.sql</code>:
          </p>
          <div className="code-block">
{`CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'General',
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`}
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            How to Connect Your Local MySQL Instance
          </h3>
          <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
            <li>Open <code style={{ color: '#a5b4fc' }}>backend/.env</code> and set your MySQL credentials (<code style={{ color: '#a5b4fc' }}>DB_USER</code>, <code style={{ color: '#a5b4fc' }}>DB_PASSWORD</code>, <code style={{ color: '#a5b4fc' }}>DB_HOST</code>).</li>
            <li>Run MySQL schema setup script: <code style={{ color: '#a5b4fc' }}>mysql -u root -p &lt; backend/db/init.sql</code> or run Docker Compose (<code style={{ color: '#a5b4fc' }}>docker-compose up -d</code>).</li>
            <li>Restart backend server. The status badge will turn green once MySQL ping responds!</li>
          </ol>
        </div>
      )}

      {/* Tab 3: SQL Queries */}
      {activeTab === 'sql' && (
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            Parameterized SQL Queries Executed by Express Backend
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '0.25rem' }}>SELECT ALL</div>
              <div className="code-block">SELECT * FROM items ORDER BY created_at DESC;</div>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-emerald)', marginBottom: '0.25rem' }}>INSERT RECORD (Prepared Statement)</div>
              <div className="code-block">INSERT INTO items (title, description, category, status, priority) VALUES (?, ?, ?, ?, ?);</div>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-amber)', marginBottom: '0.25rem' }}>UPDATE RECORD</div>
              <div className="code-block">UPDATE items SET title = ?, description = ?, category = ?, status = ?, priority = ? WHERE id = ?;</div>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-rose)', marginBottom: '0.25rem' }}>DELETE RECORD</div>
              <div className="code-block">DELETE FROM items WHERE id = ?;</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', background: '#111827' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              {editingId ? 'Edit Record' : 'Create New Record'}
            </h2>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Implement MySQL Indexing" 
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea" 
                  rows="3"
                  placeholder="Additional details or notes..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select 
                  className="form-select"
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
