import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, Star, ArrowRight, AlertCircle, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import db from '../utils/db';

export default function VolunteerDashboard() {
  const { user, volunteer } = useAuth();
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const events = db.getEvents();
    setAllEvents(events);
    setUpcomingEvents(events.filter(e => e.status === 'upcoming').slice(0, 3));
  }, []);

  const myEvents = allEvents.filter(e => volunteer?.events?.includes(e.id));
  const completedEvents = myEvents.filter(e => e.status === 'completed');

  const firstName = user?.name?.split(' ')[0] || 'Volunteer';
  const avatarColors = ['#1a56db','#0f9d58','#f59e0b','#8b5cf6','#ec4899'];
  const avatarColor = avatarColors[(user?.name?.charCodeAt(0)||0) % avatarColors.length];
  const initials = user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();

  const badges = [
    { icon:'🌱', name:'First Step', desc:'Completed your first event', earned: completedEvents.length >= 1 },
    { icon:'⭐', name:'Rising Star', desc:'Volunteered 20+ hours', earned: (volunteer?.totalHours||0) >= 20 },
    { icon:'🏆', name:'Champion', desc:'Joined 3+ events', earned: (volunteer?.events?.length||0) >= 3 },
    { icon:'💎', name:'Diamond', desc:'Volunteered 50+ hours', earned: (volunteer?.totalHours||0) >= 50 },
  ];

  const EMOJI_MAP = { Healthcare:'🏥', Education:'📚', Environment:'🌱', 'Food Security':'🍽️', 'Mental Health':'🧠', Technology:'💻', Community:'🤝', Sports:'⚽', Arts:'🎨' };

  return (
    <div className="page-content">
      {/* Welcome Hero */}
      <div style={{background:'linear-gradient(135deg, #1e3a8a, #1a56db)', borderRadius:'var(--radius-xl)', padding:'32px 36px', marginBottom:28, color:'#fff', position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute',right:-20,top:-20,width:180,height:180,background:'rgba(255,255,255,0.05)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',right:60,bottom:-40,width:120,height:120,background:'rgba(255,255,255,0.04)',borderRadius:'50%'}}/>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:20}}>
          <div style={{display:'flex',alignItems:'center',gap:18}}>
            <div style={{width:60,height:60,borderRadius:'50%',background:avatarColor,border:'3px solid rgba(255,255,255,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,color:'#fff',flexShrink:0}}>{initials}</div>
            <div>
              <p style={{fontSize:14,opacity:0.7,marginBottom:4}}>Welcome back 👋</p>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:700}}>{firstName}!</h2>
              {volunteer?.status === 'pending' ? (
                <div style={{display:'flex',alignItems:'center',gap:6,marginTop:6,fontSize:13,color:'#fde68a'}}><AlertCircle size={14}/> Your account is pending admin approval</div>
              ) : (
                <div style={{display:'flex',alignItems:'center',gap:6,marginTop:6,fontSize:13,color:'rgba(255,255,255,0.7)'}}><CheckCircle size={14}/> Active volunteer since {new Date(volunteer?.registeredAt||Date.now()).toLocaleDateString('en-IN',{month:'long',year:'numeric'})}</div>
              )}
            </div>
          </div>
          <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
            {[['Events Joined',(volunteer?.events?.length||0),'📅'],['Hours Contributed',(volunteer?.totalHours||0),'⏱️'],['Badges Earned',badges.filter(b=>b.earned).length,'🏅']].map(([l,v,e])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:28,fontWeight:700}}>{v}</div>
                <div style={{fontSize:12,opacity:0.65}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending notice */}
      {volunteer?.status === 'pending' && (
        <div className="alert alert-warning" style={{marginBottom:24}}>
          <AlertCircle size={18}/> Your volunteer application is under review. You'll be notified once approved by an admin. You can still browse events in the meantime.
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:24}}>
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {/* My Registered Events */}
          <div className="card">
            <div className="card-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontSize:15,fontWeight:700}}>My Registered Events</div>
              <button className="btn btn-ghost btn-sm" onClick={()=>navigate('/dashboard/events')}>Browse more <ArrowRight size={14}/></button>
            </div>
            <div className="card-body" style={{padding:0}}>
              {myEvents.length === 0 ? (
                <div style={{padding:'36px 24px',textAlign:'center',color:'var(--text-muted)'}}>
                  <div style={{fontSize:36,marginBottom:10}}>📅</div>
                  <p style={{fontSize:14,marginBottom:14}}>You haven't joined any events yet.</p>
                  <button className="btn btn-primary btn-sm" onClick={()=>navigate('/dashboard/events')}>Find Events</button>
                </div>
              ) : myEvents.map((e,i)=>(
                <div key={e.id} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 20px',borderBottom:i<myEvents.length-1?'1px solid var(--border)':'none'}}>
                  <div style={{fontSize:28,lineHeight:1}}>{EMOJI_MAP[e.category]||'🤝'}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.title}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)',display:'flex',gap:10,marginTop:3}}>
                      <span><Calendar size={11} style={{display:'inline',marginRight:3}}/>{new Date(e.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
                      <span><Clock size={11} style={{display:'inline',marginRight:3}}/>{e.hours}h</span>
                    </div>
                  </div>
                  <span className={`badge badge-${e.status==='upcoming'?'upcoming':e.status==='completed'?'completed':'inactive'}`}>{e.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming opportunities */}
          <div className="card">
            <div className="card-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontSize:15,fontWeight:700}}>New Opportunities</div>
              <button className="btn btn-ghost btn-sm" onClick={()=>navigate('/dashboard/events')}>View all <ArrowRight size={14}/></button>
            </div>
            <div className="card-body" style={{padding:0}}>
              {upcomingEvents.map((e,i)=>(
                <div key={e.id} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 20px',borderBottom:i<upcomingEvents.length-1?'1px solid var(--border)':'none'}}>
                  <div style={{fontSize:28,lineHeight:1}}>{EMOJI_MAP[e.category]||'🤝'}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:600}}>{e.title}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)',display:'flex',gap:10,marginTop:3}}>
                      <span>{new Date(e.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
                      <span>{e.location}</span>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={()=>navigate('/dashboard/events')}>Join</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {/* Profile card */}
          <div className="card">
            <div className="card-header"><div style={{fontSize:15,fontWeight:700}}>My Profile</div></div>
            <div className="card-body">
              {[['Email',user?.email],['Phone',volunteer?.phone||'—'],['Location',volunteer?.address||'—'],['Gender',volunteer?.gender||'—'],['Age',volunteer?.age ? volunteer.age+'y' : '—']].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--border)',fontSize:13}}>
                  <span style={{color:'var(--text-muted)'}}>{l}</span>
                  <span style={{fontWeight:500,color:'var(--text-primary)',textAlign:'right',maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v}</span>
                </div>
              ))}
              <button className="btn btn-secondary w-full" style={{marginTop:14,justifyContent:'center'}} onClick={()=>navigate('/dashboard/profile')}>Edit Profile</button>
            </div>
          </div>

          {/* Skills */}
          {volunteer?.skills?.length > 0 && (
            <div className="card">
              <div className="card-header"><div style={{fontSize:15,fontWeight:700}}>My Skills</div></div>
              <div className="card-body">
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {volunteer.skills.map(s=><span key={s} className="chip">{s}</span>)}
                </div>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="card">
            <div className="card-header"><div style={{fontSize:15,fontWeight:700,display:'flex',alignItems:'center',gap:8}}><Award size={16}/> Badges</div></div>
            <div className="card-body" style={{display:'flex',flexDirection:'column',gap:12}}>
              {badges.map((b,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,opacity:b.earned?1:0.4}}>
                  <div style={{fontSize:24}}>{b.icon}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:b.earned?'var(--text-primary)':'var(--text-muted)'}}>{b.name}</div>
                    <div style={{fontSize:11,color:'var(--text-muted)'}}>{b.desc}</div>
                  </div>
                  {b.earned && <CheckCircle size={14} color="var(--secondary)" style={{marginLeft:'auto'}}/>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
