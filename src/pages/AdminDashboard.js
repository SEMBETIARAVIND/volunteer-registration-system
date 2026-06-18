import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Clock, TrendingUp, CheckCircle, AlertCircle, ArrowRight, Activity } from 'lucide-react';
import db from '../utils/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const PIE_COLORS = ['#1a56db', '#0f9d58', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingVols, setPendingVols] = useState([]);
  const [activities, setActivities] = useState([]);
  const [recentVolunteers, setRecentVolunteers] = useState([]);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    const s = db.getStats();
    setStats(s);
    const vols = db.getVolunteers();
    setPendingVols(vols.filter(v => v.status === 'pending'));
    setRecentVolunteers(vols.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt)).slice(0, 5));
    setActivities(db.getActivities().slice(0, 8));
  };

  const approveVolunteer = (id) => {
    db.updateVolunteer(id, { status: 'active' });
    db.addActivity({ id: 'act-' + Date.now(), type: 'approval', message: `Volunteer approved`, timestamp: new Date().toISOString() });
    refresh();
  };

  const rejectVolunteer = (id) => {
    db.updateVolunteer(id, { status: 'inactive' });
    refresh();
  };

  if (!stats) return null;

  const statCards = [
    { label: 'Total Volunteers', value: stats.totalVolunteers, icon: Users, color: '#1a56db', bg: 'var(--primary-light)', change: '+12% this month' },
    { label: 'Active Volunteers', value: stats.activeVolunteers, icon: CheckCircle, color: '#0f9d58', bg: 'var(--secondary-light)', change: `${Math.round(stats.activeVolunteers / stats.totalVolunteers * 100)}% active rate` },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: AlertCircle, color: '#f59e0b', bg: 'var(--accent-light)', change: 'Needs attention' },
    { label: 'Total Events', value: stats.totalEvents, icon: Calendar, color: '#8b5cf6', bg: '#ede9fe', change: `${stats.upcomingEvents} upcoming` },
    { label: 'Hours Volunteered', value: stats.totalHours.toLocaleString(), icon: Clock, color: '#ec4899', bg: '#fce7f3', change: 'Across all volunteers' },
    { label: 'Monthly Growth', value: '+23%', icon: TrendingUp, color: '#06b6d4', bg: '#e0f2fe', change: 'vs last month' },
  ];

  const pieData = Object.entries(stats.byCategory).map(([name, value]) => ({ name, value }));

  const activityIcons = { registration: '👤', event: '📅', approval: '✅', report: '📊' };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarColors = ['#1a56db', '#0f9d58', '#f59e0b', '#8b5cf6', '#ec4899'];
  const avatarColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Overview of your volunteer management system</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/volunteers')}>
              <Users size={16} /> Manage Volunteers
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/admin/events')}>
              <Calendar size={16} /> Manage Events
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {statCards.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-change">{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 28 }}>
        <div className="card">
          <div className="card-header">
            <div style={{ fontSize: 15, fontWeight: 700 }}>Monthly Volunteer Registrations</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Growth over the past 6 months</div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }} />
                <Bar dataKey="volunteers" fill="#1a56db" radius={[4, 4, 0, 0]} name="Volunteers" />
                <Bar dataKey="events" fill="#0f9d58" radius={[4, 4, 0, 0]} name="Events" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div style={{ fontSize: 15, fontWeight: 700 }}>Events by Category</div>
          </div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Pending Approvals */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Pending Approvals</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{pendingVols.length} awaiting review</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/volunteers')}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {pendingVols.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 24px' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                <p style={{ fontSize: 13 }}>All caught up! No pending approvals.</p>
              </div>
            ) : (
              pendingVols.slice(0, 4).map(v => (
                <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div className="avatar" style={{ background: avatarColor(v.name), color: '#fff', fontSize: 13 }}>{initials(v.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-success btn-sm" onClick={() => approveVolunteer(v.id)} title="Approve">✓</button>
                    <button className="btn btn-danger btn-sm" onClick={() => rejectVolunteer(v.id)} title="Reject">✗</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><Activity size={16} /> Recent Activity</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Latest system events</div>
            </div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {activities.map((a, i) => (
              <div key={a.id} style={{ display: 'flex', gap: 12, padding: '12px 20px', borderBottom: i < activities.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 20, lineHeight: 1, marginTop: 2 }}>{activityIcons[a.type] || '📌'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{a.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {new Date(a.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
