import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { useAuth } from '../context/AuthContext';

const Feed = () => {
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [particles, setParticles] = useState([]);
  const [moonGlow, setMoonGlow] = useState(1);

  const fetchOpinions = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/opinions`, {
        withCredentials: true
      });
      setOpinions(res.data.data);
    } catch (error) {
      console.error('Error fetching opinions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpinions();
  }, []);

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

  const handleVote = async (id, voteType) => {
    if (!isAuthenticated) {
      alert("Please login to vote");
      return;
    }
  
    // Optimistic UI update
    setOpinions(prev => prev.map(opinion => {
      if (opinion._id !== id) return opinion;
      
      const updated = {...opinion};
      const userId = user._id;
      
      if (voteType === 'upvote') {
        const alreadyUpvoted = updated.upvotes.includes(userId);
        updated.upvotes = alreadyUpvoted 
          ? updated.upvotes.filter(u => u !== userId) 
          : [...updated.upvotes, userId];
        if (!alreadyUpvoted && updated.downvotes.includes(userId)) {
          updated.downvotes = updated.downvotes.filter(d => d !== userId);
        }
      } else {
        const alreadyDownvoted = updated.downvotes.includes(userId);
        updated.downvotes = alreadyDownvoted
          ? updated.downvotes.filter(d => d !== userId)
          : [...updated.downvotes, userId];
        if (!alreadyDownvoted && updated.upvotes.includes(userId)) {
          updated.upvotes = updated.upvotes.filter(u => u !== userId);
        }
      }
      return updated;
    }));
  
    // Actual API call
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/opinions/${id}/vote`,
        { type: voteType },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Vote failed:", error);
      fetchOpinions(); // Revert on error
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
              <button onClick={() => navigate('/create-opinion')} className="px-4 py-2 bg-lime-600/20 border border-lime-600 text-lime-400 rounded-md hover:bg-lime-600/30 transition-all duration-300">
                Create Opinion
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
        >
          <h1 className="text-3xl font-bold text-lime-400 mb-6">Opinion Feed</h1>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-400"></div>
            </div>
          ) : opinions.length === 0 ? (
            <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">No opinions found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {opinions.map((opinion) => (
                <motion.div 
                  key={opinion._id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-900/80 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-lime-400/20 rounded-full flex items-center justify-center text-lime-400 mr-3">
                      {(opinion.author?.fullname?.firstname?.[0] || "A").toUpperCase()}
                    </div>
                    <p className="font-medium text-gray-300">
                      {opinion.author?.fullname?.firstname || opinion.author?.firstname || 'Anonymous'}
                    </p>
                  </div>

                  <p className="text-gray-200 mb-4">{opinion.content}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleVote(opinion._id, 'upvote')}
                      className={`flex items-center gap-1 ${
                        isAuthenticated && opinion.upvotes?.includes(user._id) 
                          ? 'text-lime-400' 
                          : 'text-gray-400 hover:text-lime-400'
                      } transition-colors`}
                      disabled={!isAuthenticated}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span>Upvote ({opinion.upvotes?.length || 0})</span>
                    </motion.button>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleVote(opinion._id, 'downvote')}
                      className={`flex items-center gap-1 ${
                        isAuthenticated && opinion.downvotes?.includes(user._id) 
                          ? 'text-red-400' 
                          : 'text-gray-400 hover:text-red-400'
                      } transition-colors`}
                      disabled={!isAuthenticated}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span>Downvote ({opinion.downvotes?.length || 0})</span>
                    </motion.button>
                    
                    <Link 
                      to={`/opinion/${opinion._id}`}
                      className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span>Comments ({opinion.commentCount || 0})</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Feed;
