import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Calendar, Award, ArrowRight, CheckCircle, Globe, Star } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const stats = [
    { value: '2,500+', label: 'Volunteers' },
    { value: '180+', label: 'Events' },
    { value: '45,000+', label: 'Hours Given' },
    { value: '50+', label: 'Communities' },
  ];

  const features = [
    { icon: Users, title: 'Easy Registration', desc: 'Sign up in minutes. Share your skills, availability, and passions to get matched with the right opportunities.', color: '#1a56db' },
    { icon: Calendar, title: 'Find Events', desc: 'Browse upcoming volunteer events by category, location, or date. Register with a single click.', color: '#0f9d58' },
    { icon: Award, title: 'Track Impact', desc: 'See your volunteer hours, events attended, and the real difference you\'re making in your community.', color: '#f59e0b' },
    { icon: Globe, title: 'Community Connect', desc: 'Join a network of like-minded volunteers working together toward meaningful social change.', color: '#8b5cf6' },
  ];

  const categories = [
    { emoji: '🏥', name: 'Healthcare', count: '23 events' },
    { emoji: '📚', name: 'Education', count: '31 events' },
    { emoji: '🌱', name: 'Environment', count: '18 events' },
    { emoji: '🍽️', name: 'Food Security', count: '14 events' },
    { emoji: '🧠', name: 'Mental Health', count: '9 events' },
    { emoji: '💻', name: 'Technology', count: '12 events' },
  ];

  const testimonials = [
    { name: 'Priya S.', role: 'Teacher, Hyderabad', text: 'VolunteerHub made it so easy to find teaching opportunities near me. I\'ve now impacted over 200 children!', rating: 5 },
    { name: 'Rahul V.', role: 'Software Engineer, Pune', text: 'I found the perfect tech volunteering event in 5 minutes. The platform is seamless and the team is wonderful.', rating: 5 },
    { name: 'Dr. Arjun N.', role: 'Lawyer, Kochi', text: 'Providing free legal aid has never been more organized. This platform truly bridges volunteers with those in need.', rating: 5 },
  ];

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>
      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '0 5%', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>VolunteerHub</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>Join Free</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1a56db 100%)', padding: '90px 5% 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 99, padding: '6px 16px', marginBottom: 28, fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
            <Heart size={13} /> Making a difference, one volunteer at a time
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 22 }}>
            Give Your Time.<br />
            <span style={{ color: '#60a5fa' }}>Change Lives.</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 40, maxWidth: 540, margin: '0 auto 40px' }}>
            Connect with meaningful volunteer opportunities across India. Register, discover events, and track the impact you create in your community.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')} style={{ fontSize: 16, padding: '14px 32px' }}>
              Get Started Free <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')} style={{ fontSize: 16, padding: '14px 32px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
              Sign In
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ maxWidth: 800, margin: '60px auto 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '20px 16px', background: 'rgba(255,255,255,0.06)', borderRadius: i === 0 ? '12px 0 0 12px' : i === 3 ? '0 12px 12px 0' : 0, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 5%', background: 'var(--surface-2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Why VolunteerHub</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, marginBottom: 14 }}>Everything you need to volunteer</h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>One platform to register, discover, and track your volunteering journey.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ padding: 28, transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }} onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: f.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '80px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, marginBottom: 12 }}>Volunteer Categories</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Find opportunities that match your passion</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {categories.map((c, i) => (
              <div key={i} onClick={() => navigate('/register')} style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-light)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface-2)'; }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{c.emoji}</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 5%', background: 'var(--surface-2)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, marginBottom: 14 }}>How It Works</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 56 }}>Three simple steps to start volunteering</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, position: 'relative' }}>
            {[
              { step: '01', title: 'Create Your Profile', desc: 'Register with your skills, interests, and availability in just a few minutes.' },
              { step: '02', title: 'Find Opportunities', desc: 'Browse events that match your profile, location, and schedule.' },
              { step: '03', title: 'Make an Impact', desc: 'Join events, contribute your skills, and track the difference you make.' },
            ].map((s, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ width: 56, height: 56, background: 'var(--primary)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, margin: '0 auto 20px', fontFamily: 'var(--font-display)' }}>{s.step}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, marginBottom: 12 }}>Volunteer Stories</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card" style={{ padding: 28 }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={16} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="avatar" style={{ background: 'var(--primary)', color: '#fff', fontSize: 13 }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 5%', background: 'linear-gradient(135deg, #1a56db, #0f172a)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Ready to make a difference?</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', marginBottom: 36 }}>Join thousands of volunteers across India making their communities better.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-lg" style={{ background: '#fff', color: 'var(--primary)', fontSize: 16 }} onClick={() => navigate('/register')}>
            Start Volunteering <ArrowRight size={18} />
          </button>
          <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: 16 }} onClick={() => navigate('/login')}>
            Admin Login
          </button>
        </div>
        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {['Free to join', 'No experience needed', 'Flexible schedules', 'Real impact'].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              <CheckCircle size={15} color="#60a5fa" /> {t}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--text-primary)', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '28px 5%', fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <Heart size={14} color="var(--primary)" />
          <span style={{ color: '#fff', fontWeight: 600 }}>VolunteerHub</span>
        </div>
        <p>© {new Date().getFullYear()} VolunteerHub. Connecting hearts, building communities.</p>
      </footer>
    </div>
  );
}
