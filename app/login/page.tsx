'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Footer from '@/app/components/Footer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');

    const { data, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .eq('password', password)
      .single();

    if (fetchError || !data) {
      setError('Invalid phone or password');
    } else {
      sessionStorage.setItem('user', JSON.stringify(data));
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      
      {/* Navbar */}
      <header className="bg-white shadow-md py-4 px-6 w-full z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-blue-600">Homie Finder</h1>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm text-blue-600 font-medium hover:underline">Login</a>
            <a href="/signup" className="text-sm text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition">Sign Up</a>
            <a href="https://iron-industry.tech" target="_blank" className="text-sm text-gray-600 hover:underline">Contact Us</a>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <section className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h1>

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md mb-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md mb-4"
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md"
          >
            Login
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
