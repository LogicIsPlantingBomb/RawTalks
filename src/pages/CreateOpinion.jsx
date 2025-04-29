import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { useAuth } from '../context/AuthContext';

const CreateOpinion = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [particles, setParticles] = useState([]);
  const [moonGlow, setMoonGlow] = useState(1);

  // Create falling particles
  useState(() => {
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
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/opinions`, {
        content
      }, {
        withCredentials: true
      });
      navigate('/feed');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create opinion');
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: "rgba(132, 204, 22, 0.2)",
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.98
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
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate('/profile')} className="text-gray-300 hover:text-gray-100 transition-colors">
                <span className="text-lime-400">@</span>{user?.fullname?.firstname || "User"}
              </button>
              <button onClick={() => navigate('/feed')} className="px-4 py-2 bg-lime-600/20 border border-lime-600 text-lime-400 rounded-md hover:bg-lime-600/30 transition-all duration-300">
                Browse Opinions
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="text-gray-300 hover:text-gray-100 transition-colors">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="px-4 py-2 bg-lime-600/20 border border-lime-600 text-lime-400 rounded-md hover:bg-lime-600/30 transition-all duration-300">
                Sign Up
              </button>
            </>
          )}
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/80 border border-gray-800 rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold text-lime-400 mb-6">Create Opinion</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="content" className="block text-gray-400 mb-2">
                Your Opinion
              </label>
              <textarea
                id="content"
                className="w-full h-40 p-4 bg-gray-900/20 border border-gray-800 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400"
                rows="4"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts here..."
                required
              />
            </div>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              type="submit"
              className="px-6 py-3 bg-lime-600/20 border border-lime-600 text-lime-400 rounded-md hover:bg-lime-600/30 transition-all duration-300"
            >
              Post Opinion
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateOpinion;
