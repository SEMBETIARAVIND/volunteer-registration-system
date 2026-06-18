import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(form.email, form.password);
      if (result.success) {
        navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 600);
  };

  const fillDemo = (type) => {
    if (type === 'admin') setForm({ email: 'admin@volunteerportal.org', password: 'Admin@123' });
    else setForm({ email: 'priya.sharma@example.com', password: 'Admin@123' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--surface-2)' }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1a56db 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, color: '#fff' }} className="hide-mobile">
        <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.1)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
          <Heart size={32} color="#60a5fa" />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>Welcome back to VolunteerHub</h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', textAlign: 'center', maxWidth: 380, lineHeight: 1.7 }}>
          Continue your journey of making a positive impact. Every hour you give helps build a better community.
        </p>
        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%', maxWidth: 360 }}>
          {[['2,500+', 'Active Volunteers'], ['180+', 'Events Hosted'], ['45K+', 'Hours Contributed'], ['50+', 'Communities']].map(([v, l], i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{v}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: '100%', maxWidth: 480, background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(32px, 5vw, 56px)' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')} style={{ alignSelf: 'flex-start', marginBottom: 32, gap: 6 }}>
          <ArrowLeft size={15} /> Back to Home
        </button>

        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Sign in</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Don't have an account? <button onClick={() => navigate('/register')} style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>Register as volunteer</button></p>
        </div>

        {/* Demo credentials */}
        <div style={{ background: 'var(--primary-light)', border: '1px solid #bfdbfe', borderRadius: 'var(--radius)', padding: 14, marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', marginBottom: 8 }}>Demo Accounts</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm" onClick={() => fillDemo('admin')} style={{ fontSize: 12, background: 'var(--primary)', color: '#fff', padding: '6px 12px' }}>Admin Login</button>
            <button className="btn btn-sm btn-secondary" onClick={() => fillDemo('volunteer')} style={{ fontSize: 12, padding: '6px 12px' }}>Volunteer Login</button>
          </div>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label className="form-label">Email Address <span className="req">*</span></label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password <span className="req">*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={{ paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading} style={{ justifyContent: 'center', marginTop: 4 }}>
            {loading ? <><div className="spinner" /> Signing in...</> : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>
      </div>

      <style>{`.hide-mobile { display: flex; } @media (max-width: 768px) { .hide-mobile { display: none; } }`}</style>
    </div>
  );
}
