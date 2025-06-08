from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Note, ResumeConversation, SavedArticle, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        # Create user profile automatically
        UserProfile.objects.create(user=user)
        return user

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'updated_at']

class ResumeConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeConversation
        fields = ['id', 'question', 'response', 'created_at']

class SavedArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedArticle
        fields = ['id', 'title', 'description', 'url', 'source', 'published_at', 'saved_at']

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'career_field', 'experience_level', 
                 'skills', 'resume_uploaded', 'created_at', 'updated_at']

# Request/Response serializers for API endpoints
class ResumeQuestionSerializer(serializers.Serializer):
    question = serializers.CharField(max_length=1000)

class ResumeAnalysisSerializer(serializers.Serializer):
    resume_text = serializers.CharField()
    job_description = serializers.CharField(required=False, allow_blank=True)

class NewsQuerySerializer(serializers.Serializer):
    page = serializers.IntegerField(default=1, min_value=1)
    topic = serializers.CharField(required=False, allow_blank=True)

class SaveArticleSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=500)
    description = serializers.CharField(allow_blank=True)
    url = serializers.URLField()
    source = serializers.CharField(max_length=200, allow_blank=True)
    published_at = serializers.DateTimeField(required=False, allow_null=True)