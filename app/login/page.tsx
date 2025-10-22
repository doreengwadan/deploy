'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Example: Replace with your authentication API call
    if (email === 'user@mzuzu.com' && password === 'password123') {
      router.push('/dashboard'); // redirect after successful login
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-green-600 text-center">Mzuzu Application Login</h1>

        {error && (
          <p className="mb-4 rounded bg-red-100 px-4 py-2 text-red-700">{error}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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

          <button
            type="submit"
            className="mt-4 rounded bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-500"
          >
            Log In
          </button>
        </form>

        <p className="mt-4 text-center text-gray-500">
          Don't have an account?{' '}
          <a href="/register" className="text-green-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </main>
  );
}
