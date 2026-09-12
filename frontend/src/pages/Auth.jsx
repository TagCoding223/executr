import React, { useState } from 'react';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';


const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Auth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(BACKEND_BASE_URL + 'api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with the server.');
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);

      window.location.href = '/';

    } catch (err) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0B0D14] font-sans transition-colors duration-200">

      {/* Left Panel - Image Background (Desktop Only) */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/auth_side_bg.webp')" }}
      >
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/30 dark:from-black/90 dark:via-black/60 dark:to-black/50"></div>

        {/* Tagline Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white h-full pb-24">
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Executr Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Tranquility in your environment.<br />
            <span className="text-blue-400">Power in your execution.</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-md">
            Join the arena. Write pure logic, execute safely in isolated containers, and let our integrated AI handle the rest.
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Controls */}
      <div className="w-full lg:w-1/2 flex flex-col relative">

        {/* Top Navigation (Back to Home) */}
        <div className="absolute top-6 left-6 lg:left-8">
          <a href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <ArrowLeft size={16} />
            Back to Home
          </a>
        </div>

        {/* Auth Form Container */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12">
          <div className="w-full max-w-md text-center">

            {/* Logo */}
            <div className="flex justify-center items-center cursor-pointer mb-8">
              <span className="text-4xl font-bold tracking-tight">
                <span className="text-blue-600 dark:text-blue-500">Exec</span>
                <span className="text-gray-900 dark:text-white">utr</span>
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Sign in or create an account to access your progress.
            </p>




            {/* Error Banner */}
            {error && (
              <div className="mb-4 flex items-start gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/50">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Loading State or Google Button */}
            <div className="flex justify-center w-full">
              {isLoading ? (
                <div className="flex items-center gap-2 text-gray-500 py-2">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => setError('Google sign-in popup failed or was closed.')}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                />
              )}
            </div>

            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              By continuing, you agree to Executr's <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>.
            </div>
          </div>
        </div>
      </div>


      {/* login custom design */}
      {/* Google OAuth Button */}
      {/* <button
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-[#1A1D24] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-[#0B0D14] transition-all shadow-sm"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.71 22.36 9.97H12V14.28H17.92C17.67 15.68 16.89 16.88 15.71 17.67V20.44H19.28C21.36 18.52 22.56 15.65 22.56 12.25Z" fill="#4285F4" />
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.44L15.71 17.67C14.73 18.33 13.47 18.73 12 18.73C9.15 18.73 6.74 16.81 5.88 14.23H2.21V17.08C4.01 20.65 7.69 23 12 23Z" fill="#34A853" />
                <path d="M5.88 14.23C5.66 13.57 5.54 12.89 5.54 12.18C5.54 11.47 5.66 10.79 5.88 10.13V7.28H2.21C1.47 8.76 1.05 10.42 1.05 12.18C1.05 13.94 1.47 15.6 2.21 17.08L5.88 14.23Z" fill="#FBBC05" />
                <path d="M12 5.64C13.62 5.64 15.06 6.19 16.2 7.28L19.35 4.13C17.45 2.37 14.97 1.36 12 1.36C7.69 1.36 4.01 3.71 2.21 7.28L5.88 10.13C6.74 7.55 9.15 5.64 12 5.64Z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button> */}
    </div>


  );
};

export default Auth;

/*

*/