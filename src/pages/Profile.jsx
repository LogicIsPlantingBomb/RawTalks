import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [particles, setParticles] = useState([]);
  const [moonGlow, setMoonGlow] = useState(1);

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

  const handleLogout = () => {
    logout();
    navigate('/');
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
        
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/feed')} className="text-gray-300 hover:text-gray-100 transition-colors">
            Browse Opinions
          </button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-lime-400 mb-6"
        >
          Your Profile
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/80 border border-gray-800 rounded-lg p-8 mb-6"
        >
          <h2 className="text-xl font-semibold text-lime-400 mb-4">User Details</h2>
          <div className="space-y-2 text-gray-300">
            <p>
              <span className="font-medium text-gray-400">Name: </span>
              {user?.fullname?.firstname} {user?.fullname?.lastname}
            </p>
            <p>
              <span className="font-medium text-gray-400">Email: </span>
              {user?.email}
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/80 border border-gray-800 rounded-lg p-8"
        >
          <h2 className="text-xl font-semibold text-lime-400 mb-4">Actions</h2>
          <div className="flex flex-wrap gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to="/create-opinion" 
                className="px-6 py-3 bg-lime-600/20 border border-lime-600 text-lime-400 rounded-md hover:bg-lime-600/30 transition-colors duration-300 inline-block"
              >
                Create Opinion
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to="/feed" 
                className="px-6 py-3 bg-purple-600/20 border border-purple-600 text-purple-400 rounded-md hover:bg-purple-600/30 transition-colors duration-300 inline-block"
              >
                Feed
              </Link>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600/20 border border-red-600 text-red-400 rounded-md hover:bg-red-600/30 transition-colors duration-300"
            >
              Logout
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
