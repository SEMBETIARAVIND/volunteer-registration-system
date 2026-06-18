import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Plus, Edit2, Trash2, CheckCircle, Search, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import db from '../utils/db';

const CATEGORIES = ['Healthcare','Education','Environment','Food Security','Mental Health','Technology','Community','Sports','Arts'];
const BANNER_MAP = { Healthcare:'event-banner-health', Education:'event-banner-education', Environment:'event-banner-environment', default:'event-banner-community' };
const EMOJI_MAP = { Healthcare:'🏥', Education:'📚', Environment:'🌱', 'Food Security':'🍽️', 'Mental Health':'🧠', Technology:'💻', Community:'🤝', Sports:'⚽', Arts:'🎨' };

export default function EventsPage({ adminView }) {
  const { user, volunteer, refreshVolunteer } = useAuth();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const blankForm = { title:'', description:'', category:'Healthcare', date:'', time:'09:00 AM', endTime:'05:00 PM', location:'', volunteersNeeded:10, status:'upcoming', hours:4 };
  const [form, setForm] = useState(blankForm);

  useEffect(() => { load(); }, []);

  const load = () => setEvents(db.getEvents());
  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(()=>setSuccessMsg(''), 3000); };

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || e.category === catFilter;
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    let matchTab = true;
    if (!adminView && activeTab === 'registered') matchTab = volunteer?.events?.includes(e.id);
    return matchSearch && matchCat && matchStatus && matchTab;
  });

  const openCreate = () => { setForm(blankForm); setEditEvent(null); setShowModal(true); };
  const openEdit = (e) => { setForm({...e}); setEditEvent(e); setShowModal(true); };

  const saveEvent = () => {
    if (!form.title || !form.date || !form.location) return alert('Fill required fields.');
    if (editEvent) {
      db.updateEvent(editEvent.id, form);
      showSuccess('Event updated!');
    } else {
      const newEvt = { ...form, id:'evt-'+Date.now(), volunteersRegistered:[], organizer:user?.id, createdAt:new Date().toISOString() };
      db.createEvent(newEvt);
      db.addActivity({ id:'act-'+Date.now(), type:'event', message:`Event "${form.title}" created`, timestamp:new Date().toISOString() });
      showSuccess('Event created!');
    }
    load();
    setShowModal(false);
  };

  const deleteEvent = (id) => {
    if (window.confirm('Delete this event?')) { db.deleteEvent(id); load(); showSuccess('Event deleted.'); }
  };

  const registerForEvent = (eventId) => {
    if (!volunteer) return;
    db.registerVolunteerForEvent(eventId, volunteer.id);
    db.addActivity({ id:'act-'+Date.now(), type:'registration', message:`${volunteer.name} registered for an event`, timestamp:new Date().toISOString() });
    load();
    refreshVolunteer();
    showSuccess('Successfully registered for the event!');
  };

  const isRegistered = (eventId) => volunteer?.events?.includes(eventId);
  const isFull = (evt) => (evt.volunteersRegistered?.length || 0) >= evt.volunteersNeeded;

  const statusBadge = (s) => {
    const map = { upcoming:'badge-upcoming', completed:'badge-completed', cancelled:'badge-cancelled' };
    return <span className={`badge ${map[s]||'badge-inactive'}`}>{s}</span>;
  };

  const bannerClass = (cat) => BANNER_MAP[cat] || BANNER_MAP.default;

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">{adminView ? 'Manage Events' : 'Browse Events'}</h1>
            <p className="page-subtitle">{adminView ? 'Create and manage volunteer events' : 'Find and join volunteer opportunities'}</p>
          </div>
          {adminView && <button className="btn btn-primary" onClick={openCreate}><Plus size={16}/> Create Event</button>}
        </div>
      </div>

      {successMsg && <div className="alert alert-success" style={{marginBottom:20}}><CheckCircle size={16}/> {successMsg}</div>}

      {/* Volunteer tabs */}
      {!adminView && (
        <div className="tabs">
          <button className={`tab-btn ${activeTab==='all'?'active':''}`} onClick={()=>setActiveTab('all')}>All Events</button>
          <button className={`tab-btn ${activeTab==='registered'?'active':''}`} onClick={()=>setActiveTab('registered')}>My Registrations {volunteer?.events?.length ? `(${volunteer.events.length})` : ''}</button>
        </div>
      )}

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={16}/>
          <input className="form-input" placeholder="Search events..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="form-input form-select" style={{width:160}} value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </select>
        <select className="form-input form-select" style={{width:140}} value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Events grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3>No events found</h3>
          <p>{adminView ? 'Create your first event to get started.' : 'Check back later for new opportunities.'}</p>
        </div>
      ) : (
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20}}>
          {filtered.map(evt => {
            const reg = evt.volunteersRegistered?.length || 0;
            const pct = Math.min(100, Math.round(reg / evt.volunteersNeeded * 100));
            return (
              <div key={evt.id} className="event-card">
                <div className={`event-banner ${bannerClass(evt.category)}`}>
                  <span style={{fontSize:52}}>{EMOJI_MAP[evt.category]||'🤝'}</span>
                </div>
                <div className="event-card-body">
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                    {statusBadge(evt.status)}
                    <span className="chip chip-gray" style={{fontSize:11}}>{evt.category}</span>
                  </div>
                  <div className="event-card-title">{evt.title}</div>
                  <p style={{fontSize:13,color:'var(--text-muted)',marginBottom:12,lineHeight:1.5,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{evt.description}</p>
                  <div className="event-card-meta">
                    <div className="event-card-meta-item"><Calendar size={13}/>{new Date(evt.date).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}</div>
                    <div className="event-card-meta-item"><Clock size={13}/>{evt.time} – {evt.endTime} ({evt.hours}h)</div>
                    <div className="event-card-meta-item"><MapPin size={13}/>{evt.location}</div>
                  </div>
                  <div style={{marginTop:12}}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'var(--text-muted)',marginBottom:5}}>
                      <span><Users size={12} style={{display:'inline',marginRight:4}}/>{reg}/{evt.volunteersNeeded} volunteers</span>
                      <span>{pct}% filled</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`,background:pct>=100?'var(--secondary)':pct>70?'var(--accent)':'var(--primary)'}}/></div>
                  </div>
                </div>
                <div className="event-card-footer">
                  {adminView ? (
                    <div style={{display:'flex',gap:8,width:'100%',justifyContent:'space-between'}}>
                      <span style={{fontSize:12,color:'var(--text-muted)'}}>{reg} registered</span>
                      <div style={{display:'flex',gap:6}}>
                        <button className="btn btn-secondary btn-sm" onClick={()=>openEdit(evt)}><Edit2 size={13}/> Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={()=>deleteEvent(evt.id)}><Trash2 size={13}/></button>
                      </div>
                    </div>
                  ) : (
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
                      <span style={{fontSize:12,color:'var(--text-muted)'}}>{evt.volunteersNeeded - reg} spots left</span>
                      {isRegistered(evt.id) ? (
                        <span className="badge badge-active"><CheckCircle size={12}/> Registered</span>
                      ) : evt.status !== 'upcoming' ? (
                        <span style={{fontSize:12,color:'var(--text-muted)'}}>Event {evt.status}</span>
                      ) : isFull(evt) ? (
                        <span className="badge badge-inactive">Event Full</span>
                      ) : (
                        <button className="btn btn-primary btn-sm" onClick={()=>registerForEvent(evt.id)}>Register Now</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editEvent ? 'Edit Event' : 'Create New Event'}</div>
              <button className="btn btn-ghost btn-icon" onClick={()=>setShowModal(false)}><X size={18}/></button>
            </div>
            <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:16}}>
              <div className="form-group"><label className="form-label">Event Title <span className="req">*</span></label><input className="form-input" placeholder="Event name" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-input form-textarea" placeholder="Describe the event..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3}/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div className="form-group"><label className="form-label">Category</label>
                  <select className="form-input form-select" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Status</label>
                  <select className="form-input form-select" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                    <option value="upcoming">Upcoming</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Date <span className="req">*</span></label><input className="form-input" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
                <div className="form-group"><label className="form-label">Volunteers Needed</label><input className="form-input" type="number" min="1" value={form.volunteersNeeded} onChange={e=>setForm({...form,volunteersNeeded:Number(e.target.value)})}/></div>
                <div className="form-group"><label className="form-label">Start Time</label><input className="form-input" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></div>
                <div className="form-group"><label className="form-label">End Time</label><input className="form-input" value={form.endTime} onChange={e=>setForm({...form,endTime:e.target.value})}/></div>
              </div>
              <div className="form-group"><label className="form-label">Location <span className="req">*</span></label><input className="form-input" placeholder="Venue, City" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Duration (hours)</label><input className="form-input" type="number" min="1" value={form.hours} onChange={e=>setForm({...form,hours:Number(e.target.value)})}/></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEvent}>{editEvent ? 'Update Event' : 'Create Event'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
