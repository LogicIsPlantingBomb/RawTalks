import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [particles, setParticles] = useState([]);
  const [moonGlow, setMoonGlow] = useState(1);
  const [featuredOpinions, setFeaturedOpinions] = useState([
    { id: 1, text: "NFTs are just digital beanie babies for tech bros with too much money", upvotes: 827, downvotes: 213, author: "CryptoSceptic" },
    { id: 2, text: "If your entire personality is based on the TV shows you watch, you're basically an NPC", upvotes: 945, downvotes: 124, author: "MainCharacterEnergy" },
    { id: 3, text: "Any pizza with pineapple on it should be classified as a war crime", upvotes: 1204, downvotes: 498, author: "ItalianRage" },
  ]);
  const [leaderboard, setLeaderboard] = useState([
    { id: 1, username: "OpinionSlayer", points: 12879, rank: 1 },
    { id: 2, username: "TruthBomber", points: 8934, rank: 2 },
    { id: 3, username: "SavageThoughts", points: 7621, rank: 3 },
    { id: 4, username: "UnfilteredMind", points: 6550, rank: 4 },
    { id: 5, username: "RawTalker", points: 5982, rank: 5 },
  ]);

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-80 z-0"></div>
      
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
        className="bg-gray-900/80 backdrop-blur-sm px-6 py-4 flex justify-between items-center shadow-lg z-50 sticky top-0"
      >
        <div className="flex items-center space-x-2">
          <button onClick={() => navigate('/')} className="text-lime-400 text-2xl font-bold tracking-tighter">
            RawTalk
          </button>
          <span className="text-gray-500 text-xs">BETA</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => navigate('/trending')} className="text-gray-300 hover:text-lime-400 transition-colors text-sm uppercase font-medium">
            Trending
          </button>
          <button onClick={() => navigate('/controversial')} className="text-gray-300 hover:text-lime-400 transition-colors text-sm uppercase font-medium">
            Controversial
          </button>
          <button onClick={() => navigate('/categories')} className="text-gray-300 hover:text-lime-400 transition-colors text-sm uppercase font-medium">
            Categories
          </button>
          <button onClick={() => navigate('/battles')} className="text-gray-300 hover:text-lime-400 transition-colors text-sm uppercase font-medium">
            Opinion Battles
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate('/profile')} className="text-gray-300 hover:text-gray-100 transition-colors">
                <span className="text-lime-400">@</span>{user?.fullname?.firstname || "User"}
              </button>
              <button onClick={() => navigate('/feed')} className="px-4 py-2 bg-lime-600/20 border border-lime-600 text-lime-400 rounded-md hover:bg-lime-600/30 transition-all duration-300">
                See Hot Takes
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="text-gray-300 hover:text-gray-100 transition-colors">
                Log In
              </button>
              <button onClick={() => navigate('/register')} className="px-4 py-2 bg-lime-600/20 border border-lime-600 text-lime-400 rounded-md hover:bg-lime-600/30 transition-all duration-300">
                Join The Chaos
              </button>
            </>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-4 pt-16 pb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            <span className="text-lime-400">Raw</span>Talk
          </h1>
          <p className="text-2xl text-lime-400 mb-2 font-semibold">Where the weak get silenced and the bold get heard</p>
          <p className="text-xl text-gray-300 mb-8 italic">"If you got triggered by a word, wait 'til you see the whole damn alphabet."</p>
          
          <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-lg mb-10 max-w-3xl mx-auto shadow-lg border border-gray-800">
            <p className="text-gray-200 text-left mb-4 text-lg">Welcome to the digital thunderdome where opinions clash and only the strongest survive. No sugar-coating, no safe spaces—just raw, unfiltered takes that'll make your grandma clutch her pearls.</p>
            <p className="text-gray-200 text-left mb-4 text-lg">Rack up upvotes and you're a goddamn legend. Get 500+ downvotes? Your weak-ass opinion gets suspended faster than a drunk at a bible study.</p>
            <p className="text-gray-200 text-left text-lg">This ain't for the faint-hearted. Post your truth, defend your ground, or get buried with the rest of the snowflakes.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            {!isAuthenticated ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-lime-600/20 border-2 border-lime-600 text-lime-400 rounded-md hover:bg-lime-600/30 transition-all duration-300 text-lg font-bold"
                >
                  Get In Here
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-gray-800/50 border-2 border-gray-700 text-gray-300 rounded-md hover:bg-gray-800/80 transition-all duration-300 text-lg font-bold"
                >
                  Sign Up (If You Dare)
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/feed')}
                className="px-8 py-4 bg-lime-600/20 border-2 border-lime-600 text-lime-400 rounded-md hover:bg-lime-600/30 transition-all duration-300 text-lg font-bold"
              >
                Drop Some Truth Bombs
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Featured Opinions */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-lime-400 mb-6 text-center">Top-Rated Savage Takes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredOpinions.map((opinion) => (
              <motion.div
                key={opinion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + opinion.id * 0.1 }}
                className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-gray-800 shadow-lg hover:border-lime-900 transition-all duration-300"
              >
                <p className="text-gray-200 mb-4 text-lg">{opinion.text}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">@{opinion.author}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-green-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      {opinion.upvotes}
                    </span>
                    <span className="text-red-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {opinion.downvotes}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats and Leaderboard */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-gray-800 shadow-lg"
          >
            <h3 className="text-xl font-bold text-lime-400 mb-4">Site Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <p className="text-3xl font-bold text-white mb-1">24,871</p>
                <p className="text-gray-400 text-sm">Hot Takes</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <p className="text-3xl font-bold text-white mb-1">8,392</p>
                <p className="text-gray-400 text-sm">Users</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <p className="text-3xl font-bold text-white mb-1">1,495</p>
                <p className="text-gray-400 text-sm">Opinions Suspended</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <p className="text-3xl font-bold text-white mb-1">53%</p>
                <p className="text-gray-400 text-sm">Controversy Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-gray-800 shadow-lg"
          >
            <h3 className="text-xl font-bold text-lime-400 mb-4">Savage Leaderboard</h3>
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div key={user.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lime-400 font-bold mr-3">#{user.rank}</span>
                    <span className="text-gray-200">@{user.username}</span>
                  </div>
                  <div className="text-gray-300 font-semibold">{user.points.toLocaleString()} pts</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* How It Works */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-lime-400 mb-6 text-center">How RawTalk Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-gray-800 shadow-lg"
            >
              <div className="text-lime-400 text-3xl font-bold mb-4 text-center">01</div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">Post Your Take</h3>
              <p className="text-gray-300 text-center">Drop your most controversial opinion. No filters, no BS—just raw, unfiltered thoughts that'll make the internet lose its mind.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-gray-800 shadow-lg"
            >
              <div className="text-lime-400 text-3xl font-bold mb-4 text-center">02</div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">Face The Crowd</h3>
              <p className="text-gray-300 text-center">Watch as your opinion gets praised or ripped to shreds. Upvotes mean you're speaking facts, downvotes mean you're weak.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-gray-800 shadow-lg"
            >
              <div className="text-lime-400 text-3xl font-bold mb-4 text-center">03</div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">Survive or Die</h3>
              <p className="text-gray-300 text-center">Get 500+ downvotes and your opinion gets suspended. That's the law of the jungle—only the strong survive here.</p>
            </motion.div>
          </div>
        </div>
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-3xl mx-auto text-center bg-gradient-to-r from-lime-900/30 to-gray-900/30 p-8 rounded-lg border border-lime-900/50 shadow-xl"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to speak your mind?</h2>
          <p className="text-gray-300 mb-6 text-lg">Join thousands of savages who don't give a flying f*ck about political correctness.</p>
          <button 
            onClick={() => navigate('/register')} 
            className="px-8 py-4 bg-lime-600 text-black font-bold rounded-md hover:bg-lime-500 transition-all duration-300 text-lg"
          >
            START CAUSING CHAOS
          </button>
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-sm py-8 mt-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lime-400 text-2xl font-bold mb-2">RawTalk</h3>
              <p className="text-gray-400">Where opinions come to fight.</p>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-300 hover:text-lime-400 transition-colors">About</a>
              <a href="#" className="text-gray-300 hover:text-lime-400 transition-colors">Privacy</a>
              <a href="#" className="text-gray-300 hover:text-lime-400 transition-colors">Terms</a>
              <a href="#" className="text-gray-300 hover:text-lime-400 transition-colors">Contact</a>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm border-t border-gray-800 pt-6">
            &copy; 2025 RawTalk. All rights reserved. Not for the easily offended.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
