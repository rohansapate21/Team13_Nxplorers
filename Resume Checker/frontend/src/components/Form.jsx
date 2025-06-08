import { useState } from "react";
import api from '../api';
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        setError(""); // Clear previous errors
        e.preventDefault();

        try {
            console.log("Sending request to:", route); // Debug log
            console.log("Request data:", { username, password }); // Debug log

            const res = await api.post(route, {
                username,
                password
            });

            console.log("Response:", res.data); // Debug log

            if (method === "login") {
                // Store tokens for login
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/"); // Navigate to home after successful login
            } else {
                // For registration, navigate to login page
                alert("Registration successful! Please login.");
                navigate("/login");
            }
        } catch (error) {
            console.error("API Error:", error); // Debug log
            console.error("Error response:", error.response?.data); // Debug log
            
            // Better error handling
            let errorMessage = `Failed to ${method}. Please try again.`;
            
            if (error.response?.data) {
                const errorData = error.response.data;
                
                // Handle different error formats
                if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.username) {
                    errorMessage = `Username: ${errorData.username.join(', ')}`;
                } else if (errorData.password) {
                    errorMessage = `Password: ${errorData.password.join(', ')}`;
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else {
                    // Show the raw error for debugging
                    errorMessage = JSON.stringify(errorData);
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
                
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength="8" // Add minimum length for better UX
            />
                
            <button 
                className="form-button" 
                type="submit" 
                disabled={loading}
            >
                {loading ? "Loading..." : name}
            </button>
        </form>
    );
}

export default Form;