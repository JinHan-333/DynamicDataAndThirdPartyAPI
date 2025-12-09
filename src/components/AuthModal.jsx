import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { signin, signup } from '../services/api';
import { Mail, Lock, User, Eye, EyeOff, X } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '', // Added for visual match, though backend might not use yet
    lastName: ''   // Added for visual match
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setFormData({ username: '', email: '', password: '', confirmPassword: '', firstName: '', lastName: '' });
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        // Backend expects username, email, password
        // We can construct username from First Last if needed, or just use email as username if backend allowed, 
        // but backend requires username. Let's use "FirstName LastName" or just a separate field?
        // Design shows First Name, Last Name, Email, Password. 
        // Let's combine First+Last as username for now or just ask for username?
        // The design image definitely shows First/Last Name.
        // I will map First+Last to simple username for now to satisfy backend requirement.
        
        const username = formData.username || `${formData.firstName}${formData.lastName}`.toLowerCase().replace(/\s/g, '') || formData.email.split('@')[0];
        
        const data = await signup(username, formData.email, formData.password);
        login(data.user, data.token);
      } else {
        const data = await signin(formData.email, formData.password);
        login(data.user, data.token);
      }
      onClose();
    } catch (err) {
      setError(err.message || `Failed to ${mode === 'signin' ? 'sign in' : 'sign up'}`);
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-black border border-white p-8 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-white mb-8 uppercase tracking-wider">
          {mode === 'signin' ? 'Log In' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded p-3 text-sm text-center">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div className="bg-transparent border border-white/30 rounded flex items-center px-3 py-3 focus-within:border-white transition-colors">
                <User size={20} className="text-gray-400 mr-3" />
                <input
                  type="text" // Using as generic text input, conceptually First Name
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="bg-transparent text-white w-full focus:outline-none placeholder-gray-500 text-sm"
                  required={mode === 'signup'}
                />
              </div>
               <div className="bg-transparent border border-white/30 rounded flex items-center px-3 py-3 focus-within:border-white transition-colors">
                <User size={20} className="text-gray-400 mr-3" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="bg-transparent text-white w-full focus:outline-none placeholder-gray-500 text-sm"
                  required={mode === 'signup'}
                />
              </div>
            </>
          )}

          <div className="bg-transparent border border-white/30 rounded flex items-center px-3 py-3 focus-within:border-white transition-colors">
            <Mail size={20} className="text-gray-400 mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-transparent text-white w-full focus:outline-none placeholder-gray-500 text-sm"
              required
            />
          </div>

          <div className="bg-transparent border border-white/30 rounded flex items-center px-3 py-3 focus-within:border-white transition-colors">
            <Lock size={20} className="text-gray-400 mr-3" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="bg-transparent text-white w-full focus:outline-none placeholder-gray-500 text-sm"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {mode === 'signup' && (
             <div className="bg-transparent border border-white/30 rounded flex items-center px-3 py-3 focus-within:border-white transition-colors">
                <Lock size={20} className="text-gray-400 mr-3" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-transparent text-white w-full focus:outline-none placeholder-gray-500 text-sm"
                  required={mode === 'signup'}
                />
                 <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
          )}

          <button
            type="submit"
            className="w-full bg-white text-black font-bold uppercase py-3 rounded hover:bg-gray-200 transition-colors mt-6"
          >
            {mode === 'signin' ? 'Log In' : 'Sign Up'}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={toggleMode}
              className="text-white hover:text-gray-300 text-sm"
            >
              or, {mode === 'signin' ? 'sign up' : 'log in'}
            </button>
          </div>
          
           {mode === 'signup' && (
            <div className="text-center mt-4">
                 <div className="flex items-center gap-2 justify-center">
                    <input type="checkbox" className="bg-transparent border-white" required />
                    <span className="text-[10px] text-gray-400">By registering, you agree to our Terms and Conditions</span>
                 </div>
            </div>
           )}

        </form>
      </div>
    </div>
  );
}
