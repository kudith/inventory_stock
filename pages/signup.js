import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import Input from '../components/Input';
import axios from 'axios';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      // Check if the user already exists
      const existingUser = await axios.get(`/api/auth/user`, { params: { email } });
      if (existingUser.data) {
        setError('Email is already registered.');
        return;
      }

      // Sign up the user
      await axios.post('/api/auth/signup', { name, email, password });

      // Sign in the user
      await signIn('credentials', { email, password });
    } catch (err) {
      // Enhanced error handling to capture specific issues
      if (err.response) {
        // Server responded with a status other than 2xx
        setError(`Error: ${err.response.data.message}`);
      } else if (err.request) {
        // Request was made but no response was received
        setError('Error: No response from the server.');
      } else {
        // Something else happened
        setError(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="max-w-xl w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-4">Sign Up</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Input label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Sign Up
            </button>
          </form>
          <button onClick={() => signIn('google')} className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
            Sign Up with Google
          </button>
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/">
              <span className="text-blue-500 hover:underline">Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
