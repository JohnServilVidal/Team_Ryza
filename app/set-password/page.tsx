'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'An error occurred.');
        setLoading(false);
        return;
      }

      alert('Password successfully set! You can now log in using your new password.');
      router.push('/login');
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Itakda ang Bagong Password
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Unang pag-login para sa: <span className="font-semibold">{email}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSetPassword}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bagong Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ulitin ang Bagong Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200 font-semibold"
          >
            {loading ? 'Saving...' : 'Save Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetPasswordForm />
    </Suspense>
  );
}