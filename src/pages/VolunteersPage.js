import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Plus, Edit2, Trash2, CheckCircle, XCircle, Eye, Download } from 'lucide-react';
import db from '../utils/db';

const SKILLS_LIST = ['Teaching','Medical Aid','Technology','Fundraising','Cooking','Event Management','Legal Aid','Counseling','Arts & Crafts','Sports Coaching','Photography','Translation','Social Media','Construction','Driving'];
const AVAILABILITY_LIST = ['Weekdays (Morning)','Weekdays (Evening)','Weekends','Evenings','Full-time'];
const INTERESTS_LIST = ['Education','Healthcare','Environment','Food Security','Mental Health','Human Rights','Arts & Culture','Technology','Sports','Animal Welfare','Elderly Care','Disability Support'];

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => { load(); }, []);

  const load = () => setVolunteers(db.getVolunteers());

  const filtered = volunteers.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      v.address?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const approve = (id) => {
    db.updateVolunteer(id, { status: 'active' });
    db.addActivity({ id: 'act-' + Date.now(), type: 'approval', message: `Volunteer approved`, timestamp: new Date().toISOString() });
    load();
    showSuccess('Volunteer approved successfully!');
  };

  const reject = (id) => {
    db.updateVolunteer(id, { status: 'inactive' });
    load();
    showSuccess('Volunteer status updated.');
  };

  const deleteVol = (id) => {
    if (window.confirm('Are you sure you want to delete this volunteer?')) {
      db.deleteVolunteer(id);
      load();
      showSuccess('Volunteer deleted.');
    }
  };

  const openEdit = (v) => {
    setEditForm({ ...v });
    setSelected(v);
    setShowModal(true);
  };

  const openView = (v) => { setSelected(v); setShowViewModal(true); };

  const saveEdit = () => {
    db.updateVolunteer(editForm.id, editForm);
    load();
    setShowModal(false);
    showSuccess('Volunteer updated successfully!');
  };

  const toggleArr = (field, val) => {
    const arr = editForm[field] || [];
    setEditForm({ ...editForm, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] });
  };

  const exportCSV = () => {
    const headers = ['Name','Email','Phone','Age','Gender','Address','Status','Skills','Registered'];
    const rows = filtered.map(v => [v.name, v.email, v.phone, v.age, v.gender, v.address, v.status, (v.skills||[]).join(';'), new Date(v.registeredAt).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'volunteers.csv'; a.click();
  };

  const statusBadge = (s) => {
    const map = { active: 'badge-active', pending: 'badge-pending', inactive: 'badge-inactive' };
    return <span className={`badge ${map[s] || 'badge-inactive'}`}>{s}</span>;
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarColors = ['#1a56db','#0f9d58','#f59e0b','#8b5cf6','#ec4899'];
  const avatarColor = (name) => avatarColors[(name?.charCodeAt(0)||0) % avatarColors.length];

  const counts = { all: volunteers.length, active: volunteers.filter(v=>v.status==='active').length, pending: volunteers.filter(v=>v.status==='pending').length, inactive: volunteers.filter(v=>v.status==='inactive').length };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Volunteers</h1>
            <p className="page-subtitle">Manage volunteer registrations and applications</p>
          </div>
          <button className="btn btn-secondary" onClick={exportCSV}><Download size={16}/> Export CSV</button>
        </div>
      </div>

      {successMsg && <div className="alert alert-success" style={{marginBottom:20}}><CheckCircle size={16}/> {successMsg}</div>}

      {/* Summary */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:24}}>
        {[['All',counts.all,'#1a56db'],['Active',counts.active,'#0f9d58'],['Pending',counts.pending,'#f59e0b'],['Inactive',counts.inactive,'#94a3b8']].map(([l,c,col])=>(
          <div key={l} onClick={()=>setStatusFilter(l.toLowerCase())} style={{background:'#fff',border:`2px solid ${statusFilter===l.toLowerCase()?col:'var(--border)'}`,borderRadius:'var(--radius)',padding:'14px 18px',cursor:'pointer',transition:'all 0.15s'}}>
            <div style={{fontSize:22,fontWeight:700,color:col}}>{c}</div>
            <div style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-input-wrap" style={{flex:2}}>
          <Search size={16}/>
          <input className="form-input" placeholder="Search by name, email or location..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="form-input form-select" style={{width:160}} value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Volunteer</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Skills</th>
              <th>Status</th>
              <th>Registered</th>
              <th>Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{textAlign:'center',padding:'48px',color:'var(--text-muted)'}}>No volunteers found</td></tr>
            ) : filtered.map(v => (
              <tr key={v.id}>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div className="avatar" style={{background:avatarColor(v.name),color:'#fff',fontSize:13}}>{initials(v.name)}</div>
                    <div>
                      <div style={{fontWeight:600,fontSize:14,color:'var(--text-primary)'}}>{v.name}</div>
                      <div style={{fontSize:12,color:'var(--text-muted)'}}>{v.age}y • {v.gender}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{fontSize:13}}>{v.email}</div>
                  <div style={{fontSize:12,color:'var(--text-muted)'}}>{v.phone}</div>
                </td>
                <td style={{fontSize:13}}>{v.address}</td>
                <td>
                  <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                    {(v.skills||[]).slice(0,2).map(s=><span key={s} className="chip" style={{fontSize:11,padding:'2px 8px'}}>{s}</span>)}
                    {(v.skills||[]).length > 2 && <span className="chip chip-gray" style={{fontSize:11,padding:'2px 8px'}}>+{v.skills.length-2}</span>}
                  </div>
                </td>
                <td>{statusBadge(v.status)}</td>
                <td style={{fontSize:13,color:'var(--text-muted)'}}>{new Date(v.registeredAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                <td style={{fontSize:14,fontWeight:600}}>{v.totalHours || 0}h</td>
                <td>
                  <div style={{display:'flex',gap:4}}>
                    <button className="btn btn-ghost btn-icon btn-sm" title="View" onClick={()=>openView(v)}><Eye size={15}/></button>
                    <button className="btn btn-ghost btn-icon btn-sm" title="Edit" onClick={()=>openEdit(v)}><Edit2 size={15}/></button>
                    {v.status==='pending' && <>
                      <button className="btn btn-success btn-icon btn-sm" title="Approve" onClick={()=>approve(v.id)}><CheckCircle size={15}/></button>
                      <button className="btn btn-danger btn-icon btn-sm" title="Reject" onClick={()=>reject(v.id)}><XCircle size={15}/></button>
                    </>}
                    <button className="btn btn-danger btn-icon btn-sm" title="Delete" onClick={()=>deleteVol(v.id)}><Trash2 size={15}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{padding:'12px 16px',fontSize:13,color:'var(--text-muted)',borderTop:'1px solid var(--border)',background:'#fff',borderRadius:'0 0 var(--radius-lg) var(--radius-lg)'}}>
        Showing {filtered.length} of {volunteers.length} volunteers
      </div>

      {/* View Modal */}
      {showViewModal && selected && (
        <div className="modal-overlay" onClick={()=>setShowViewModal(false)}>
          <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div className="avatar" style={{background:avatarColor(selected.name),color:'#fff',width:48,height:48,fontSize:18}}>{initials(selected.name)}</div>
                <div>
                  <div className="modal-title">{selected.name}</div>
                  <div style={{fontSize:13,color:'var(--text-muted)'}}>{selected.email}</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={()=>setShowViewModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
                {[['Phone',selected.phone],['Age',selected.age],['Gender',selected.gender],['Location',selected.address],['Status',selected.status],['Total Hours',selected.totalHours+'h'],['Events Joined',selected.events?.length||0],['Registered',new Date(selected.registeredAt).toLocaleDateString('en-IN')]].map(([l,v])=>(
                  <div key={l}>
                    <div style={{fontSize:12,color:'var(--text-muted)',fontWeight:500,marginBottom:3}}>{l}</div>
                    <div style={{fontSize:14,color:'var(--text-primary)',fontWeight:500,textTransform:l==='Status'?'capitalize':'none'}}>{v}</div>
                  </div>
                ))}
              </div>
              {selected.bio && <div style={{marginTop:16}}><div style={{fontSize:12,color:'var(--text-muted)',marginBottom:4}}>Bio</div><p style={{fontSize:14,color:'var(--text-secondary)',lineHeight:1.6}}>{selected.bio}</p></div>}
              <div style={{marginTop:16}}>
                <div style={{fontSize:12,color:'var(--text-muted)',marginBottom:8}}>Skills</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>{(selected.skills||[]).map(s=><span key={s} className="chip">{s}</span>)}</div>
              </div>
              <div style={{marginTop:12}}>
                <div style={{fontSize:12,color:'var(--text-muted)',marginBottom:8}}>Availability</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>{(selected.availability||[]).map(a=><span key={a} className="chip chip-green">{a}</span>)}</div>
              </div>
              <div style={{marginTop:12}}>
                <div style={{fontSize:12,color:'var(--text-muted)',marginBottom:8}}>Interests</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>{(selected.interests||[]).map(i=><span key={i} className="chip chip-orange">{i}</span>)}</div>
              </div>
            </div>
            <div className="modal-footer">
              {selected.status==='pending' && <>
                <button className="btn btn-success" onClick={()=>{approve(selected.id);setShowViewModal(false);}}>Approve</button>
                <button className="btn btn-danger" onClick={()=>{reject(selected.id);setShowViewModal(false);}}>Reject</button>
              </>}
              <button className="btn btn-secondary" onClick={()=>setShowViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editForm && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Edit Volunteer</div>
              <button className="btn btn-ghost btn-icon" onClick={()=>setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:16}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={editForm.name} onChange={e=>setEditForm({...editForm,name:e.target.value})}/></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={editForm.phone} onChange={e=>setEditForm({...editForm,phone:e.target.value})}/></div>
                <div className="form-group"><label className="form-label">Age</label><input className="form-input" type="number" value={editForm.age} onChange={e=>setEditForm({...editForm,age:e.target.value})}/></div>
                <div className="form-group"><label className="form-label">Gender</label>
                  <select className="form-input form-select" value={editForm.gender} onChange={e=>setEditForm({...editForm,gender:e.target.value})}>
                    <option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
                  </select>
                </div>
                <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Address</label><input className="form-input" value={editForm.address} onChange={e=>setEditForm({...editForm,address:e.target.value})}/></div>
                <div className="form-group"><label className="form-label">Status</label>
                  <select className="form-input form-select" value={editForm.status} onChange={e=>setEditForm({...editForm,status:e.target.value})}>
                    <option value="active">Active</option><option value="pending">Pending</option><option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Total Hours</label><input className="form-input" type="number" value={editForm.totalHours} onChange={e=>setEditForm({...editForm,totalHours:Number(e.target.value)})}/></div>
                <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Bio</label><textarea className="form-input form-textarea" value={editForm.bio||''} onChange={e=>setEditForm({...editForm,bio:e.target.value})} rows={2}/></div>
              </div>
              <div className="form-group">
                <label className="form-label">Skills</label>
                <div className="checkbox-group">{SKILLS_LIST.map(s=><div key={s} className="checkbox-chip"><input type="checkbox" id={`es-${s}`} checked={(editForm.skills||[]).includes(s)} onChange={()=>toggleArr('skills',s)}/><label htmlFor={`es-${s}`}>{s}</label></div>)}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Availability</label>
                <div className="checkbox-group">{AVAILABILITY_LIST.map(a=><div key={a} className="checkbox-chip"><input type="checkbox" id={`ea-${a}`} checked={(editForm.availability||[]).includes(a)} onChange={()=>toggleArr('availability',a)}/><label htmlFor={`ea-${a}`}>{a}</label></div>)}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
