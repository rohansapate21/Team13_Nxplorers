from django.urls import path
from . import views
from .resume_views import get_resume_advice
from .news_views import get_tech_news, get_news_categories, get_category_news
from api.views import CreateUserView

urlpatterns = [
    # Original note endpoints
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    
    # Resume helper endpoints
    path("resume/advice/", get_resume_advice, name="resume-advice"),
    
    # News endpoints
    path("news/", get_tech_news, name="tech-news"),
    path("news/categories/", get_news_categories, name="news-categories"),
    path("news/category/<str:category>/", get_category_news, name="category-news"),
]