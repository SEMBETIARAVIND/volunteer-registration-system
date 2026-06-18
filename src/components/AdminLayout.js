import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Users, Calendar, BarChart3, LogOut,
  Bell, ChevronDown, Heart, User, Menu, X, Settings
} from 'lucide-react';

export default function AdminLayout({ volunteerMode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const base = volunteerMode ? '/dashboard' : '/admin';

  const adminNav = [
    { to: base, icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: `${base}/volunteers`, icon: Users, label: 'Volunteers' },
    { to: `${base}/events`, icon: Calendar, label: 'Events' },
    { to: `${base}/reports`, icon: BarChart3, label: 'Reports' },
  ];

  const volunteerNav = [
    { to: base, icon: LayoutDashboard, label: 'My Dashboard', end: true },
    { to: `${base}/events`, icon: Calendar, label: 'Browse Events' },
    { to: `${base}/profile`, icon: User, label: 'My Profile' },
  ];

  const navItems = volunteerMode ? volunteerNav : adminNav;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
  const avatarColors = ['#1a56db', '#0f9d58', '#f59e0b', '#8b5cf6', '#ec4899'];
  const avatarColor = avatarColors[(user?.name?.charCodeAt(0) || 0) % avatarColors.length];

  return (
    <div className="app-shell">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99 }}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="nav-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={18} color="#fff" />
            </div>
            <div>
              <div className="nav-logo-text">VolunteerHub</div>
              <div className="nav-logo-sub">{volunteerMode ? 'Volunteer Portal' : 'Admin Panel'}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 0', flex: 1 }}>
          <div className="nav-section">Navigation</div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '16px 8px' }}>
          <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar" style={{ background: avatarColor, color: '#fff', width: 34, height: 34, fontSize: 13 }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          </div>
          <button className="nav-item" onClick={handleLogout} style={{ color: 'rgba(255,100,100,0.8)' }}>
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none' }}
              id="mobile-menu-btn"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                {volunteerMode ? 'Volunteer Portal' : 'Admin Dashboard'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-ghost btn-icon" title="Notifications">
              <Bell size={18} />
            </button>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', border: 'none', background: 'none', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}
                className="btn btn-ghost"
              >
                <div className="avatar" style={{ background: avatarColor, color: '#fff', fontSize: 13 }}>{initials}</div>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>
              {showUserMenu && (
                <div style={{ position: 'absolute', right: 0, top: '110%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', minWidth: 180, zIndex: 200 }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</div>
                  </div>
                  <div style={{ padding: '8px' }}>
                    <button className="btn btn-ghost w-full" style={{ justifyContent: 'flex-start', fontSize: 13 }} onClick={handleLogout}>
                      <LogOut size={15} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
