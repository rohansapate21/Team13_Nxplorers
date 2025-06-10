import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', {
        url: `${config.API_BASE_URL}${config.API_ENDPOINTS.LOGIN}`,
        data: { username: formData.username }
      });

      const response = await axios.post(`${config.API_BASE_URL}${config.API_ENDPOINTS.LOGIN}`, {
        username: formData.username,
        password: formData.password
      });

      console.log('Login response:', response.data);

      if (response.data.access && response.data.refresh) {
        // Store tokens
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        
        console.log('Login successful, redirecting to home...');
        navigate('/', { replace: true });
      } else {
        console.error('Invalid response format:', response.data);
        setError('Invalid response from server. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 401) {
          setError('Invalid username or password');
        } else if (error.response.status === 400) {
          setError('Please check your input and try again');
        } else {
          setError(error.response.data.detail || 'Login failed. Please try again.');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response from server. Please check your connection.');
      } else {
        console.error('Error setting up request:', error.message);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      console.log('OAuth URL:', `${process.env.REACT_APP_API_URL}/api/auth/${provider}`);
      window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/${provider}`;
    } catch (err) {
      setError(`Failed to login with ${provider}. Please try again.`);
    }
  };

  // Test backend connection
  const testConnection = async () => {
    try {
      console.log('Testing connection to:', config.API_BASE_URL);
      const response = await axios.get(`${config.API_BASE_URL}/`);
      console.log('Connection test successful:', response.data);
    } catch (error) {
      console.error('Connection test failed:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue your journey</p>
        </div>

        {/* Debug buttons */}
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}>
          <h4>Debug Tools</h4>
          <button type="button" onClick={testConnection} style={{ marginRight: '10px' }}>
            Test Backend Connection
          </button>
          <button type="button" onClick={() => console.log('Current config:', config)}>
            Log Config
          </button>
        </div>

        <div className="oauth-buttons">
          <button 
            className="oauth-btn google"
            onClick={() => handleOAuthLogin('google')}
          >
            <img src="/google-icon.png" alt="Google" />
            Continue with Google
          </button>
          <button 
            className="oauth-btn github"
            onClick={() => handleOAuthLogin('github')}
          >
            <img src="/github-icon.png" alt="GitHub" />
            Continue with GitHub
          </button>
          <button 
            className="oauth-btn linkedin"
            onClick={() => handleOAuthLogin('linkedin')}
          >
            <img src="/linkedin-icon.png" alt="LinkedIn" />
            Continue with LinkedIn
          </button>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="forgot-password">
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="register-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;