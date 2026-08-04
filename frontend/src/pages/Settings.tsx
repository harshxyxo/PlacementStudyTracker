import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch('http://localhost:8080/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setName(data.name || '');
          setEmail(data.email || '');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email }),
      });
      if (response.ok) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/api/user/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (response.ok) {
        toast.success('Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
      } else {
        toast.error('Failed to change password. Make sure current password is correct.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout>
      <div className="p-gutter md:p-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-8">Settings</h1>
        
        <div className="flex flex-col gap-8">
          <div className="bg-surface-container rounded-2xl border border-outline-variant/50 p-6 shadow-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Profile Information</h2>
            <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase ml-1">Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 px-4 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-fixed-dim" 
                  placeholder="Your Name" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase ml-1">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 px-4 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-fixed-dim" 
                  placeholder="your@email.com" 
                />
              </div>
              <button type="submit" className="self-start py-2 px-6 rounded-lg bg-primary-fixed-dim text-on-primary-fixed font-semibold hover:bg-primary-fixed transition-colors">
                Save Changes
              </button>
            </form>
          </div>

          <div className="bg-surface-container rounded-2xl border border-outline-variant/50 p-6 shadow-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase ml-1">Current Password</label>
                <input 
                  type="password" 
                  value={oldPassword} 
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 px-4 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-fixed-dim" 
                  placeholder="••••••••" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase ml-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 px-4 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-fixed-dim" 
                  placeholder="••••••••" 
                />
              </div>
              <button type="submit" className="self-start py-2 px-6 rounded-lg bg-primary-fixed-dim text-on-primary-fixed font-semibold hover:bg-primary-fixed transition-colors">
                Update Password
              </button>
            </form>
          </div>

          <div className="bg-surface-container rounded-2xl border border-error/50 p-6 shadow-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Account Actions</h2>
            <button onClick={handleLogout} className="py-2 px-6 rounded-lg bg-error text-on-error font-semibold hover:bg-error/90 transition-colors">
              Log Out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
