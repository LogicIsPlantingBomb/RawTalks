import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import CreateOpinion from './pages/CreateOpinion';
import OpinionDetail from './pages/OpinionDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/create-opinion" element={<PrivateRoute><CreateOpinion /></PrivateRoute>} />
        <Route path="/opinion/:id" element={<OpinionDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
