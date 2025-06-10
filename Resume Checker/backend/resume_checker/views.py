from rest_framework import viewsets, status, generics
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
from .models import JobDescription, Resume, ResumeMatch, SuggestedJob
from .serializers import (
    UserSerializer,
    JobDescriptionSerializer,
    ResumeSerializer,
    ResumeMatchSerializer,
    SuggestedJobSerializer,
    ResumeParseRequestSerializer
)
import logging
from .resume_nlp import analyze_resume_vs_jd

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

class ResumeParserViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def extract_text_from_pdf(self, file):
        text = ""
        pdf_reader = PyPDF2.PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text

    def extract_text_from_docx(self, file):
        text = ""
        doc = docx.Document(file)
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text

    def extract_text(self, file):
        if file.name.endswith('.pdf'):
            return self.extract_text_from_pdf(file)
        elif file.name.endswith(('.doc', '.docx')):
            return self.extract_text_from_docx(file)
        return ""

    def extract_skills(self, text):
        # This is a simple implementation. You might want to use a more sophisticated
        # approach like NLP or a predefined skills database
        common_skills = [
            'python', 'java', 'javascript', 'react', 'angular', 'vue',
            'node.js', 'django', 'flask', 'spring', 'sql', 'nosql',
            'mongodb', 'postgresql', 'aws', 'azure', 'docker', 'kubernetes',
            'machine learning', 'ai', 'data science', 'devops', 'agile',
            'scrum', 'git', 'ci/cd', 'rest api', 'graphql', 'microservices'
        ]
        
        text = text.lower()
        found_skills = []
        for skill in common_skills:
            if skill in text:
                found_skills.append(skill)
        return found_skills

    def calculate_match_score(self, resume_skills, jd_skills):
        if not resume_skills or not jd_skills:
            return 0
        
        common_skills = set(resume_skills) & set(jd_skills)
        match_score = (len(common_skills) / len(jd_skills)) * 100
        return round(match_score, 2)

    def create(self, request):
        serializer = ResumeParseRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        resumes = request.FILES.getlist('resumes')
        jd_file = request.FILES.get('jd')
        jd_text = request.data.get('jd_text', '')

        # If JD file is provided and is .docx, extract text
        if jd_file and jd_file.name.endswith('.docx'):
            from .resume_nlp import extract_text_from_file
            jd_text = extract_text_from_file(jd_file)

        results = []
        for resume_file in resumes:
            # Only process .docx resumes with NLP logic
            if resume_file.name.endswith('.docx') and jd_text:
                from .resume_nlp import analyze_resume_vs_jd
                report = analyze_resume_vs_jd(resume_file, jd_text)
                results.append({
                    'filename': resume_file.name,
                    'match_score': report['match_score'],
                    'resume_skills': report['resume_skills'],
                    'jd_skills': report['jd_skills'],
                    'matched_skills': report['matched_skills'],
                    'missing_skills': report['missing_skills'],
                    'resume_text': report['resume_text'],
                    'jd_text': report['jd_text'],
                })
            else:
                # fallback to old logic for non-docx or missing JD
                results.append({
                    'filename': resume_file.name,
                    'error': 'Only .docx resumes and JD text are supported for advanced matching.'
                })

        return Response({'results': results}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def history(self, request):
        resumes = Resume.objects.filter(user=request.user).order_by('-uploaded_at')
        serializer = ResumeSerializer(resumes, many=True)
        return Response(serializer.data) 