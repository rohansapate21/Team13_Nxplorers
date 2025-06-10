import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    mobile: user?.mobile || '',
    dob: user?.dob || '',
    profilePic: user?.profilePic || null
  });
  const profileRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setIsProfileOpen(false);
  };

  const handleSaveProfile = async () => {
    try {
      // API call to update profile
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // API call to upload profile picture
        setProfileData(prev => ({
          ...prev,
          profilePic: URL.createObjectURL(file)
        }));
      } catch (error) {
        console.error('Failed to upload profile picture:', error);
      }
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="logo" onClick={() => navigate('/home')}>
            <div className="logo-box">
              <span className="logo-text">D</span>
            </div>
            <span className="logo-name">Resume Checker</span>
          </div>
        </div>

        <div className="navbar-right">
          <button className="chatbot-btn" onClick={() => navigate('/chatbot')}>
            <span className="chatbot-icon">🤖</span>
            AI Chatbot
          </button>

          <div className="profile-menu" ref={profileRef}>
            <button className="profile-btn" onClick={handleProfileClick}>
              {profileData.profilePic ? (
                <img 
                  src={profileData.profilePic} 
                  alt="Profile" 
                  className="profile-pic"
                />
              ) : (
                <div className="profile-pic-placeholder">
                  {profileData.firstName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </button>

            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <h3>{`${profileData.firstName} ${profileData.lastName}`}</h3>
                  <p>{user?.email}</p>
                </div>
                <div className="profile-actions">
                  <button onClick={handleEditClick}>Edit Profile</button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="profile-edit-modal">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <div className="profile-pic-edit">
              {profileData.profilePic ? (
                <img 
                  src={profileData.profilePic} 
                  alt="Profile" 
                  className="profile-pic-large"
                />
              ) : (
                <div className="profile-pic-placeholder-large">
                  {profileData.firstName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <button 
                className="change-pic-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Picture
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  firstName: e.target.value
                }))}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  lastName: e.target.value
                }))}
              />
            </div>
            <div className="form-group">
              <label>Mobile</label>
              <input
                type="tel"
                value={profileData.mobile}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  mobile: e.target.value
                }))}
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                value={profileData.dob}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  dob: e.target.value
                }))}
              />
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleSaveProfile}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 