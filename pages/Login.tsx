
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LogIn, ShieldAlert, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.post('/auth/login', { email, password });
      login(data);
    } catch (err: any) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-orange-100 text-orange-600 rounded-2xl mb-4">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900">PVMS Login</h2>
          <p className="text-slate-500 mt-2 font-medium">National Enforcement Portal</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Official Email</label>
            <input
              type="email"
              required
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="name@gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />}
            Sign In to Dashboard
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">A Digital India Initiative</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
             <button onClick={() => {setEmail('admin@pvms.gov.in'); setPassword('password123');}} className="text-[10px] bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">Demo Admin</button>
             <button onClick={() => {setEmail('meera@ulb.gov.in'); setPassword('password123');}} className="text-[10px] bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">Demo Officer</button>
             <button onClick={() => {setEmail('rajesh@citizen.in'); setPassword('password123');}} className="text-[10px] bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">Demo Citizen</button>
          </div>
        </div>
      </div>
    </div>
  );
};
