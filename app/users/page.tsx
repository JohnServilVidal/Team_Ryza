'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface Profile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string>('staff');
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchProfilesAndRole = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (userProfile) {
        setCurrentUserRole(userProfile.role);
      }
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching profiles:', error);
    else setProfiles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfilesAndRole();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (currentUserRole !== 'super_admin') {
      alert('Super Admin lamang ang may pahintulot na magbago ng role!');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      alert('Error updating role: ' + error.message);
    } else {
      alert('Matagumpay na nabago ang role!');
      fetchProfilesAndRole();
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-900/60 text-purple-300 border-purple-700';
      case 'admin':
        return 'bg-blue-900/60 text-blue-300 border-blue-700';
      case 'developer':
        return 'bg-emerald-900/60 text-emerald-300 border-emerald-700';
      case 'tester':
        return 'bg-amber-900/60 text-amber-300 border-amber-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/" className="text-sm text-blue-400 hover:underline">← Back to Dashboard</Link>
            <h1 className="text-3xl font-bold mt-2">Team & System User Management</h1>
            <p className="text-sm text-slate-400 mt-1">
              Your Current System Access: <span className="text-purple-400 font-bold uppercase">{currentUserRole}</span>
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-4">User Email</th>
                <th className="p-4">Assigned System Role</th>
                <th className="p-4">Date Registered</th>
                <th className="p-4 text-right">Role Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-slate-500">Loading system users...</td>
                </tr>
              ) : profiles.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-medium text-white">{p.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase border ${getRoleBadgeColor(p.role)}`}>
                      {p.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    {currentUserRole === 'super_admin' ? (
                      <select
                        value={p.role}
                        onChange={(e) => handleRoleChange(p.id, e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-white text-xs rounded p-1.5 focus:outline-none focus:border-purple-500"
                      >
                        <option value="staff">Staff</option>
                        <option value="tester">QA / Tester</option>
                        <option value="developer">Developer</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Super Admin Only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}