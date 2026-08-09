import React, { useState } from 'react';
import { LogIn, UserPlus, ShieldCheck, Lock, Mail, Building, User } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister ? { name, email, password, companyName } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      onLoginSuccess(data.token, data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser = {
      id: 'user_guest',
      name: 'Guest Operations Manager',
      email: 'guest@demo.com',
      companyName: 'Demo Foods Corp'
    };
    onLoginSuccess('guest_jwt_token_demo_mode', guestUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white text-sm"
        >
          ✕
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {isRegister ? 'Create FoodCost Account' : 'Sign In to FoodCost'}
          </h3>
          <p className="text-xs text-gray-400">Manage production batches, run what-if simulations, and query AI Advisor.</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Operations Manager"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="input-label">Company / Facility Name</label>
                <input
                  type="text"
                  placeholder="Apex Foods Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            </>
          )}

          <div>
            <label className="input-label">Work Email</label>
            <input
              type="email"
              required
              placeholder="manager@foodcorp.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field text-xs"
            />
          </div>

          <div>
            <label className="input-label">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-2.5 text-xs shadow-lg shadow-emerald-950/40"
          >
            {loading ? 'Authenticating...' : (isRegister ? 'Register Account' : 'Sign In')}
          </button>
        </form>

        <div className="relative border-t border-gray-800 pt-4 text-center">
          <span className="text-xs text-gray-500 block mb-3">Or explore instantly without signing up:</span>
          <button
            onClick={handleGuestLogin}
            className="w-full btn btn-secondary py-2 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/40"
          >
            ⚡ One-Click Guest Demo Login
          </button>
        </div>

        <div className="text-center text-xs text-gray-400">
          {isRegister ? (
            <span>Already have an account? <button onClick={() => setIsRegister(false)} className="text-emerald-400 font-bold underline">Sign In</button></span>
          ) : (
            <span>Don't have an account? <button onClick={() => setIsRegister(true)} className="text-emerald-400 font-bold underline">Register</button></span>
          )}
        </div>

      </div>
    </div>
  );
}
