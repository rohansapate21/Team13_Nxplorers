const config = {
    API_BASE_URL: 'http://localhost:8000',
    API_ENDPOINTS: {
        // Authentication endpoints
        LOGIN: '/api/token/',
        REFRESH_TOKEN: '/api/token/refresh/',
        REGISTER: '/api/auth/register/',
        USER_PROFILE: '/api/auth/user/',
        
        // Resume and Job endpoints
        RESUME_PARSE: '/api/parse/',
        RESUME_HISTORY: '/api/parse/history/',
        
        // Other endpoints
        NOTES: '/api/notes/',
        CONVERSATIONS: '/api/conversations/',
        ARTICLES: '/api/articles/',
    }
};

// Debug function to test different endpoint combinations
config.DEBUG = {
    // Test these login endpoints
    LOGIN_ENDPOINTS_TO_TRY: [
        '/api/token/',           // Django REST Framework Simple JWT
        '/api/auth/login/',      // Custom auth
        '/auth/login/',          // Simple auth
        '/api/token/obtain/',    // Alternative JWT
        '/login/',               // Basic login
    ],
    
    // Test these user profile endpoints
    USER_ENDPOINTS_TO_TRY: [
        '/api/auth/user/',       // What your frontend expects
        '/api/user/profile/',    // Your config
        '/api/user/',            // Simple user endpoint
        '/auth/user/',           // Simple auth user
        '/api/user/me/',         // Common "me" endpoint
    ],
    
    // Test these registration endpoints
    REGISTER_ENDPOINTS_TO_TRY: [
        '/api/auth/register/',   // What your error shows
        '/api/user/register/',   // Your config
        '/auth/register/',       // Simple register
        '/register/',            // Basic register
    ]
};

export default config;