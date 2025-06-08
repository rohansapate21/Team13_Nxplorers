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
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg">
                <div className="border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">📰 Latest Technical & Job-Oriented News</h2>
                            <p className="text-gray-600 mt-2">Stay updated with the latest technology and career-related news from around the world.</p>
                        </div>
                        <button
                            onClick={refreshNews}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                        >
                            {isLoading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    selectedCategory === 'all'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                All News
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        selectedCategory === category.id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="text-center text-gray-500 h-64 flex items-center justify-center">
                            <div>
                                <p className="text-lg">No news articles available at the moment.</p>
                                <button
                                    onClick={refreshNews}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {articles.map((article, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    {article.urlToImage && (
                                        <img
                                            src={article.urlToImage}
                                            alt={article.title || 'News image'}
                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    
                                    <div className="mb-2">
                                        <span className="text-xs text-blue-600 font-medium">{article.source || 'Unknown'}</span>
                                        <span className="text-xs text-gray-500 ml-2">
                                            {formatDate(article.publishedAt)}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {article.title || 'No title available'}
                                    </h3>
                                    
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {article.description || 'No description available'}
                                    </p>
                                    
                                    {article.url && (
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            🔗 Read more
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6L8 8l-2 2 2 2 2 2M14 6l2 2 2 2-2 2-2 2" />
                                            </svg>
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