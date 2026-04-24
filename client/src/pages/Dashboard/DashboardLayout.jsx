import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, LogOut, CheckSquare } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside style={{ width: '250px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center gap-2 mb-8" style={{ padding: '0 1rem' }}>
          <div style={{ background: 'var(--accent-primary)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <CheckSquare size={24} color="white" />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>TaskFlow</h2>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link 
            to="/" 
            className="flex items-center gap-2"
            style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              color: location.pathname === '/' ? 'white' : 'var(--text-secondary)',
              background: location.pathname === '/' ? 'var(--accent-glow)' : 'transparent',
              fontWeight: 500
            }}
          >
            <LayoutDashboard size={20} />
            My Tasks
          </Link>

          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className="flex items-center gap-2"
              style={{ 
                padding: '0.75rem 1rem', 
                borderRadius: 'var(--radius-md)', 
                color: location.pathname === '/admin' ? 'white' : 'var(--text-secondary)',
                background: location.pathname === '/admin' ? 'var(--accent-glow)' : 'transparent',
                fontWeight: 500
              }}
            >
              <Users size={20} />
              Admin Panel
            </Link>
          )}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user?.role?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'white', fontWeight: 500 }}>{user?.role === 'admin' ? 'Administrator' : 'Member'}</p>
            </div>
          </div>
          <button onClick={logout} className="btn btn-secondary w-full" style={{ padding: '0.5rem', fontSize: '0.875rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
