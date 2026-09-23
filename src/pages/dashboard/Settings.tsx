import React, { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiFetch } from '../../services/api';

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', organization: '', location: '' });

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, organization: user.organization, location: user.location });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setLoading(true);
      setError('');
      setSuccess(false);
      await apiFetch(`/users/${user.id}`, { method: 'PUT', body: JSON.stringify(form) });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-8 text-center text-gray-500">Not authenticated.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
      
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}
      {success && <div className="p-4 bg-green-50 text-green-600 rounded-lg">Settings saved successfully.</div>}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email (Read Only)</label>
            <input value={user.email} disabled className="input-field bg-gray-50 text-gray-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role (Read Only)</label>
            <input value={user.role} disabled className="input-field bg-gray-50 text-gray-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Organization</label>
            <input required value={form.organization} onChange={e=>setForm({...form, organization: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Location</label>
            <input required value={form.location} onChange={e=>setForm({...form, location: e.target.value})} className="input-field" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 w-full justify-center">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
