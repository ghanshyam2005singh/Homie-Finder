'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { app } from '@/lib/firebase'; // Make sure firebase is initialized here
import { supabase } from '@/lib/supabaseClient';
import Footer from '@/app/components/Footer';

export default function VerifyPage() {
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');
  const auth = getAuth(app);

  useEffect(() => {
    if (!phone) {
      router.push('/signup');
      return;
    }

    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: (response: any) => {
        // reCAPTCHA solved
      },
    });

    signInWithPhoneNumber(auth, phone, verifier)
      .then((result) => {
        setConfirmationResult(result);
      })
      .catch((err) => {
        console.error('OTP error:', err);
        setError('Failed to send OTP. Make sure your phone number is correct and reCAPTCHA is allowed.');
      });
  }, []);

  const handleVerify = async () => {
    if (!otp || !confirmationResult) return;

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const firebaseUser = result.user;

      const userInfo = {
        name: sessionStorage.getItem('name') || '',
        phone: sessionStorage.getItem('phone') || '',
        userType: sessionStorage.getItem('userType') || '',
        image_url: sessionStorage.getItem('image') || '',
        created_at: new Date().toISOString(),
      };

      const { error: supabaseError } = await supabase.from('users').insert([userInfo]);
      if (supabaseError) throw supabaseError;

      sessionStorage.clear();
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid OTP. Please try again.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
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

      <section className="flex flex-col items-center justify-center flex-1 px-6 py-16">
        <h2 className="text-3xl font-bold mb-4 text-blue-700">Verify Your Phone</h2>
        <p className="text-gray-600 mb-6">Enter the OTP sent to your phone number</p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="border px-4 py-3 rounded-lg mb-4 w-64 text-center text-lg"
        />
        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-64 text-white px-6 py-3 rounded-full font-semibold transition ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* ✅ This is required even if hidden */}
        <div id="recaptcha-container"></div>
      </section>

      <Footer />
    </main>
  );
}
