import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    navigate('/');
  };

  const handleGoogleLogin = () => {
    login();
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <Link to="/" className="font-serif text-3xl font-black tracking-tighter text-byl-dark mb-8 inline-block">
            BYLDaily
          </Link>
          <h1 className="font-serif text-4xl font-black tracking-tight text-byl-dark mb-4 leading-none">
            Welcome Back.
          </h1>
          <p className="text-byl-dark/60 font-medium">
            Join the conversation and stay beyond labels.
          </p>
        </div>

        <div className="bg-byl-light border border-byl-dark/10 p-8 md:p-10 shadow-2xl transition-colors duration-300">
          {!showEmailForm ? (
            <div className="space-y-4">
              {/* Social Login */}
              <button 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center space-x-3 border border-byl-dark py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-black/5 transition-all"
              >
                <Chrome size={18} />
                <span>Continue with Google</span>
              </button>

              <button 
                onClick={() => setShowEmailForm(true)}
                className="w-full flex items-center justify-center space-x-3 border border-byl-dark py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-black/5 transition-all"
              >
                <Mail size={18} />
                <span>Continue with Email</span>
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setShowEmailForm(false)}
                className="text-[10px] uppercase font-bold tracking-widest text-byl-dark/40 hover:text-byl-dark mb-6 flex items-center transition-colors"
              >
                <ArrowRight size={14} className="rotate-180 mr-2" />
                Back to options
              </button>
              
              {/* Email Login */}
              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-byl-dark/5 border-none px-4 py-4 text-sm font-medium focus:ring-1 focus:ring-byl-purple transition-all outline-none text-byl-dark"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                   <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Password</label>
                  <input 
                    type="password" 
                    required
                    className="w-full bg-byl-dark/5 border-none px-4 py-4 text-sm font-medium focus:ring-1 focus:ring-byl-purple transition-all outline-none text-byl-dark"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-byl-dark text-byl-light py-5 text-[11px] uppercase tracking-widest font-bold hover:bg-byl-purple transition-all flex items-center justify-center space-x-2"
                >
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </>
          )}

          <div className="mt-8 text-center">
            <p className="text-[11px] font-bold text-byl-dark/40 uppercase tracking-widest">
              Don't have an account? <Link to="/register" className="text-byl-purple hover:underline">Create One</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
