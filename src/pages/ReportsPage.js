import React, { useState, useEffect } from 'react';
import { Download, BarChart3, Users, Calendar, Clock, TrendingUp, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import db from '../utils/db';

const COLORS = ['#1a56db','#0f9d58','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#f97316'];

export default function ReportsPage() {
  const [stats, setStats] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setStats(db.getStats());
    setVolunteers(db.getVolunteers());
    setEvents(db.getEvents());
  }, []);

  if (!stats) return null;

  // Skills distribution
  const skillsCount = {};
  volunteers.forEach(v => (v.skills||[]).forEach(s => { skillsCount[s] = (skillsCount[s]||0)+1; }));
  const skillsData = Object.entries(skillsCount).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([name,value])=>({name,value}));

  // Gender distribution
  const genderCount = {};
  volunteers.forEach(v => { genderCount[v.gender||'Unknown']=(genderCount[v.gender||'Unknown']||0)+1; });
  const genderData = Object.entries(genderCount).map(([name,value])=>({name,value}));

  // Age groups
  const ageGroups = {'16-20':0,'21-25':0,'26-30':0,'31-40':0,'40+':0};
  volunteers.forEach(v => {
    const a = parseInt(v.age)||0;
    if(a<=20) ageGroups['16-20']++;
    else if(a<=25) ageGroups['21-25']++;
    else if(a<=30) ageGroups['26-30']++;
    else if(a<=40) ageGroups['31-40']++;
    else ageGroups['40+']++;
  });
  const ageData = Object.entries(ageGroups).map(([name,value])=>({name,value}));

  // Status breakdown
  const statusData = [
    {name:'Active',value:volunteers.filter(v=>v.status==='active').length},
    {name:'Pending',value:volunteers.filter(v=>v.status==='pending').length},
    {name:'Inactive',value:volunteers.filter(v=>v.status==='inactive').length},
  ];

  // Event category
  const catCount = {};
  events.forEach(e=>{ catCount[e.category]=(catCount[e.category]||0)+1; });
  const categoryData = Object.entries(catCount).map(([name,value])=>({name,value}));

  // Monthly trends (synthetic + real)
  const monthlyTrend = [
    {month:'Jan',registrations:8,events:2,hours:120},
    {month:'Feb',registrations:15,events:3,hours:210},
    {month:'Mar',registrations:22,events:4,hours:340},
    {month:'Apr',registrations:18,events:3,hours:280},
    {month:'May',registrations:30,events:5,hours:450},
    {month:'Jun',registrations:volunteers.length,events:events.length,hours:volunteers.reduce((s,v)=>s+(v.totalHours||0),0)},
  ];

  // Top volunteers by hours
  const topVols = [...volunteers].sort((a,b)=>(b.totalHours||0)-(a.totalHours||0)).slice(0,5);
  const avatarColors = ['#1a56db','#0f9d58','#f59e0b','#8b5cf6','#ec4899'];
  const avatarColor = (name) => avatarColors[(name?.charCodeAt(0)||0) % avatarColors.length];
  const initials = (name) => name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();

  const exportReport = () => {
    const lines = [
      'VOLUNTEERHUB — SYSTEM REPORT',
      `Generated: ${new Date().toLocaleString('en-IN')}`,
      '',
      '=== OVERVIEW ===',
      `Total Volunteers: ${stats.totalVolunteers}`,
      `Active Volunteers: ${stats.activeVolunteers}`,
      `Pending Approvals: ${stats.pendingApprovals}`,
      `Total Events: ${stats.totalEvents}`,
      `Upcoming Events: ${stats.upcomingEvents}`,
      `Total Hours Volunteered: ${stats.totalHours}`,
      '',
      '=== VOLUNTEERS BY STATUS ===',
      ...statusData.map(s=>`${s.name}: ${s.value}`),
      '',
      '=== EVENTS BY CATEGORY ===',
      ...categoryData.map(c=>`${c.name}: ${c.value}`),
      '',
      '=== TOP SKILLS ===',
      ...skillsData.map(s=>`${s.name}: ${s.value} volunteers`),
      '',
      '=== TOP VOLUNTEERS (by hours) ===',
      ...topVols.map(v=>`${v.name} — ${v.totalHours}h (${v.events?.length||0} events)`),
      '',
      '=== EVENTS LIST ===',
      ...events.map(e=>`[${e.status.toUpperCase()}] ${e.title} | ${e.date} | ${e.location} | ${e.volunteersRegistered?.length||0}/${e.volunteersNeeded} volunteers`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='volunteer_report.txt'; a.click();
  };

  const exportCSV = () => {
    const headers = ['Name','Email','Status','Age','Gender','Skills','Events','Hours','Registered'];
    const rows = volunteers.map(v=>[v.name,v.email,v.status,v.age,v.gender,(v.skills||[]).join(';'),v.events?.length||0,v.totalHours||0,new Date(v.registeredAt).toLocaleDateString()]);
    const csv = [headers,...rows].map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='volunteers_full.csv'; a.click();
  };

  const TABS = ['overview','volunteers','events'];

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Reports & Analytics</h1>
            <p className="page-subtitle">Comprehensive insights into your volunteer program</p>
          </div>
          <div style={{display:'flex',gap:10}}>
            <button className="btn btn-secondary" onClick={exportCSV}><Download size={16}/> Export CSV</button>
            <button className="btn btn-primary" onClick={exportReport}><FileText size={16}/> Full Report</button>
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:14,marginBottom:28}}>
        {[
          {icon:Users,label:'Total Volunteers',value:stats.totalVolunteers,color:'#1a56db',bg:'var(--primary-light)'},
          {icon:Users,label:'Active',value:stats.activeVolunteers,color:'#0f9d58',bg:'var(--secondary-light)'},
          {icon:Calendar,label:'Total Events',value:stats.totalEvents,color:'#8b5cf6',bg:'#ede9fe'},
          {icon:Calendar,label:'Upcoming',value:stats.upcomingEvents,color:'#f59e0b',bg:'var(--accent-light)'},
          {icon:Clock,label:'Total Hours',value:stats.totalHours,color:'#ec4899',bg:'#fce7f3'},
          {icon:TrendingUp,label:'Avg Hours/Vol',value:volunteers.length ? Math.round(stats.totalHours/volunteers.length) : 0,color:'#06b6d4',bg:'#e0f2fe'},
        ].map((s,i)=>(
          <div key={i} className="stat-card" style={{padding:18}}>
            <div className="stat-icon" style={{background:s.bg,width:44,height:44}}>
              <s.icon size={20} color={s.color}/>
            </div>
            <div>
              <div className="stat-value" style={{fontSize:24}}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map(t=><button key={t} className={`tab-btn ${activeTab===t?'active':''}`} onClick={()=>setActiveTab(t)} style={{textTransform:'capitalize'}}>{t}</button>)}
      </div>

      {activeTab === 'overview' && (
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {/* Monthly Trends */}
          <div className="card">
            <div className="card-header"><div style={{fontSize:15,fontWeight:700}}>Monthly Growth Trends</div></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="grReg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1a56db" stopOpacity={0.2}/><stop offset="95%" stopColor="#1a56db" stopOpacity={0}/></linearGradient>
                    <linearGradient id="grHrs" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0f9d58" stopOpacity={0.2}/><stop offset="95%" stopColor="#0f9d58" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                  <XAxis dataKey="month" tick={{fontSize:12,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:12,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{borderRadius:8,border:'1px solid var(--border)',fontSize:13}}/>
                  <Legend wrapperStyle={{fontSize:13}}/>
                  <Area type="monotone" dataKey="registrations" stroke="#1a56db" fill="url(#grReg)" name="Registrations" strokeWidth={2}/>
                  <Area type="monotone" dataKey="hours" stroke="#0f9d58" fill="url(#grHrs)" name="Hours" strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            <div className="card">
              <div className="card-header"><div style={{fontSize:15,fontWeight:700}}>Volunteer Status</div></div>
              <div className="card-body" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                      {statusData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius:8,fontSize:13}}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div style={{fontSize:15,fontWeight:700}}>Events by Category</div></div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                      {categoryData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                    </Pie>
                    <Legend iconType="circle" iconSize={10} wrapperStyle={{fontSize:12}}/>
                    <Tooltip contentStyle={{borderRadius:8,fontSize:13}}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'volunteers' && (
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            <div className="card">
              <div className="card-header"><div style={{fontSize:15,fontWeight:700}}>Top Skills</div><div style={{fontSize:12,color:'var(--text-muted)'}}>Most common volunteer skills</div></div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={skillsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false}/>
                    <XAxis type="number" tick={{fontSize:12,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
                    <YAxis dataKey="name" type="category" tick={{fontSize:12,fill:'var(--text-muted)'}} axisLine={false} tickLine={false} width={100}/>
                    <Tooltip contentStyle={{borderRadius:8,fontSize:13}}/>
                    <Bar dataKey="value" fill="#1a56db" radius={[0,4,4,0]} name="Volunteers"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div className="card">
                <div className="card-header"><div style={{fontSize:15,fontWeight:700}}>Gender Distribution</div></div>
                <div className="card-body" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={genderData} cx="50%" cy="50%" outerRadius={65} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false} style={{fontSize:11}}>
                        {genderData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius:8,fontSize:13}}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card">
                <div className="card-header"><div style={{fontSize:15,fontWeight:700}}>Age Groups</div></div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={ageData}>
                      <XAxis dataKey="name" tick={{fontSize:11,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fontSize:11}} axisLine={false} tickLine={false}/>
                      <Tooltip contentStyle={{borderRadius:8,fontSize:13}}/>
                      <Bar dataKey="value" fill="#8b5cf6" radius={[3,3,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div style={{fontSize:15,fontWeight:700}}>Top Volunteers by Hours</div></div>
            <div className="card-body" style={{padding:0}}>
              {topVols.map((v,i)=>(
                <div key={v.id} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 24px',borderBottom:i<topVols.length-1?'1px solid var(--border)':'none'}}>
                  <div style={{width:28,height:28,borderRadius:'50%',background:i===0?'#f59e0b':i===1?'#94a3b8':i===2?'#cd7f32':'var(--surface-3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:i<3?'#fff':'var(--text-muted)'}}>{i+1}</div>
                  <div className="avatar" style={{background:avatarColor(v.name),color:'#fff',fontSize:13}}>{initials(v.name)}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600}}>{v.name}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)'}}>{v.events?.length||0} events • {v.address}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:18,fontWeight:700,color:'var(--primary)'}}>{v.totalHours||0}h</div>
                    <div style={{fontSize:11,color:'var(--text-muted)'}}>total hours</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20}}>
            <div className="card">
              <div className="card-header"><div style={{fontSize:15,fontWeight:700}}>Volunteer Signups per Event</div></div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={events.map(e=>({name:e.title.substring(0,20)+'...',registered:e.volunteersRegistered?.length||0,needed:e.volunteersNeeded}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                    <XAxis dataKey="name" tick={{fontSize:11,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:12,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{borderRadius:8,fontSize:13}}/>
                    <Legend wrapperStyle={{fontSize:12}}/>
                    <Bar dataKey="registered" fill="#1a56db" name="Registered" radius={[3,3,0,0]}/>
                    <Bar dataKey="needed" fill="#e2e8f0" name="Needed" radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div style={{fontSize:15,fontWeight:700}}>Event Status</div></div>
              <div className="card-body" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={[{name:'Upcoming',value:events.filter(e=>e.status==='upcoming').length},{name:'Completed',value:events.filter(e=>e.status==='completed').length},{name:'Cancelled',value:events.filter(e=>e.status==='cancelled').length}]} cx="50%" cy="50%" outerRadius={75} dataKey="value">
                      {[0,1,2].map(i=><Cell key={i} fill={COLORS[i]}/>)}
                    </Pie>
                    <Legend iconType="circle" iconSize={10} wrapperStyle={{fontSize:12}}/>
                    <Tooltip contentStyle={{borderRadius:8,fontSize:13}}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead><tr><th>Event</th><th>Category</th><th>Date</th><th>Location</th><th>Fill Rate</th><th>Status</th></tr></thead>
              <tbody>
                {events.map(e=>{
                  const pct=Math.round((e.volunteersRegistered?.length||0)/e.volunteersNeeded*100);
                  return (
                    <tr key={e.id}>
                      <td style={{fontWeight:600,color:'var(--text-primary)'}}>{e.title}</td>
                      <td><span className="chip chip-gray" style={{fontSize:11}}>{e.category}</span></td>
                      <td style={{fontSize:13}}>{new Date(e.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                      <td style={{fontSize:13}}>{e.location}</td>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <div className="progress-bar" style={{width:80}}><div className="progress-fill" style={{width:`${pct}%`}}/></div>
                          <span style={{fontSize:12,color:'var(--text-muted)'}}>{pct}%</span>
                        </div>
                      </td>
                      <td><span className={`badge badge-${e.status==='upcoming'?'upcoming':e.status==='completed'?'completed':'inactive'}`}>{e.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
