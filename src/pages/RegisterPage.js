import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, ArrowLeft, ArrowRight, CheckCircle, User, MapPin, Briefcase, Eye, EyeOff } from 'lucide-react';

const SKILLS = ['Teaching', 'Medical Aid', 'Technology', 'Fundraising', 'Cooking', 'Event Management', 'Legal Aid', 'Counseling', 'Arts & Crafts', 'Sports Coaching', 'Photography', 'Translation', 'Social Media', 'Construction', 'Driving'];
const AVAILABILITY = ['Weekdays (Morning)', 'Weekdays (Evening)', 'Weekends', 'Evenings', 'Full-time'];
const INTERESTS = ['Education', 'Healthcare', 'Environment', 'Food Security', 'Mental Health', 'Human Rights', 'Arts & Culture', 'Technology', 'Sports', 'Animal Welfare', 'Elderly Care', 'Disability Support'];

const STEPS = ['Personal Info', 'Location & Bio', 'Skills & Interests'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', age: '', gender: '',
    address: '', bio: '',
    skills: [], availability: [], interests: [],
  });

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const toggleArr = (field, val) => setForm(f => {
    const arr = f[field];
    return { ...f, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
  });

  const validateStep = () => {
    setError('');
    if (step === 0) {
      if (!form.name || !form.email || !form.password || !form.confirmPassword)
        return setError('All fields are required.'), false;
      if (form.password.length < 6) return setError('Password must be at least 6 characters.'), false;
      if (form.password !== form.confirmPassword) return setError('Passwords do not match.'), false;
    }
    if (step === 1) {
      if (!form.phone || !form.age || !form.gender || !form.address)
        return setError('All fields are required.'), false;
      if (parseInt(form.age) < 16 || parseInt(form.age) > 80)
        return setError('Age must be between 16 and 80.'), false;
    }
    if (step === 2) {
      if (form.skills.length === 0) return setError('Select at least one skill.'), false;
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const back = () => { setError(''); setStep(s => s - 1); };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setTimeout(() => {
      const result = register(form);
      if (result.success) setSuccess(true);
      else setError(result.error);
      setLoading(false);
    }, 800);
  };

  if (success) return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ maxWidth: 460, width: '100%', padding: 48, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, background: 'var(--secondary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={36} color="var(--secondary)" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Registration Successful!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
          Welcome to VolunteerHub! Your application is pending admin review. You'll be notified once approved.
        </p>
        <button className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} onClick={() => navigate('/dashboard')}>
          Go to My Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-2)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <nav style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '0 5%', height: 64, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}><ArrowLeft size={15} /> Home</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Heart size={20} color="var(--primary)" />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>VolunteerHub</span>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 600 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Join as a Volunteer</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Already registered? <button onClick={() => navigate('/login')} style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>Sign in</button></p>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 32, background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ flex: 1, padding: '16px 12px', textAlign: 'center', background: i <= step ? (i === step ? 'var(--primary)' : 'var(--primary-light)') : 'transparent', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: i === step ? '#fff' : i < step ? 'var(--primary)' : 'var(--text-muted)' }}>
                  {i < step ? '✓ ' : `${i + 1}. `}{s}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-body">
              {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

              {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><User size={18} /> Personal Information</h3>
                  <div className="form-group">
                    <label className="form-label">Full Name <span className="req">*</span></label>
                    <input className="form-input" placeholder="Your full name" value={form.name} onChange={e => update('name', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address <span className="req">*</span></label>
                    <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password <span className="req">*</span></label>
                    <div style={{ position: 'relative' }}>
                      <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={e => update('password', e.target.value)} style={{ paddingRight: 44 }} />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password <span className="req">*</span></label>
                    <input className="form-input" type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={18} /> Location & Background</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Phone <span className="req">*</span></label>
                      <input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => update('phone', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Age <span className="req">*</span></label>
                      <input className="form-input" type="number" min="16" max="80" placeholder="Your age" value={form.age} onChange={e => update('age', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender <span className="req">*</span></label>
                    <select className="form-input form-select" value={form.gender} onChange={e => update('gender', e.target.value)}>
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Non-binary</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">City / Address <span className="req">*</span></label>
                    <input className="form-input" placeholder="City, State" value={form.address} onChange={e => update('address', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Short Bio</label>
                    <textarea className="form-input form-textarea" placeholder="Tell us about yourself and why you want to volunteer..." value={form.bio} onChange={e => update('bio', e.target.value)} rows={3} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><Briefcase size={18} /> Skills & Interests</h3>
                  <div className="form-group">
                    <label className="form-label">Your Skills <span className="req">*</span></label>
                    <p className="form-hint" style={{ marginBottom: 10 }}>Select all that apply</p>
                    <div className="checkbox-group">
                      {SKILLS.map(s => (
                        <div key={s} className="checkbox-chip">
                          <input type="checkbox" id={`skill-${s}`} checked={form.skills.includes(s)} onChange={() => toggleArr('skills', s)} />
                          <label htmlFor={`skill-${s}`}>{s}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Availability</label>
                    <div className="checkbox-group">
                      {AVAILABILITY.map(a => (
                        <div key={a} className="checkbox-chip">
                          <input type="checkbox" id={`avail-${a}`} checked={form.availability.includes(a)} onChange={() => toggleArr('availability', a)} />
                          <label htmlFor={`avail-${a}`}>{a}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Causes You Care About</label>
                    <div className="checkbox-group">
                      {INTERESTS.map(i => (
                        <div key={i} className="checkbox-chip">
                          <input type="checkbox" id={`int-${i}`} checked={form.interests.includes(i)} onChange={() => toggleArr('interests', i)} />
                          <label htmlFor={`int-${i}`}>{i}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {step > 0 ? (
                <button className="btn btn-secondary" onClick={back}><ArrowLeft size={16} /> Back</button>
              ) : (
                <button className="btn btn-ghost" onClick={() => navigate('/login')}>Already have account</button>
              )}
              {step < 2 ? (
                <button className="btn btn-primary" onClick={next}>Next Step <ArrowRight size={16} /></button>
              ) : (
                <button className="btn btn-success btn-lg" onClick={handleSubmit} disabled={loading}>
                  {loading ? <><div className="spinner" /> Submitting...</> : <><CheckCircle size={17} /> Complete Registration</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
