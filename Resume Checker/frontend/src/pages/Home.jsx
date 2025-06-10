import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import config from "../config";
import Navbar from "../components/Navbar";
import ResumeParser from "../components/ResumeParser";
import NewsDashboard from "../components/NewsDashboard";
import ResumeHelper from "../components/ResumeHelper";
import JobOpenings from "../components/JobOpenings";
import "../styles/Home.css";

const tabs = [
    { id: "parser", label: "Resume & JD Parsing", icon: "📄" },
    { id: "news", label: "News Section", icon: "📰" },
    { id: "chatbot", label: "Chatbot Integration", icon: "🤖" },
    { id: "jobs", label: "Job Openings", icon: "💼" },
];

export default function Home() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("parser");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUser = async () => {
            try {
                console.log('Fetching user profile from:', `${config.API_BASE_URL}${config.API_ENDPOINTS.USER_PROFILE}`);
                const response = await api.get(config.API_ENDPOINTS.USER_PROFILE);
                console.log('User profile response:', response.data);
                setUser(response.data);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                setError('Failed to load user profile');
                // Only clear tokens and redirect if it's an authentication error
                if (error.response?.status === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="home-container">
            <Navbar user={user} onLogout={handleLogout} />

            {/* Tab Navigation */}
            <nav className="tab-navigation">
                <div className="tab-container">
                    <ul className="tab-list">
                        {tabs.map((tab) => (
                            <li key={tab.id}>
                                <button
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                >
                                    <span className="tab-icon">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Tab Content */}
            <main className="main-content">
                <div className="content-container">
                    {activeTab === "parser" && <ResumeParser user={user} />}
                    {activeTab === "news" && <NewsDashboard />}
                    {activeTab === "chatbot" && <ResumeHelper />}
                    {activeTab === "jobs" && <JobOpenings />}
                </div>
            </main>
        </div>
    );
}