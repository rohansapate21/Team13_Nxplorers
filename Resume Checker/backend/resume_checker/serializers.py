from rest_framework import serializers
from .models import Resume, ResumeMatch
from api.models import Note
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'confirm_password', 'first_name', 'last_name']
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class ResumeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Resume
        fields = ['id', 'user', 'file', 'uploaded_at', 'parsed_data']
        read_only_fields = ['id', 'user', 'uploaded_at']

class ResumeMatchSerializer(serializers.ModelSerializer):
    resume = ResumeSerializer(read_only=True)
    
    class Meta:
        model = ResumeMatch
        fields = ['id', 'resume', 'match_score', 'skills_match', 'created_at']
        read_only_fields = ['id', 'created_at']

class ResumeParseRequestSerializer(serializers.Serializer):
    resumes = serializers.ListField(
        child=serializers.FileField(),
        required=True
    )
    jd = serializers.FileField(required=False)
    jd_text = serializers.CharField(required=False)

    def validate(self, data):
        if not data.get('jd') and not data.get('jd_text'):
            raise serializers.ValidationError(
                "Either JD file or JD text must be provided"
            )
        return data

class NoteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Note
        fields = ['id', 'user', 'content', 'created_at']
        read_only_fields = ['id', 'user', 'created_at'] 