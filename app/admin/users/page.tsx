'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth/middleware';
import { getUserProfile } from '@/lib/auth/user-profiles';
import { Users, Mail, Trash2, Eye, EyeOff } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('sales_rep');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkAuthAndLoadUsers();
  }, []);

  async function checkAuthAndLoadUsers() {
    try {
      // Check if user is admin/director
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }

      // Fetch user profile to check role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile || !['admin', 'director'].includes(profile.role)) {
        setError('You do not have permission to access this page');
        setLoading(false);
        return;
      }

      setAuthorized(true);

      // Load all users
      const { data: allUsers, error: usersError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(allUsers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send invite');
      }

      setSuccess(`Invite sent to ${inviteEmail}`);
      setInviteEmail('');
      setInviteRole('sales_rep');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invite');
    } finally {
      setInviting(false);
    }
  }

  async function handleDeactivateUser(userId: string) {
    if (!confirm('Are you sure you want to deactivate this user?')) return;

    try {
      const response = await fetch(`/api/users?id=${userId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to deactivate user');

      setUsers(users.map(u => u.id === userId ? { ...u, is_active: false } : u));
      setSuccess('User deactivated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate user');
    }
  }

  async function handleChangeRole(userId: string, newRole: string) {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      });

      if (!response.ok) throw new Error('Failed to update role');

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setSuccess(`User role updated to ${newRole}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold">User Management</h1>
          </div>
          <p className="text-gray-600">Send invites, manage roles, and deactivate users</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Invite Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Send Invite</h2>
          <form onSubmit={handleSendInvite} className="flex gap-4 flex-wrap">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="user@example.com"
              className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sales_rep">Sales Rep</option>
              <option value="ops">Operations</option>
              <option value="director">Director</option>
            </select>
            <button
              type="submit"
              disabled={inviting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Mail size={18} />
              {inviting ? 'Sending...' : 'Send Invite'}
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="sales_rep">Sales Rep</option>
                      <option value="ops">Operations</option>
                      <option value="director">Director</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        user.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {user.is_active && (
                      <button
                        onClick={() => handleDeactivateUser(user.id)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No users yet. Send an invite to get started!</p>
          </div>
        )}
      </div>
    </main>
  );
}
