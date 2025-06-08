# Full-Stack Resume & News Dashboard

A comprehensive web application that combines note-taking, AI-powered resume assistance, and tech news aggregation. Built with Django REST Framework backend and React frontend.

## Features

### 🔐 Authentication
- User registration and login
- JWT token-based authentication
- Protected routes

### 📝 Notes Management
- Create, view, and delete personal notes
- User-specific note storage
- Clean, modern interface

### 💼 AI Resume Helper
- Powered by Google's Gemini AI
- Interactive chat interface for resume advice
- Career guidance and job hunting tips
- Real-time AI responses

### 📰 Tech News Dashboard
- Latest technology and job-related news
- Multiple news categories (Tech Jobs, Internships, Upskilling, Hiring)
- News caching for better performance
- Responsive news cards with images

## Tech Stack

### Backend
- **Django 5.2.2** - Web framework
- **Django REST Framework** - API development
- **JWT Authentication** - Secure token-based auth
- **Google Generative AI** - Resume assistance
- **News API** - Tech news aggregation
- **SQLite** - Database (easily upgradeable to PostgreSQL)

### Frontend
- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Clone and navigate to backend directory**
```bash
git clone <repository-url>
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Environment setup**
```bash
cp .env.example .env
# Edit .env file with your API keys
```

5. **Database setup**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Optional
```

6. **Run development server**
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
# Edit .env file with backend URL
```

4. **Run development server**
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## API Configuration

### Required API Keys

1. **Google Gemini API Key**
   - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add to `backend/.env` as `GEMINI_API_KEY`

2. **News API Key**
   - Get from [NewsAPI.org](https://newsapi.org/)
   - Add to `backend/.env` as `NEWS_API_KEY`

## API Endpoints

### Authentication
- `POST /api/user/register/` - User registration
- `POST /api/token/` - Login (get tokens)
- `POST /api/token/refresh/` - Refresh access token

### Notes
- `GET /api/notes/` - List user notes
- `POST /api/notes/` - Create note
- `DELETE /api/notes/delete/{id}/` - Delete note

### Resume Helper
- `POST /api/resume/advice/` - Get AI resume advice

### News
- `GET /api/news/` - Get all tech news
- `GET /api/news/categories/` - Get news categories
- `GET /api/news/category/{category}/` - Get category-specific news

## Project Structure

```
├── backend/
│   ├── api/
│   │   ├── models.py          # Note model
│   │   ├── serializers.py     # API serializers
│   │   ├── views.py           # Note views
│   │   ├── resume_views.py    # Resume AI endpoints
│   │   ├── news_views.py      # News endpoints
│   │   └── urls.py            # API routes
│   ├── backend/
│   │   ├── settings.py        # Django settings
│   │   └── urls.py            # Main URL config
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Note.jsx
│   │   │   ├── ResumeHelper.jsx
│   │   │   ├── NewsDashboard.jsx
│   │   │   └── ProtectedRoutes.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── api.js             # Axios configuration
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Notes**: Create and manage personal notes in the Notes tab
3. **Resume Helper**: Ask AI questions about resume improvement, cover letters, or job hunting
4. **Tech News**: Browse latest technology and job-related news, filter by categories

## Features in Detail

### Resume Helper
- Interactive chat interface
- Powered by Google's Gemini AI
- Specialized in career and resume advice
- Message history during session
- Example prompts and guidance

### News Dashboard
- Real-time tech news aggregation
- Category filtering (Tech Jobs, Internships, etc.)
- News caching for performance
- Responsive design with images
- External link handling

### Security Features
- JWT token authentication
- Automatic token refresh
- Protected API endpoints
- CORS configuration
- User-specific data isolation

## Deployment

### Backend Deployment
1. Set up environment variables
2. Configure database (PostgreSQL recommended for production)
3. Set `DEBUG=False` in settings
4. Configure allowed hosts and CORS origins
5. Deploy to platforms like Heroku, DigitalOcean, or AWS

### Frontend Deployment
1. Update `VITE_API_URL` to production backend URL
2. Build the project: `npm run build`
3. Deploy to Netlify, Vercel, or similar platforms

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please open an issue on the GitHub repository.