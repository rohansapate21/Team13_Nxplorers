from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ResumeConversation, SavedArticle, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class ResumeConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeConversation
        fields = ('id', 'title', 'messages', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class SavedArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedArticle
        fields = ('id', 'title', 'url', 'summary', 'created_at')
        read_only_fields = ('created_at',)

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = ('id', 'username', 'email', 'role', 'resume_file', 'created_at')
        read_only_fields = ('created_at',)

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