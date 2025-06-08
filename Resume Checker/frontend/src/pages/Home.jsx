import React, { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import ResumeHelper from "../components/ResumeHelper";
import NewsDashboard from "../components/NewsDashboard";
import '../styles/home.css';

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [activeTab, setActiveTab] = useState("notes");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (activeTab === "notes") {
            getNotes();
        }
    }, [activeTab]);

    const getNotes = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/api/notes/");
            setNotes(res.data);
            console.log("Notes loaded:", res.data);
        } catch (err) {
            console.error("Error fetching notes:", err);
            setError("Failed to load notes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const deleteNote = async (id) => {
        try {
            const res = await api.delete(`/api/notes/delete/${id}/`);
            if (res.status === 204) {
                alert("Note deleted!");
                getNotes();
            } else {
                alert("Failed to delete note.");
            }
        } catch (error) {
            console.error("Error deleting note:", error);
            alert("Failed to delete note.");
        }
    };

    const createNote = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("Please fill in both title and content.");
            return;
        }

        try {
            const res = await api.post("/api/notes/", { content, title });
            if (res.status === 201) {
                alert("Note created!");
                setTitle("");
                setContent("");
                getNotes();
            } else {
                alert("Failed to create note.");
            }
        } catch (err) {
            console.error("Error creating note:", err);
            alert("Failed to create note.");
        }
    };

    const tabs = [
        { id: "notes", label: "📝 Notes", icon: "📝" },
        { id: "resume", label: "💼 Resume Helper", icon: "💼" },
        { id: "news", label: "📰 Tech News", icon: "📰" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Navigation Header */}
            <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">D</span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                        Dashboard
                                    </h1>
                                    <span className="text-sm text-gray-500 font-medium">Welcome back!</span>
                                </div>
                            </div>
                        </div>
                        <a
                            href="/logout"
                            className="group px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                        >
                            <span className="group-hover:animate-pulse">Logout</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white/60 backdrop-blur-sm border-b border-white/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative py-4 px-1 font-medium text-sm transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? "text-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <span className="mr-2 text-lg">{tab.icon}</span>
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === "notes" && (
                    <div className="space-y-8">
                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-r-lg shadow-lg animate-pulse">
                                <div className="flex items-center">
                                    <span className="text-red-400 mr-2">⚠️</span>
                                    {error}
                                </div>
                            </div>
                        )}

                        {/* Create Note Form */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-white text-lg">✨</span>
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    Create a New Note
                                </h2>
                            </div>
                            <form onSubmit={createNote} className="space-y-6">
                                <div className="group">
                                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Title:
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        required
                                        onChange={(e) => setTitle(e.target.value)}
                                        value={title}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-gray-300 group-hover:shadow-md"
                                        placeholder="Enter note title..."
                                    />
                                </div>
                                <div className="group">
                                    <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Content:
                                    </label>
                                    <textarea
                                        id="content"
                                        name="content"
                                        required
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows="5"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-gray-300 group-hover:shadow-md resize-none"
                                        placeholder="Enter note content..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                                >
                                    <span className="flex items-center justify-center">
                                        <span className="mr-2">📝</span>
                                        Create Note
                                    </span>
                                </button>
                            </form>
                        </div>

                        {/* Notes List */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-white text-lg">📚</span>
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    Your Notes
                                </h2>
                            </div>
                            
                            {loading ? (
                                <div className="flex justify-center items-center py-16">
                                    <div className="relative">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
                                    </div>
                                    <span className="ml-4 text-gray-600 font-medium">Loading notes...</span>
                                </div>
                            ) : notes.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl">📝</span>
                                    </div>
                                    <p className="text-gray-500 text-lg font-medium">No notes yet</p>
                                    <p className="text-gray-400 text-sm mt-1">Create your first note above!</p>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {notes.map((note, index) => (
                                        <div
                                            key={note.id}
                                            className="transform transition-all duration-300 hover:scale-105"
                                            style={{
                                                animationDelay: `${index * 100}ms`,
                                                animation: 'fadeInUp 0.5s ease-out forwards'
                                            }}
                                        >
                                            <Note note={note} onDelete={deleteNote} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "resume" && (
                    <div className="transform transition-all duration-500 animate-fadeIn">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                            <ResumeHelper />
                        </div>
                    </div>
                )}
                
                {activeTab === "news" && (
                    <div className="transform transition-all duration-500 animate-fadeIn">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                            <NewsDashboard />
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeInUp 0.5s ease-out;
                }
            `}</style>
        </div>
    );
}

export default Home;