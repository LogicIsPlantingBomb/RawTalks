import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OpinionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opinion, setOpinion] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const { user, isAuthenticated } = useAuth();
  const [particles, setParticles] = useState([]);
  const [moonGlow, setMoonGlow] = useState(1);

  const fetchOpinionAndComments = async () => {
    try {
      // Fetch the opinion
      const opinionRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/opinions/${id}`, {
        withCredentials: true
      });
      setOpinion(opinionRes.data.data);
      
      // Fetch comments for this opinion
      const commentsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/comments/opinion/${id}`, {
        withCredentials: true
      });
      setComments(commentsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching opinion details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpinionAndComments();
  }, [id]);

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

  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      alert("Please login to vote");
      return;
    }

    // Optimistic update
    setOpinion(prev => ({
      ...prev,
      upvotes: voteType === 'upvote'
        ? prev.upvotes.includes(user._id)
          ? prev.upvotes.filter(u => u !== user._id)
          : [...prev.upvotes, user._id]
        : prev.upvotes.filter(u => u !== user._id),
      downvotes: voteType === 'downvote'
        ? prev.downvotes.includes(user._id)
          ? prev.downvotes.filter(d => d !== user._id)
          : [...prev.downvotes, user._id]
        : prev.downvotes.filter(d => d !== user._id)
    }));

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/opinions/${id}/vote`,
        { type: voteType },  // Key change: voteType → type
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Vote failed:", error);
      fetchOpinionAndComments(); // Revert on error
    }
  };
  
  const handleCommentVote = async (commentId, voteType) => {
    if (!isAuthenticated) {
      alert("Please login to vote");
      return;
    }

    // Optimistic update
    setComments(prevComments =>
      prevComments.map(comment =>
        comment._id === commentId
          ? {
              ...comment,
              upvotes: voteType === 'upvote'
                ? comment.upvotes.includes(user._id)
                  ? comment.upvotes.filter(u => u !== user._id)
                  : [...comment.upvotes, user._id]
                : comment.upvotes.filter(u => u !== user._id),
              downvotes: voteType === 'downvote'
                ? comment.downvotes.includes(user._id)
                  ? comment.downvotes.filter(d => d !== user._id)
                  : [...comment.downvotes, user._id]
                : comment.downvotes.filter(d => d !== user._id)
            }
          : comment
      )
    );

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/comments/${commentId}/vote`,
        { type: voteType }, // Key change: voteType → type (to match your style)
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Vote on comment failed:", error);
      fetchOpinionAndComments(); // Revert on error
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please login to comment");
      return;
    }
    
    if (!commentText.trim()) return;
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/comments`, {
        opinionId: id,
        content: commentText
      }, { withCredentials: true });
      
      setCommentText('');
      // Refresh comments
      fetchOpinionAndComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) return (
    <div className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-400"></div>
    </div>
  );

  if (!opinion) return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-lime-400 mb-6">Opinion Not Found</h1>
        <Link to="/feed" className="text-lime-400 hover:text-lime-300 underline">
          Back to Feed
        </Link>
      </div>
    </div>
  );

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
          {user ? (
            <>
              <button onClick={() => navigate('/profile')} className="text-gray-300 hover:text-gray-100 transition-colors">
                <span className="text-lime-400">@</span>{user.fullname?.firstname || 'User'}
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
      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <div className="flex items-center mb-6">
          <motion.button
            whileHover={{ x: -3 }}
            onClick={() => navigate('/feed')}
            className="text-lime-400 hover:text-lime-300 transition-colors flex items-center mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Feed
          </motion.button>
          <h1 className="text-2xl font-bold text-lime-400">Opinion Detail</h1>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/80 border border-gray-800 rounded-lg p-6 mb-6"
        >
          <div className="flex items-center mb-4">
            <p className="font-medium text-gray-300">
              {opinion.author?.fullname?.firstname || opinion.author?.firstname || 'Anonymous'}
            </p>
          </div>
          <p className="text-lg text-gray-200 mb-4">{opinion.content}</p>
          <div className="flex gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVote('upvote')}
              className={`flex items-center text-sm ${opinion.upvotes?.includes(user?._id) ? 'text-lime-400' : 'text-gray-400 hover:text-lime-400'} transition-colors`}
              disabled={!isAuthenticated}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              Upvote ({opinion.upvotes?.length || 0})
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVote('downvote')}
              className={`flex items-center text-sm ${opinion.downvotes?.includes(user?._id) ? 'text-red-400' : 'text-gray-400 hover:text-red-400'} transition-colors`}
              disabled={!isAuthenticated}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
              </svg>
              Downvote ({opinion.downvotes?.length || 0})
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/80 border border-gray-800 rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold text-lime-400 mb-4">Comments</h2>
          
          {isAuthenticated && (
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="mb-2">
                <textarea
                  className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows="3"
                  required
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-4 py-2 bg-lime-600/20 border border-lime-600 text-lime-400 rounded-md hover:bg-lime-600/30 transition-colors duration-300"
              >
                Post Comment
              </motion.button>
            </form>
          )}
          
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <motion.div 
                  key={comment._id} 
                  className="border-t border-gray-800 pt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center mb-2">
                    <p className="font-medium text-gray-300">
                      {comment.author?.fullname?.firstname || comment.author?.firstname || 'Anonymous'}
                    </p>
                  </div>
                  <p className="text-gray-300 mb-3">{comment.content}</p>
                  <div className="flex gap-4">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCommentVote(comment._id, 'upvote')}
                      className={`flex items-center text-xs ${comment.upvotes?.includes(user?._id) ? 'text-lime-400' : 'text-gray-400 hover:text-lime-400'} transition-colors`}
                      disabled={!isAuthenticated}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      Upvote ({comment.upvotes?.length || 0})
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCommentVote(comment._id, 'downvote')}
                      className={`flex items-center text-xs ${comment.downvotes?.includes(user?._id) ? 'text-red-400' : 'text-gray-400 hover:text-red-400'} transition-colors`}
                      disabled={!isAuthenticated}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                      </svg>
                      Downvote ({comment.downvotes?.length || 0})
                    </motion.button>
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

export default OpinionDetail;
