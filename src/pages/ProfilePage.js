import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Edit2, Save, X, User, MapPin, Briefcase } from 'lucide-react';
import db from '../utils/db';

const SKILLS_LIST = ['Teaching','Medical Aid','Technology','Fundraising','Cooking','Event Management','Legal Aid','Counseling','Arts & Crafts','Sports Coaching','Photography','Translation','Social Media','Construction','Driving'];
const AVAILABILITY_LIST = ['Weekdays (Morning)','Weekdays (Evening)','Weekends','Evenings','Full-time'];
const INTERESTS_LIST = ['Education','Healthcare','Environment','Food Security','Mental Health','Human Rights','Arts & Culture','Technology','Sports','Animal Welfare','Elderly Care','Disability Support'];

export default function ProfilePage() {
  const { user, volunteer, refreshVolunteer } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (volunteer) setForm({ ...volunteer });
  }, [volunteer]);

  const toggleArr = (field, val) => {
    const arr = form[field] || [];
    setForm({ ...form, [field]: arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val] });
  };

  const save = () => {
    db.updateVolunteer(volunteer.id, form);
    refreshVolunteer();
    setEditing(false);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const cancel = () => { setForm({ ...volunteer }); setEditing(false); };

  const avatarColors = ['#1a56db','#0f9d58','#f59e0b','#8b5cf6','#ec4899'];
  const avatarColor = avatarColors[(user?.name?.charCodeAt(0)||0) % avatarColors.length];
  const initials = user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();

  const events = db.getEvents().filter(e => volunteer?.events?.includes(e.id));
  const EMOJI_MAP = { Healthcare:'🏥', Education:'📚', Environment:'🌱', 'Food Security':'🍽️', 'Mental Health':'🧠', Technology:'💻', Community:'🤝', Sports:'⚽', Arts:'🎨' };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">Manage your volunteer information and preferences</p>
          </div>
          {!editing ? (
            <button className="btn btn-primary" onClick={()=>setEditing(true)}><Edit2 size={16}/> Edit Profile</button>
          ) : (
            <div style={{display:'flex',gap:10}}>
              <button className="btn btn-secondary" onClick={cancel}><X size={16}/> Cancel</button>
              <button className="btn btn-success" onClick={save}><Save size={16}/> Save Changes</button>
            </div>
          )}
        </div>
      </div>

      {success && <div className="alert alert-success" style={{marginBottom:20}}><CheckCircle size={16}/> {success}</div>}

      {/* Profile header */}
      <div className="card" style={{marginBottom:24}}>
        <div className="card-body" style={{display:'flex',alignItems:'center',gap:24,flexWrap:'wrap'}}>
          <div style={{width:80,height:80,borderRadius:'50%',background:avatarColor,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:700,color:'#fff',flexShrink:0}}>{initials}</div>
          <div style={{flex:1}}>
            <h2 style={{fontSize:22,fontWeight:700,marginBottom:4}}>{volunteer?.name}</h2>
            <p style={{fontSize:14,color:'var(--text-muted)',marginBottom:8}}>{volunteer?.email} · {volunteer?.phone}</p>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <span className={`badge badge-${volunteer?.status}`}>{volunteer?.status}</span>
              <span className="badge badge-blue">{volunteer?.events?.length||0} events</span>
              <span className="badge badge-blue">{volunteer?.totalHours||0} hours</span>
            </div>
          </div>
          {volunteer?.bio && !editing && <p style={{fontSize:14,color:'var(--text-secondary)',maxWidth:300,lineHeight:1.6,fontStyle:'italic'}}>"{volunteer.bio}"</p>}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['info','skills','activity'].map(t=>(
          <button key={t} className={`tab-btn ${activeTab===t?'active':''}`} onClick={()=>setActiveTab(t)} style={{textTransform:'capitalize'}}>{t === 'info' ? 'Personal Info' : t === 'skills' ? 'Skills & Interests' : 'Activity'}</button>
        ))}
      </div>

      {activeTab === 'info' && (
        <div className="card">
          <div className="card-body" style={{display:'flex',flexDirection:'column',gap:20}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                {editing ? <input className="form-input" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})}/> : <div style={{fontSize:14,padding:'10px 0'}}>{volunteer?.name}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <div style={{fontSize:14,padding:'10px 0',color:'var(--text-muted)'}}>{volunteer?.email}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                {editing ? <input className="form-input" value={form.phone||''} onChange={e=>setForm({...form,phone:e.target.value})}/> : <div style={{fontSize:14,padding:'10px 0'}}>{volunteer?.phone}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                {editing ? <input className="form-input" type="number" value={form.age||''} onChange={e=>setForm({...form,age:e.target.value})}/> : <div style={{fontSize:14,padding:'10px 0'}}>{volunteer?.age}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                {editing ? (
                  <select className="form-input form-select" value={form.gender||''} onChange={e=>setForm({...form,gender:e.target.value})}>
                    <option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
                  </select>
                ) : <div style={{fontSize:14,padding:'10px 0'}}>{volunteer?.gender}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                {editing ? <input className="form-input" value={form.address||''} onChange={e=>setForm({...form,address:e.target.value})}/> : <div style={{fontSize:14,padding:'10px 0'}}>{volunteer?.address}</div>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              {editing ? <textarea className="form-input form-textarea" value={form.bio||''} onChange={e=>setForm({...form,bio:e.target.value})} rows={3}/> : <div style={{fontSize:14,lineHeight:1.7,color:'var(--text-secondary)',padding:'10px 0'}}>{volunteer?.bio || <span style={{color:'var(--text-muted)'}}>No bio added yet.</span>}</div>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div className="card">
            <div className="card-header"><div style={{fontSize:15,fontWeight:700}}>Skills</div></div>
            <div className="card-body">
              {editing ? (
                <div className="checkbox-group">{SKILLS_LIST.map(s=><div key={s} className="checkbox-chip"><input type="checkbox" id={`ps-${s}`} checked={(form.skills||[]).includes(s)} onChange={()=>toggleArr('skills',s)}/><label htmlFor={`ps-${s}`}>{s}</label></div>)}</div>
              ) : (
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {(volunteer?.skills||[]).length ? volunteer.skills.map(s=><span key={s} className="chip">{s}</span>) : <span style={{color:'var(--text-muted)',fontSize:14}}>No skills added.</span>}
                </div>
              )}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div style={{fontSize:15,fontWeight:700}}>Availability</div></div>
            <div className="card-body">
              {editing ? (
                <div className="checkbox-group">{AVAILABILITY_LIST.map(a=><div key={a} className="checkbox-chip"><input type="checkbox" id={`pa-${a}`} checked={(form.availability||[]).includes(a)} onChange={()=>toggleArr('availability',a)}/><label htmlFor={`pa-${a}`}>{a}</label></div>)}</div>
              ) : (
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {(volunteer?.availability||[]).length ? volunteer.availability.map(a=><span key={a} className="chip chip-green">{a}</span>) : <span style={{color:'var(--text-muted)',fontSize:14}}>No availability set.</span>}
                </div>
              )}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div style={{fontSize:15,fontWeight:700}}>Causes I Care About</div></div>
            <div className="card-body">
              {editing ? (
                <div className="checkbox-group">{INTERESTS_LIST.map(i=><div key={i} className="checkbox-chip"><input type="checkbox" id={`pi-${i}`} checked={(form.interests||[]).includes(i)} onChange={()=>toggleArr('interests',i)}/><label htmlFor={`pi-${i}`}>{i}</label></div>)}</div>
              ) : (
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {(volunteer?.interests||[]).length ? volunteer.interests.map(i=><span key={i} className="chip chip-orange">{i}</span>) : <span style={{color:'var(--text-muted)',fontSize:14}}>No interests set.</span>}
                </div>
              )}
            </div>
          </div>
          {editing && (
            <div style={{display:'flex',justifyContent:'flex-end',gap:10}}>
              <button className="btn btn-secondary" onClick={cancel}>Cancel</button>
              <button className="btn btn-success" onClick={save}><Save size={16}/> Save Changes</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="card">
          <div className="card-header"><div style={{fontSize:15,fontWeight:700}}>Event History</div></div>
          <div className="card-body" style={{padding:0}}>
            {events.length === 0 ? (
              <div style={{padding:'36px',textAlign:'center',color:'var(--text-muted)'}}>
                <div style={{fontSize:36,marginBottom:10}}>📅</div>
                <p>You haven't joined any events yet.</p>
              </div>
            ) : events.map((e,i)=>(
              <div key={e.id} style={{display:'flex',alignItems:'center',gap:14,padding:'16px 24px',borderBottom:i<events.length-1?'1px solid var(--border)':'none'}}>
                <div style={{fontSize:30}}>{EMOJI_MAP[e.category]||'🤝'}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600}}>{e.title}</div>
                  <div style={{fontSize:12,color:'var(--text-muted)',marginTop:3}}>{e.location} · {new Date(e.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <span className={`badge badge-${e.status==='upcoming'?'upcoming':e.status==='completed'?'completed':'inactive'}`}>{e.status}</span>
                  <div style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>{e.hours}h</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
