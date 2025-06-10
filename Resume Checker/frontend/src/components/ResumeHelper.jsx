import React, { useState } from 'react';
import api from '../api';
import '../styles/ResumeHelper.css';

const ResumeHelper = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = { role: 'user', content: inputMessage };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await api.post('/api/resume/advice/', {
                prompt: inputMessage
            });

            if (response.data.success) {
                const assistantMessage = {
                    role: 'assistant',
                    content: response.data.response
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                throw new Error('Failed to get response');
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setInputMessage('');
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <div className="resume-helper">
            <div className="resume-helper-container">
                <div className="resume-helper-header">
                    <div className="header-content">
                        <div className="header-text">
                            <h2>📝 AI Resume Helper</h2>
                            <p>Ask any question about resumes, cover letters, or job hunting!</p>
                        </div>
                        {messages.length > 0 && (
                            <button
                                onClick={clearChat}
                                className="clear-chat-button"
                            >
                                Clear Chat
                            </button>
                        )}
                    </div>
                </div>

                <div className="chat-container">
                    {messages.length === 0 ? (
                        <div className="empty-chat">
                            <p>Start a conversation!</p>
                            <p>Example: "How can I improve my resume for tech jobs?"</p>
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.role}`}
                            >
                                <div className="message-content">
                                    {message.content}
                                </div>
                            </div>
                        ))
                    )}
                    
                    {isLoading && (
                        <div className="loading-message">
                            <div className="loading-content">
                                <div className="loading-spinner"></div>
                                <span>Analyzing your question...</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="chat-input-container">
                    <form onSubmit={handleSubmit} className="chat-form">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Example: How can I improve my resume for tech jobs?"
                            className="chat-input"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputMessage.trim()}
                            className="send-button"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResumeHelper;