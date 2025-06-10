import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import "../pages/Home.css";
import { useAuth } from '../contexts/AuthContext';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
    const { user } = useAuth() || {};
    return (
        <div className="home-container">
            <Navbar />
            <div className="main-content">
                <h2 style={{marginBottom: '1.5rem'}}>
                  {getGreeting()} {user?.username ? user.username : "User"}
                </h2>
                <h2>Welcome to Resume Checker Portal</h2>
                <p>Select a section from the navigation bar above.</p>
            </div>
        </div>
    );
}