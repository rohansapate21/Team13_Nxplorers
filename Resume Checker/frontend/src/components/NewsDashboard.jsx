import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/NewsDashboard.css';

const NewsDashboard = () => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
        fetchNews();
    }, []);

    useEffect(() => {
        if (selectedCategory !== 'all') {
            fetchCategoryNews(selectedCategory);
        } else {
            fetchNews();
        }
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/news/categories/');
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchNews = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/news/');
            if (response.data.success) {
                setArticles(response.data.articles || []);
            } else {
                setError('Failed to fetch news');
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            setError('Failed to fetch news. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategoryNews = async (category) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/news/category/${category}/`);
            if (response.data.success) {
                setArticles(response.data.articles || []);
            } else {
                setError('Failed to fetch category news');
            }
        } catch (error) {
            console.error('Error fetching category news:', error);
            setError('Failed to fetch news. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    const refreshNews = () => {
        if (selectedCategory !== 'all') {
            fetchCategoryNews(selectedCategory);
        } else {
            fetchNews();
        }
    };

    return (
        <div className="news-dashboard">
            <div className="news-dashboard-container">
                <div className="news-header">
                    <div className="header-content">
                        <div className="header-text">
                            <h2>📰 Latest Technical & Job-Oriented News</h2>
                            <p>Stay updated with the latest technology and career-related news from around the world.</p>
                        </div>
                        <button
                            onClick={refreshNews}
                            disabled={isLoading}
                            className="refresh-button"
                        >
                            {isLoading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>

                    <div className="category-filter">
                        <div className="category-buttons">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`}
                            >
                                All News
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="news-content">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="empty-state">
                            <div>
                                <p>No news articles available at the moment.</p>
                                <button
                                    onClick={refreshNews}
                                    className="try-again-button"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="news-grid">
                            {articles.map((article, index) => (
                                <div key={index} className="news-card">
                                    {article.urlToImage && (
                                        <img
                                            src={article.urlToImage}
                                            alt={article.title || 'News image'}
                                            className="news-image"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    
                                    <div className="news-meta">
                                        <span className="news-source">{article.source || 'Unknown'}</span>
                                        <span className="news-date">
                                            {formatDate(article.publishedAt)}
                                        </span>
                                    </div>
                                    
                                    <h3 className="news-title">
                                        {article.title || 'No title available'}
                                    </h3>
                                    
                                    <p className="news-description">
                                        {article.description || 'No description available'}
                                    </p>
                                    
                                    {article.url && (
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="news-link"
                                        >
                                            Read More
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsDashboard;