'use client';

import { useState } from 'react';
import Footer from '@/app/components/Footer';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    userType: '',
    image: null as File | null,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      sessionStorage.setItem('name', form.name);
      sessionStorage.setItem('phone', form.phone);
      sessionStorage.setItem('userType', form.userType);

      if (form.image) {
        const reader = new FileReader();
        reader.onloadend = () => {
          sessionStorage.setItem('image', reader.result as string);
          router.push(`/verify?phone=${encodeURIComponent(form.phone)}`);
        };
        reader.readAsDataURL(form.image);
      } else {
        sessionStorage.setItem('image', '');
        router.push(`/verify?phone=${encodeURIComponent(form.phone)}`);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-800 flex flex-col">
      <header className="bg-slate-50 shadow-md py-4 px-6 w-full z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-6">
          <h1 className="text-2xl font-extrabold text-blue-600 whitespace-nowrap">Homie Finder</h1>
          <div className="flex items-center gap-4 whitespace-nowrap">
            <a href="/login" className="text-sm text-blue-600 font-medium hover:underline">Login</a>
            <a href="/signup" className="text-sm text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition">Sign Up</a>
            <a href="https://iron-industry.tech" target="_blank" className="text-sm text-gray-600 hover:underline">Contact Us</a>
          </div>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg space-y-6"
        >
          <h1 className="text-3xl font-bold text-center text-blue-700">Create an Account</h1>

          <div className="flex flex-col space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="Phone Number"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              name="userType"
              value={form.userType}
              onChange={handleChange}
              required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select User Type</option>
              <option value="owner">Room Owner</option>
              <option value="student">Student Looking for Room</option>
            </select>

            {/* Image upload */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 border-2 border-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                {form.image ? (
                  <Image
                    src={URL.createObjectURL(form.image)}
                    alt="Uploaded"
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm text-center">Upload Photo</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-gray-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition disabled:opacity-60"
          >
            {loading ? 'Processing...' : 'Continue'}
          </button>

          {error && <p className="text-red-600 text-center">{error}</p>}
        </form>
      </section>

      <Footer />
    </main>
  );
}
