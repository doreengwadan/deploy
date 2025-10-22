'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }
  
      setSuccess('Registration successful! You can now log in.');
      setError('');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
  
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
  };
  
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-green-600 text-center">Mzuzu Application Register</h1>

        {error && (
          <p className="mb-4 rounded bg-red-100 px-4 py-2 text-red-700">{error}</p>
        )}

        {success && (
          <p className="mb-4 rounded bg-green-100 px-4 py-2 text-green-700">{success}</p>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-gray-700 font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring focus:ring-green-200"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring focus:ring-green-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-gray-700 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring focus:ring-green-200"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-gray-700 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring focus:ring-green-200"
            />
          </div>

          <button
            type="submit"
            className="mt-4 rounded bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-500"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-green-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}
