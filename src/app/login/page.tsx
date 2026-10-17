'use client';

import { useState, useEffect, Suspense } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const loginStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .login-page {
    min-height: 100vh;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', Arial, sans-serif;
    padding: 24px;
  }

  .login-box {
    width: 100%;
    max-width: 380px;
  }

  .login-heading {
    font-size: 28px;
    font-weight: 800;
    color: #111111;
    margin: 0 0 4px 0;
    line-height: 1.2;
    letter-spacing: -0.3px;
  }

  .login-subheading {
    font-size: 13.5px;
    color: #555;
    margin: 0 0 24px 0;
  }

  .login-subheading a {
    color: #1a73e8;
    text-decoration: none;
    font-weight: 500;
  }

  .login-subheading a:hover {
    text-decoration: underline;
  }

  .login-error {
    background: #fef2f2;
    color: #dc2626;
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 13px;
    margin-bottom: 14px;
  }

  .login-success {
    background: #f0fdf4;
    color: #15803d;
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 13px;
    margin-bottom: 14px;
  }

  .login-input {
    display: block;
    width: 100%;
    min-height: 44px;
    padding: 11px 14px;
    font-size: 14px;
    font-family: 'Inter', Arial, sans-serif;
    color: #111;
    border: 1.5px solid #d1d5db;
    border-radius: 4px;
    outline: none;
    background: #fff;
    box-sizing: border-box;
    margin-bottom: 12px;
    transition: border-color 0.15s;
  }

  .login-input::placeholder {
    color: #9ca3af;
    font-size: 14px;
  }

  .login-input:focus {
    border-color: #1a73e8;
    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.15);
  }

  .remember-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 18px;
  }

  .remember-checkbox {
    width: 16px;
    height: 16px;
    accent-color: #1a73e8;
    cursor: pointer;
    flex-shrink: 0;
  }

  .remember-label {
    font-size: 13.5px;
    color: #374151;
    cursor: pointer;
    user-select: none;
  }

  .signin-btn {
    display: block;
    width: 100%;
    padding: 13px;
    background: #1a73e8;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    font-family: 'Inter', Arial, sans-serif;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    margin-bottom: 12px;
    transition: background 0.15s, opacity 0.15s;
    letter-spacing: 0.1px;
  }

  .signin-btn:hover:not(:disabled) {
    background: #1557b0;
  }

  .signin-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .google-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 11px 14px;
    background: #fff;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    font-family: 'Inter', Arial, sans-serif;
    border: 1.5px solid #d1d5db;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    margin-bottom: 18px;
    box-sizing: border-box;
  }

  .google-btn:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  .forgot-link {
    font-size: 13.5px;
    color: #1a73e8;
    text-decoration: none;
    font-weight: 500;
  }

  .forgot-link:hover {
    text-decoration: underline;
  }
`;

// Inner component that uses useSearchParams — must be wrapped in Suspense
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const registered = searchParams.get('registered') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);

  useEffect(() => {
    let active = true;

    getProviders()
      .then((providers) => {
        if (active) {
          setGoogleEnabled(Boolean(providers?.google));
        }
      })
      .catch((providerError: unknown) => {
        console.error('Unable to load sign-in providers:', providerError);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Invalid email or password');
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-box">
      <h1 className="login-heading">Sign in</h1>
      <p className="login-subheading">
        or <Link href="/register">create an account</Link>
      </p>
      {registered && (
        <div className="login-success" role="status">
          Account created successfully. You can now sign in.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {error && <div className="login-error">{error}</div>}

        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          placeholder="Email"
        />

        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          placeholder="Password"
        />

        <div className="remember-row">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="remember-checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember-me" className="remember-label">
            Remember me
          </label>
        </div>

        <button
          id="login-submit-btn"
          type="submit"
          disabled={loading}
          className="signin-btn"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        {googleEnabled && (
          <button
            id="login-google-btn"
            type="button"
            onClick={() => signIn('google', { callbackUrl })}
            className="google-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>
        )}

        <a href="#" className="forgot-link">Forgotten your password?</a>
      </form>
    </div>
  );
}

// Exported page wraps the form in Suspense to satisfy Next.js static prerendering
export default function LoginPage() {
  return (
    <>
      <style>{loginStyles}</style>
      <div className="login-page">
        <Suspense fallback={<div className="login-box" style={{ textAlign: 'center', color: '#9ca3af' }}>Loading…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}
