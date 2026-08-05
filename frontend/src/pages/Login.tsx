import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);



  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Google login successful');
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
      toast.error('Google authentication error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://placementstudytracker.onrender.com:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
        toast.success('Login successful');
      } else {
        toast.error('Login failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8">
    <main className="relative z-10 w-full max-w-[440px] px-margin-mobile md:px-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Login Card */}
      <div className="bg-surface-container rounded-2xl border border-outline-variant/50 p-gutter md:p-8 shadow-2xl shadow-black/50 backdrop-blur-sm flex flex-col gap-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,220,229,0.15)]">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-stack-gap">
          <div className="w-12 h-12 rounded-xl bg-surface-container-highest border border-outline-variant/50 flex items-center justify-center mb-2 shadow-inner">
            <span className="material-symbols-outlined text-primary-fixed-dim text-[28px] fill">explore</span>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Welcome back
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Log in to your command center to continue tracking your placements.
          </p>
        </div>

        {/* OAuth Section */}
        <button 
          type="button" 
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-transparent border border-outline-variant text-on-surface hover:border-primary-fixed-dim/50 hover:bg-surface-variant/30 transition-all group font-body-md text-body-md cursor-pointer"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-outline-variant/40"></div>
          <span className="font-label-caps text-label-caps text-outline uppercase tracking-widest">Or</span>
          <div className="flex-1 h-px bg-outline-variant/40"></div>
        </div>

        {/* Email Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-stack-gap">
            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase ml-1" htmlFor="email">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary-fixed-dim transition-colors text-[20px]">mail</span>
                <input 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pl-10 pr-4 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-fixed-dim focus:ring-1 focus:ring-primary-fixed-dim/50 transition-all" 
                  id="email" 
                  placeholder="student@university.edu" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between ml-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="password">Password</label>
                <Link className="font-label-caps text-label-caps text-primary-fixed-dim hover:text-primary-fixed transition-colors" to="#">Forgot?</Link>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary-fixed-dim transition-colors text-[20px]">lock</span>
                <input 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pl-10 pr-10 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-fixed-dim focus:ring-1 focus:ring-primary-fixed-dim/50 transition-all" 
                  id="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors focus:outline-none" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button className="w-full py-3 px-4 rounded-lg bg-primary-fixed-dim text-on-primary-fixed font-body-md text-body-md font-semibold hover:bg-primary-fixed transition-colors shadow-[0_0_15px_rgba(0,220,229,0.15)] hover:shadow-[0_0_20px_rgba(0,220,229,0.25)] flex justify-center items-center gap-2 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent" type="submit">
            Log in securely
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>
      </div>

      {/* Footer Link */}
      <p className="mt-8 text-center font-body-md text-body-md text-on-surface-variant">
        Don't have an account? 
        <Link className="text-primary-fixed-dim font-medium hover:text-primary-fixed transition-colors underline-offset-4 hover:underline ml-1" to="/signup">
          Create an account
        </Link>
      </p>
    </main>
    </div>
  );
};

export default Login;
