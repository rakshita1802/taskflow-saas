import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  // In a real app, you might want to fetch available orgs first, 
  // or allow them to create an org in a multi-step form.
  // For simplicity, we ask for an Org UUID directly based on M3's validator
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organisation_id: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <div style={{ display: 'inline-flex', background: 'var(--accent-glow)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <UserPlus size={32} color="var(--accent-primary)" />
          </div>
          <h2>Create Account</h2>
          <p>Join your organization workspace</p>
        </div>

        {error && <div className="badge badge-danger mb-4 w-full text-center" style={{ display: 'block', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" type="text" className="form-input" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-input" value={formData.email} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-input" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Organisation ID</label>
            <input name="organisation_id" type="text" className="form-input" placeholder="UUID format" value={formData.organisation_id} onChange={handleChange} required />
            <small style={{color: 'var(--text-muted)'}}>Ask your admin for your Org UUID.</small>
          </div>

          <button type="submit" className="btn btn-primary w-full mb-4" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
