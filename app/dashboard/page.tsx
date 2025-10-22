'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // TEMP: fetch user from localStorage or context (you can replace with JWT/auth later)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect to login if not logged in
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <p>Loading...</p>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-3xl rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-green-600">Welcome, {user.name}!</h1>
        <p className="mb-6 text-gray-700">Your email: {user.email}</p>

        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            className="rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-500 transition-colors"
          >
            Log Out
          </button>

          <button
            onClick={() => alert('Add your dashboard functionality here!')}
            className="rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-500 transition-colors"
          >
            Dashboard Action
          </button>
        </div>

        <div className="mt-8 text-gray-600">
          <p>This is a placeholder dashboard page.</p>
          <p>You can now implement user-specific data, charts, tables, or features here.</p>
        </div>
      </div>
    </main>
  );
}
