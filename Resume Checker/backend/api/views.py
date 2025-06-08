from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.models import Note, ResumeConversation, SavedArticle, UserProfile
from .serializers import (
    UserSerializer, NoteSerializer, ResumeConversationSerializer,
    SavedArticleSerializer, UserProfileSerializer, ResumeQuestionSerializer,
    ResumeAnalysisSerializer, NewsQuerySerializer, SaveArticleSerializer
)
from .resume_service import ResumeAssistantService
from .news_service import NewsService
import logging

logger = logging.getLogger(__name__)

# Existing views
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# New Resume Assistant Views
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ask_resume_question(request):
    """
    Handle resume-related questions using AI
    """
    serializer = ResumeQuestionSerializer(data=request.data)
    if serializer.is_valid():
        question = serializer.validated_data['question']
        
        try:
            resume_service = ResumeAssistantService()
            result = resume_service.get_resume_advice(question)
            
            if result['success']:
                # Save conversation to database
                conversation = ResumeConversation.objects.create(
                    user=request.user,
                    question=question,
                    response=result['response']
                )
                
                return Response({
                    'success': True,
                    'response': result['response'],
                    'conversation_id': conversation.id
                })
            else:
                return Response({
                    'success': False,
                    'error': result['error']
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Exception as e:
            logger.error(f"Resume question error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Internal server error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_resume(request):
    """
    Analyze resume content and provide feedback
    """
    serializer = ResumeAnalysisSerializer(data=request.data)
    if serializer.is_valid():
        resume_text = serializer.validated_data['resume_text']
        job_description = serializer.validated_data.get('job_description', '')
        
        try:
            resume_service = ResumeAssistantService()
            result = resume_service.analyze_resume_content(resume_text, job_description)
            
            if result['success']:
                # Save analysis as a conversation
                question = f"Resume Analysis{' with Job Description' if job_description else ''}"
                conversation = ResumeConversation.objects.create(
                    user=request.user,
                    question=question,
                    response=result['analysis']
                )
                
                return Response({
                    'success': True,
                    'analysis': result['analysis'],
                    'conversation_id': conversation.id
                })
            else:
                return Response({
                    'success': False,
                    'error': result['error']
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Exception as e:
            logger.error(f"Resume analysis error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Internal server error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResumeConversationListView(generics.ListAPIView):
    serializer_class = ResumeConversationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ResumeConversation.objects.filter(user=self.request.user)

# News Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tech_news(request):
    """
    Fetch technology and job-related news
    """
    page = request.GET.get('page', 1)
    topic = request.GET.get('topic', '')
    
    try:
        page = int(page)
    except ValueError:
        page = 1
    
    try:
        news_service = NewsService()
        
        if topic:
            result = news_service.search_specific_topic(topic, page)
        else:
            result = news_service.get_tech_job_news(page)
        
        return Response(result)
        
    except Exception as e:
        logger.error(f"News fetch error: {str(e)}")
        return Response({
            'success': False,
            'articles': [],
            'error': 'Failed to fetch news'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_comprehensive_news(request):
    """
    Fetch news from multiple pages for comprehensive results
    """
    try:
        news_service = NewsService()
        result = news_service.get_multiple_pages(max_pages=5)
        return Response(result)
        
    except Exception as e:
        logger.error(f"Comprehensive news fetch error: {str(e)}")
        return Response({
            'success': False,
            'articles': [],
            'error': 'Failed to fetch comprehensive news'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_article(request):
    """
    Save a news article for later reading
    """
    serializer = SaveArticleSerializer(data=request.data)
    if serializer.is_valid():
        try:
            article, created = SavedArticle.objects.get_or_create(
                user=request.user,
                url=serializer.validated_data['url'],
                defaults={
                    'title': serializer.validated_data['title'],
                    'description': serializer.validated_data.get('description', ''),
                    'source': serializer.validated_data.get('source', ''),
                    'published_at': serializer.validated_data.get('published_at')
                }
            )
            
            if created:
                return Response({
                    'success': True,
                    'message': 'Article saved successfully',
                    'article_id': article.id
                })
            else:
                return Response({
                    'success': False,
                    'message': 'Article already saved'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Save article error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to save article'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SavedArticleListView(generics.ListAPIView):
    serializer_class = SavedArticleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SavedArticle.objects.filter(user=self.request.user)

class SavedArticleDeleteView(generics.DestroyAPIView):
    serializer_class = SavedArticleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SavedArticle.objects.filter(user=self.request.user)

# User Profile Views
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile