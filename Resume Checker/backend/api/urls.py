from django.urls import path
from . import views
from .resume_views import get_resume_advice
from .news_views import get_tech_news, get_news_categories, get_category_news
from api.views import CreateUserView
from .views import (
    ResumeConversationViewSet,
    SavedArticleViewSet,
    UserProfileViewSet,
)

urlpatterns = [
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('conversations/', ResumeConversationViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='conversation-list'),
    path('articles/', SavedArticleViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='article-list'),
    path('profile/', UserProfileViewSet.as_view({
        'get': 'retrieve',
        'put': 'update'
    }), name='profile'),
    
    # Resume helper endpoints
    path("resume/advice/", get_resume_advice, name="resume-advice"),
    
    # News endpoints
    path("news/", get_tech_news, name="tech-news"),
    path("news/categories/", get_news_categories, name="news-categories"),
    path("news/category/<str:category>/", get_category_news, name="category-news"),
]