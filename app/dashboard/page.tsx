'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiUsers, FiBarChart2, FiSettings } from 'react-icons/fi';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-green-600">Admin Dashboard</h2>
        </div>
        <nav className="mt-10 flex flex-col gap-2">
          <button className="flex items-center gap-3 px-6 py-2 hover:bg-gray-200 transition-colors">
            <FiBarChart2 /> Overview
          </button>
          <button className="flex items-center gap-3 px-6 py-2 hover:bg-gray-200 transition-colors">
            <FiUsers /> Users
          </button>
          <button className="flex items-center gap-3 px-6 py-2 hover:bg-gray-200 transition-colors">
            <FiSettings /> Settings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-2 mt-auto text-red-600 hover:bg-red-100 transition-colors"
          >
            <FiLogOut /> Log Out
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </header>

        {/* Stats cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow">
            <h3 className="text-gray-500">Total Users</h3>
            <p className="mt-2 text-2xl font-bold">120</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow">
            <h3 className="text-gray-500">Active Sessions</h3>
            <p className="mt-2 text-2xl font-bold">35</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow">
            <h3 className="text-gray-500">New Signups</h3>
            <p className="mt-2 text-2xl font-bold">8</p>
          </div>
        </section>

        {/* Charts placeholder */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg bg-white p-6 shadow h-64 flex items-center justify-center text-gray-400">
            Chart Placeholder
          </div>
          <div className="rounded-lg bg-white p-6 shadow h-64 flex items-center justify-center text-gray-400">
            Chart Placeholder
          </div>
        </section>

        {/* Actions / Quick links */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition-colors">
              Add User
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors">
              Generate Report
            </button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400 transition-colors">
              Settings
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
