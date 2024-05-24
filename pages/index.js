import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Input from '../components/Input';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!email || !password) {
        throw new Error('Email and password are required.');
      }
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result.error) {
        throw new Error('Invalid email or password.');
      }
      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
              <div className="flex items-center">
                <p>{error}</p>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} autoComplete="off">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="relative mb-4">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="form-checkbox"
                />
                <span>{showPassword ? 'Hide Password' : 'Show Password'}</span>
              </label>
            </div>
            <button type="submit" className="bg-blue-500 text-white w-full py-2 mt-4 rounded-md transition duration-300 hover:bg-blue-600" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <button onClick={() => signIn('google')} className="bg-gray-600 text-white w-full py-2 mt-4 rounded-md transition duration-300 hover:bg-gray-700">
            Login with Google
          </button>
          <p className="mt-4 text-center">
            Forgot your password?{' '}
            <Link href="/forgot-password">
              <span className="text-blue-500">Reset Password</span>
            </Link>
          </p>
          <p className="mt-2 text-center">
            Don't have an account?{' '}
            <Link href="/signup">
              <span className="text-blue-500">Sign Up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
