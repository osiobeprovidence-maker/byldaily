import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, Chrome, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Using login to simulate auto-login after register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Simulate registration
    login(email, password);
    navigate('/');
  };

  const handleGoogleRegister = () => {
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
            Join the Pulse.
          </h1>
          <p className="text-byl-dark/60 font-medium">
            Create an account to start sharing and exploring.
          </p>
        </div>

        <div className="bg-byl-light border border-byl-dark/10 p-8 md:p-10 shadow-2xl transition-colors duration-300">
          {!showEmailForm ? (
            <div className="space-y-4">
              {/* Social Login */}
              <button 
                onClick={handleGoogleRegister}
                className="w-full flex items-center justify-center space-x-3 border border-byl-dark py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-black/5 transition-all"
              >
                <Chrome size={18} />
                <span>Sign up with Google</span>
              </button>

              <button 
                onClick={() => setShowEmailForm(true)}
                className="w-full flex items-center justify-center space-x-3 border border-byl-dark py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-black/5 transition-all"
              >
                <Mail size={18} />
                <span>Sign up with Email</span>
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
              
              {/* Registration Form */}
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-byl-dark/20" size={16} />
                    <input 
                      type="text" 
                      required
                      className="w-full bg-byl-dark/5 border-none pl-12 pr-4 py-4 text-sm font-medium focus:ring-1 focus:ring-byl-purple transition-all outline-none text-byl-dark"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-byl-dark/20" size={16} />
                    <input 
                      type="email" 
                      required
                      className="w-full bg-byl-dark/5 border-none pl-12 pr-4 py-4 text-sm font-medium focus:ring-1 focus:ring-byl-purple transition-all outline-none text-byl-dark"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                   <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Password</label>
                   <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-byl-dark/20" size={16} />
                    <input 
                      type="password" 
                      required
                      className="w-full bg-byl-dark/5 border-none pl-12 pr-4 py-4 text-sm font-medium focus:ring-1 focus:ring-byl-purple transition-all outline-none text-byl-dark"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                   <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Confirm Password</label>
                   <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-byl-dark/20" size={16} />
                    <input 
                      type="password" 
                      required
                      className="w-full bg-byl-dark/5 border-none pl-12 pr-4 py-4 text-sm font-medium focus:ring-1 focus:ring-byl-purple transition-all outline-none text-byl-dark"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-byl-dark text-byl-light py-5 text-[11px] uppercase tracking-widest font-bold hover:bg-byl-purple transition-all flex items-center justify-center space-x-2"
                >
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </>
          )}

          <div className="mt-8 text-center">
            <p className="text-[11px] font-bold text-byl-dark/40 uppercase tracking-widest">
              Already have an account? <Link to="/login" className="text-byl-purple hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
