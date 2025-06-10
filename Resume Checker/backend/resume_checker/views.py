from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import PyPDF2
import docx
import json
import re
from .models import Resume, ResumeMatch
from api.models import Note
from .serializers import (
    UserSerializer,
    ResumeSerializer,
    ResumeMatchSerializer,
    ResumeParseRequestSerializer,
    NoteSerializer
)
import logging
import nltk
from .resume_nlp import ResumeParser

logger = logging.getLogger(__name__)

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        logger.info(f"Registration attempt with data: {request.data}")
        serializer = UserSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                # Validate password
                validate_password(request.data.get('password'))
                
                # Create user
                user = User.objects.create_user(
                    username=request.data.get('username'),
                    email=request.data.get('email'),
                    password=request.data.get('password'),
                    first_name=request.data.get('first_name', ''),
                    last_name=request.data.get('last_name', '')
                )
                
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                
                logger.info(f"User {user.username} registered successfully")
                return Response({
                    'user': UserSerializer(user).data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                logger.error(f"Password validation error: {e}")
                return Response({'error': list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.error(f"Registration error: {str(e)}")
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        logger.error(f"Serializer validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def user(self, request):
        """Get the current user's profile"""
        try:
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching user profile: {str(e)}")
            return Response(
                {'error': 'Failed to fetch user profile'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ResumeParserViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def parse(self, request):
        serializer = ResumeParseRequestSerializer(data=request.data)
        if serializer.is_valid():
            try:
                parser = ResumeParser()
                parsed_data = parser.parse_resume(serializer.validated_data['resume_file'])
                
                resume = Resume.objects.create(
                    user=request.user,
                    file=serializer.validated_data['resume_file'],
                    parsed_data=parsed_data
                )
                
                return Response(ResumeSerializer(resume).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Error parsing resume: {str(e)}")
                return Response(
                    {'error': 'Failed to parse resume'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResumeMatchViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeMatchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ResumeMatch.objects.filter(resume__user=self.request.user)

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def count(self, request):
        count = self.get_queryset().count()
        return Response({'count': count}) 