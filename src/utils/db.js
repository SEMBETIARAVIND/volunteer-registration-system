// In-memory + localStorage database simulation
const DB_KEY = 'volunteer_system_db';

const defaultData = {
  users: [
    {
      id: 'admin-001',
      name: 'System Administrator',
      email: 'admin@volunteerportal.org',
      password: 'Admin@123',
      role: 'admin',
      createdAt: new Date('2024-01-01').toISOString(),
    }
  ],
  volunteers: [
    {
      id: 'vol-001',
      userId: 'vol-user-001',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43210',
      age: 26,
      gender: 'Female',
      address: 'Hyderabad, Telangana',
      skills: ['Teaching', 'Medical Aid'],
      availability: ['Weekends', 'Evenings'],
      interests: ['Education', 'Healthcare'],
      status: 'active',
      registeredAt: new Date('2024-02-15').toISOString(),
      events: ['evt-001', 'evt-002'],
      totalHours: 48,
      bio: 'Passionate about education and healthcare volunteering.',
    },
    {
      id: 'vol-002',
      userId: 'vol-user-002',
      name: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      phone: '+91 87654 32109',
      age: 31,
      gender: 'Male',
      address: 'Pune, Maharashtra',
      skills: ['Technology', 'Fundraising'],
      availability: ['Weekdays'],
      interests: ['Environment', 'Technology'],
      status: 'active',
      registeredAt: new Date('2024-03-10').toISOString(),
      events: ['evt-001', 'evt-003'],
      totalHours: 32,
      bio: 'Tech enthusiast supporting environmental causes.',
    },
    {
      id: 'vol-003',
      userId: 'vol-user-003',
      name: 'Meena Patel',
      email: 'meena.patel@example.com',
      phone: '+91 76543 21098',
      age: 23,
      gender: 'Female',
      address: 'Ahmedabad, Gujarat',
      skills: ['Cooking', 'Event Management'],
      availability: ['Weekends'],
      interests: ['Food Security', 'Community'],
      status: 'pending',
      registeredAt: new Date('2024-04-05').toISOString(),
      events: [],
      totalHours: 0,
      bio: 'Love organizing community meals and events.',
    },
    {
      id: 'vol-004',
      userId: 'vol-user-004',
      name: 'Arjun Nair',
      email: 'arjun.nair@example.com',
      phone: '+91 65432 10987',
      age: 35,
      gender: 'Male',
      address: 'Kochi, Kerala',
      skills: ['Legal Aid', 'Counseling'],
      availability: ['Evenings', 'Weekends'],
      interests: ['Human Rights', 'Mental Health'],
      status: 'active',
      registeredAt: new Date('2024-01-20').toISOString(),
      events: ['evt-002'],
      totalHours: 64,
      bio: 'Lawyer committed to human rights and mental health support.',
    },
    {
      id: 'vol-005',
      userId: 'vol-user-005',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      phone: '+91 54321 09876',
      age: 28,
      gender: 'Female',
      address: 'Nizamabad, Telangana',
      skills: ['Teaching', 'Arts & Crafts'],
      availability: ['Weekdays', 'Weekends'],
      interests: ['Education', 'Arts'],
      status: 'inactive',
      registeredAt: new Date('2023-11-15').toISOString(),
      events: ['evt-003'],
      totalHours: 20,
      bio: 'Art teacher who volunteers for rural education.',
    },
  ],
  events: [
    {
      id: 'evt-001',
      title: 'Annual Community Health Camp',
      description: 'Free medical checkups, blood tests, and health awareness sessions for underprivileged communities.',
      category: 'Healthcare',
      date: '2024-07-15',
      time: '09:00 AM',
      endTime: '05:00 PM',
      location: 'Community Center, Hyderabad',
      volunteersNeeded: 20,
      volunteersRegistered: ['vol-001', 'vol-002'],
      status: 'upcoming',
      organizer: 'admin-001',
      image: 'health',
      createdAt: new Date('2024-06-01').toISOString(),
      hours: 8,
    },
    {
      id: 'evt-002',
      title: 'Tree Plantation Drive',
      description: 'Join us to plant 500 trees across the city parks. Contribute to a greener tomorrow.',
      category: 'Environment',
      date: '2024-06-30',
      time: '07:00 AM',
      endTime: '12:00 PM',
      location: 'Lumbini Park, Hyderabad',
      volunteersNeeded: 50,
      volunteersRegistered: ['vol-001', 'vol-004'],
      status: 'upcoming',
      organizer: 'admin-001',
      image: 'environment',
      createdAt: new Date('2024-05-20').toISOString(),
      hours: 5,
    },
    {
      id: 'evt-003',
      title: 'Rural School Education Drive',
      description: 'Teaching basic literacy, math, and science to children in rural Telangana.',
      category: 'Education',
      date: '2024-05-20',
      time: '10:00 AM',
      endTime: '04:00 PM',
      location: 'Nizamabad District Schools',
      volunteersNeeded: 15,
      volunteersRegistered: ['vol-002', 'vol-005'],
      status: 'completed',
      organizer: 'admin-001',
      image: 'education',
      createdAt: new Date('2024-04-10').toISOString(),
      hours: 6,
    },
  ],
  activities: [
    { id: 'act-001', type: 'registration', message: 'New volunteer Priya Sharma registered', timestamp: new Date('2024-06-10T10:30:00').toISOString() },
    { id: 'act-002', type: 'event', message: 'Health Camp event created', timestamp: new Date('2024-06-09T14:20:00').toISOString() },
    { id: 'act-003', type: 'approval', message: 'Rahul Verma application approved', timestamp: new Date('2024-06-08T11:00:00').toISOString() },
    { id: 'act-004', type: 'registration', message: 'Meena Patel submitted application', timestamp: new Date('2024-06-07T09:45:00').toISOString() },
  ]
};

export const db = {
  init() {
    if (!localStorage.getItem(DB_KEY)) {
      localStorage.setItem(DB_KEY, JSON.stringify(defaultData));
    }
  },

  getData() {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : defaultData;
  },

  saveData(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  },

  // Users
  getUsers() { return this.getData().users; },
  getUserByEmail(email) { return this.getData().users.find(u => u.email === email); },
  getUserById(id) { return this.getData().users.find(u => u.id === id); },
  createUser(user) {
    const data = this.getData();
    data.users.push(user);
    this.saveData(data);
    return user;
  },

  // Volunteers
  getVolunteers() { return this.getData().volunteers; },
  getVolunteerById(id) { return this.getData().volunteers.find(v => v.id === id); },
  getVolunteerByUserId(userId) { return this.getData().volunteers.find(v => v.userId === userId); },
  createVolunteer(volunteer) {
    const data = this.getData();
    data.volunteers.push(volunteer);
    this.saveData(data);
    return volunteer;
  },
  updateVolunteer(id, updates) {
    const data = this.getData();
    const idx = data.volunteers.findIndex(v => v.id === id);
    if (idx !== -1) {
      data.volunteers[idx] = { ...data.volunteers[idx], ...updates };
      this.saveData(data);
      return data.volunteers[idx];
    }
    return null;
  },
  deleteVolunteer(id) {
    const data = this.getData();
    data.volunteers = data.volunteers.filter(v => v.id !== id);
    this.saveData(data);
  },

  // Events
  getEvents() { return this.getData().events; },
  getEventById(id) { return this.getData().events.find(e => e.id === id); },
  createEvent(event) {
    const data = this.getData();
    data.events.push(event);
    this.saveData(data);
    return event;
  },
  updateEvent(id, updates) {
    const data = this.getData();
    const idx = data.events.findIndex(e => e.id === id);
    if (idx !== -1) {
      data.events[idx] = { ...data.events[idx], ...updates };
      this.saveData(data);
      return data.events[idx];
    }
    return null;
  },
  deleteEvent(id) {
    const data = this.getData();
    data.events = data.events.filter(e => e.id !== id);
    this.saveData(data);
  },
  registerVolunteerForEvent(eventId, volunteerId) {
    const data = this.getData();
    const eventIdx = data.events.findIndex(e => e.id === eventId);
    const volIdx = data.volunteers.findIndex(v => v.id === volunteerId);
    if (eventIdx !== -1 && volIdx !== -1) {
      if (!data.events[eventIdx].volunteersRegistered.includes(volunteerId)) {
        data.events[eventIdx].volunteersRegistered.push(volunteerId);
      }
      if (!data.volunteers[volIdx].events.includes(eventId)) {
        data.volunteers[volIdx].events.push(eventId);
      }
      this.saveData(data);
    }
  },

  // Activities
  getActivities() { return this.getData().activities; },
  addActivity(activity) {
    const data = this.getData();
    data.activities.unshift(activity);
    if (data.activities.length > 50) data.activities = data.activities.slice(0, 50);
    this.saveData(data);
  },

  // Stats
  getStats() {
    const data = this.getData();
    const totalVolunteers = data.volunteers.length;
    const activeVolunteers = data.volunteers.filter(v => v.status === 'active').length;
    const pendingApprovals = data.volunteers.filter(v => v.status === 'pending').length;
    const totalEvents = data.events.length;
    const upcomingEvents = data.events.filter(e => e.status === 'upcoming').length;
    const totalHours = data.volunteers.reduce((sum, v) => sum + (v.totalHours || 0), 0);

    const byCategory = {};
    data.events.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + 1;
    });

    const monthlyData = [
      { month: 'Jan', volunteers: 8, events: 2 },
      { month: 'Feb', volunteers: 15, events: 3 },
      { month: 'Mar', volunteers: 22, events: 4 },
      { month: 'Apr', volunteers: 18, events: 3 },
      { month: 'May', volunteers: 30, events: 5 },
      { month: 'Jun', volunteers: totalVolunteers, events: totalEvents },
    ];

    return { totalVolunteers, activeVolunteers, pendingApprovals, totalEvents, upcomingEvents, totalHours, byCategory, monthlyData };
  }
};

db.init();
export default db;
