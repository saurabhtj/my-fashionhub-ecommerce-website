'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || 'Failed to register');
      }

      router.push('/login?registered=true');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #c8c8c8;
          font-family: 'Inter', sans-serif;
          padding: 24px;
        }

        .register-card {
          display: flex;
          width: 100%;
          max-width: 900px;
          min-height: 560px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
          background: #fff;
        }

        /* Left side */
        .register-left {
          flex: 1;
          min-height: 400px;
          position: relative;
          overflow: hidden;
        }

        .register-left img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Right side */
        .register-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 52px;
          position: relative;
          background: #fff;
        }

        /* Logo */
        .register-logo {
          display: block;
          width: 100px;
          height: auto;
          margin: 0 auto 32px;
        }

        /* Heading */
        .register-heading {
          font-size: 28px;
          font-weight: 800;
          color: #111;
          text-align: center;
          margin: 0 0 28px 0;
          letter-spacing: -0.3px;
        }

        /* Form */
        .register-form {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .form-field {
          margin-bottom: 14px;
        }

        .form-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          color: #9ca3af;
          margin-bottom: 5px;
          letter-spacing: 0.01em;
        }

        .form-input {
          width: 100%;
          min-height: 44px;
          padding: 11px 16px;
          background: #f3f4f6;
          border: none;
          border-radius: 10px;
          font-size: 13.5px;
          color: #374151;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: box-shadow 0.2s;
          box-sizing: border-box;
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .form-input:focus {
          box-shadow: 0 0 0 2px rgba(61, 184, 245, 0.4);
        }

        .password-wrapper {
          position: relative;
        }

        .password-wrapper .form-input {
          padding-right: 44px;
        }

        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          color: #9ca3af;
          display: flex;
          align-items: center;
        }

        .eye-btn:hover {
          color: #6b7280;
        }

        /* Sign Up button */
        .signup-btn {
          width: 100%;
          padding: 13px;
          border-radius: 50px;
          background: linear-gradient(90deg, #5ec5f7 0%, #3db8f5 100%);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          border: none;
          cursor: pointer;
          margin-top: 18px;
          margin-bottom: 14px;
          letter-spacing: 0.3px;
          transition: opacity 0.2s, transform 0.1s;
        }

        .signup-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .signup-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* Terms text */
        .terms-text {
          font-size: 10.5px;
          color: #6b7280;
          text-align: center;
          line-height: 1.55;
          margin-bottom: 12px;
        }

        .terms-text a {
          text-decoration: underline;
          color: #6b7280;
        }

        .terms-text a:hover {
          color: #374151;
        }

        /* Already have account */
        .already-account {
          font-size: 11.5px;
          font-weight: 600;
          color: #374151;
          text-align: center;
        }

        .already-account a {
          color: #3db8f5;
          text-decoration: none;
          margin-left: 3px;
        }

        .already-account a:hover {
          text-decoration: underline;
        }

        /* Back link */
        .back-link {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 20px;
          font-weight: 700;
          color: #111;
          text-decoration: none;
          white-space: nowrap;
          transition: opacity 0.2s;
        }

        .back-link:hover {
          opacity: 0.65;
        }

        /* Error */
        .error-msg {
          background: #fef2f2;
          color: #ef4444;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 12px;
          text-align: center;
          margin-bottom: 12px;
        }

        /* Responsive */
        @media (max-width: 700px) {
          .register-left {
            display: none;
          }
          .register-card {
            max-width: 440px;
          }
          .register-right {
            padding: 40px 28px 80px;
          }
        }
      `}</style>

      <div className="register-page">
        <div className="register-card">
          {/* Left: Abstract 3D image */}
          <div className="register-left">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
              alt="Abstract 3D shapes"
            />
          </div>

          {/* Right: Form */}
          <div className="register-right">
            {/* Logo */}
            <Image
              src="/oruma-logo.png"
              alt="ORUMA"
              width={100}
              height={79}
              className="register-logo"
            />

            <h1 className="register-heading">Create an account</h1>

            <form className="register-form" onSubmit={handleSubmit}>
              {error && <div className="error-msg">{error}</div>}

              {/* Email field */}
              <div className="form-field">
                <label htmlFor="reg-email" className="form-label">Email*</label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="mail@gmail.com"
                  autoComplete="email"
                />
              </div>

              {/* Password field */}
              <div className="form-field">
                <label htmlFor="reg-password" className="form-label">Password*</label>
                <div className="password-wrapper">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="••••••••••••••••"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      /* Eye open */
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      /* Eye crossed */
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Sign Up button */}
              <button
                id="signup-btn"
                type="submit"
                disabled={loading}
                className="signup-btn"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>

              {/* Terms */}
              <p className="terms-text">
                By clicking the &quot;Sign up&quot; button, you are creating account and therefore you agree to Fashion Hub
                Store&apos;s{' '}
                <a href="#">Terms of Use</a> and{' '}
                <a href="#">Privacy Policy.</a>
              </p>

              {/* Already have account */}
              <div className="already-account">
                Already have an account?
                <Link href="/login">Log in</Link>
              </div>
            </form>

            {/* Back link */}
            <Link href="/" className="back-link">
              ← Back
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
