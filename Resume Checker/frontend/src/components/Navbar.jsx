import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    setProfileOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Hamburger for mobile */}
        <button className="hamburger" onClick={() => setMenuOpen((open) => !open)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/resume" className={location.pathname === '/resume' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
            Resume & JD Parsing
          </Link>
          <Link to="/news" className={location.pathname === '/news' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
            News Section
          </Link>
          <Link to="/chatbot" className={location.pathname === '/chatbot' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
            Chatbot Integration
          </Link>
          <Link to="/notes" className={location.pathname === '/notes' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
            Important Notes
          </Link>
        </div>
        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <div className="profile-avatar" onClick={handleProfileClick} title="Edit Profile">
                <img src="/default-avatar.png" alt="Profile" />
              </div>
              {profileOpen && (
                <div className="profile-modal">
                  <div className="profile-modal-content">
                    <h4>Edit Profile (Coming Soon)</h4>
                    <button onClick={() => setProfileOpen(false)} className="close-profile-modal">Close</button>
                  </div>
                </div>
              )}
              <button onClick={handleLogout} className="navbar-logout">
                Logout
              </button>
            </>
          ) : (
            <div className="navbar-auth-links">
              <Link to="/login">Login</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 