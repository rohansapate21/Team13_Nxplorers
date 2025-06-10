import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import Login from './pages/Login';
import Register from './pages/Register';
import ResumeParser from './components/ResumeParser';
import Note from './components/Note';
import NewsDashboard from './components/NewsDashboard';
import ResumeHelper from './components/ResumeHelper';
import Home from './pages/Home';
import './App.css';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <main className="container mx-auto py-6">
                <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/resume" element={<ProtectedRoute><ResumeParser /></ProtectedRoute>} />
                        <Route path="/news" element={<ProtectedRoute><NewsDashboard /></ProtectedRoute>} />
                        <Route path="/chatbot" element={<ProtectedRoute><ResumeHelper /></ProtectedRoute>} />
                        <Route path="/notes" element={<ProtectedRoute><Note /></ProtectedRoute>} />
                        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;