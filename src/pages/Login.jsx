import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [particles, setParticles] = useState([]);
  const [moonGlow, setMoonGlow] = useState(1);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/profile";
  
  useEffect(() => {
    // If already authenticated, redirect to profile
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);

  // Create falling particles
  useEffect(() => {
    const initialParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * -50,
      size: Math.random() * 6 + 4,
      speed: Math.random() * 0.5 + 0.3,
      sway: Math.random() * 0.2 - 0.1,
      opacity: Math.random() * 0.3 + 0.2
    }));
    setParticles(initialParticles);

    const animateParticles = () => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          y: p.y + p.speed * 0.5,
          x: p.x + p.sway * 0.2,
          rotation: (p.rotation || 0) + p.sway * 0.5
        })).filter(p => p.y < 100)
      );

      if (Math.random() > 0.8) {
        setParticles(prev => [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * 100,
            y: -10,
            size: Math.random() * 6 + 4,
            speed: Math.random() * 0.5 + 0.3,
            sway: Math.random() * 0.2 - 0.1,
            opacity: Math.random() * 0.3 + 0.2
          }
        ].slice(-30));
      }
    };

    // Moon glow pulse
    const moonInterval = setInterval(() => {
      setMoonGlow(0.9);
      setTimeout(() => setMoonGlow(1), 1500);
    }, 8000);

    const particleInterval = setInterval(animateParticles, 30);
    return () => {
      clearInterval(particleInterval);
      clearInterval(moonInterval);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    const result = await login(email, password);
    if (result.success) {
      navigate(from);
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Falling particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            background: "radial-gradient(circle, rgba(132, 204, 22, 0.9) 0%, transparent 70%)",
            filter: "blur(1px)",
            transform: `rotate(${particle.rotation || 0}deg)`,
            transition: 'transform 0.3s ease, opacity 0.5s ease'
          }}
        />
      ))}
      
      {/* White moon in top right corner */}
      <motion.div 
        className="absolute top-10 right-10 w-24 h-24 rounded-full bg-white filter blur-xl"
        animate={{
          opacity: moonGlow * 0.7,
          scale: moonGlow
        }}
        transition={{ duration: 3 }}
        style={{
          boxShadow: '0 0 100px rgba(255, 255, 255, 0.7)'
        }}
      />

      {/* Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="bg-gray-900/40 backdrop-blur-sm px-6 py-4 flex justify-between items-center shadow-lg z-50 relative"
      >
        <button onClick={() => navigate('/')} className="text-lime-400 text-2xl font-bold tracking-tighter">
          TruthStream
        </button>
        
        <button onClick={() => navigate('/register')} className="text-gray-300 hover:text-gray-100 transition-colors">
          Register
        </button>
      </motion.nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-lime-400 mb-6">Login</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-3 rounded-md ${
                  isSubmitting 
                    ? 'bg-gray-700/50 border border-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-lime-600/30 border border-lime-600 text-lime-400 hover:bg-lime-600/40'
                } transition-colors duration-300`}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </motion.button>
            </form>
            
            <div className="mt-6 text-center text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-lime-400 hover:text-lime-300 transition-colors">
                Register
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
