import React, { createContext, useContext, useState, useEffect } from 'react';
import db from '../utils/db';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('vrs_current_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      if (parsed.role === 'volunteer') {
        const vol = db.getVolunteerByUserId(parsed.id);
        setVolunteer(vol);
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = db.getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password.' };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('vrs_current_user', JSON.stringify(safeUser));
    if (safeUser.role === 'volunteer') {
      const vol = db.getVolunteerByUserId(safeUser.id);
      setVolunteer(vol);
    }
    return { success: true, user: safeUser };
  };

  const register = (formData) => {
    const existing = db.getUserByEmail(formData.email);
    if (existing) return { success: false, error: 'An account with this email already exists.' };

    const userId = 'user-' + Date.now();
    const newUser = {
      id: userId,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'volunteer',
      createdAt: new Date().toISOString(),
    };
    db.createUser(newUser);

    const volunteerId = 'vol-' + Date.now();
    const newVolunteer = {
      id: volunteerId,
      userId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: parseInt(formData.age),
      gender: formData.gender,
      address: formData.address,
      skills: formData.skills || [],
      availability: formData.availability || [],
      interests: formData.interests || [],
      bio: formData.bio || '',
      status: 'pending',
      registeredAt: new Date().toISOString(),
      events: [],
      totalHours: 0,
    };
    db.createVolunteer(newVolunteer);

    db.addActivity({
      id: 'act-' + Date.now(),
      type: 'registration',
      message: `New volunteer ${formData.name} registered`,
      timestamp: new Date().toISOString(),
    });

    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    setVolunteer(newVolunteer);
    localStorage.setItem('vrs_current_user', JSON.stringify(safeUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setVolunteer(null);
    localStorage.removeItem('vrs_current_user');
  };

  const refreshVolunteer = () => {
    if (user?.role === 'volunteer') {
      const vol = db.getVolunteerByUserId(user.id);
      setVolunteer(vol);
    }
  };

  return (
    <AuthContext.Provider value={{ user, volunteer, loading, login, register, logout, refreshVolunteer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
