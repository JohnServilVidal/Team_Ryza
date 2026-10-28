'use client';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    // 1. Burahin ang session o user data sa localStorage kung mayroon man
    localStorage.removeItem('user');
    
    // 2. I-redirect pabalik sa login page
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome sa Dashboard!</h1>
        <p className="mb-6 text-gray-600">Matagumpay kang nakapag-login sa Hope, Inc. ERP system.</p>
        
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition duration-200 font-semibold"
        >
          Mag-logout
        </button>
      </div>
    </div>
  );
}