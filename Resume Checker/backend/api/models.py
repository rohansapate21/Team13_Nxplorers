from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class ResumeConversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.question[:50]}..."

class SavedArticle(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    url = models.URLField()
    source = models.CharField(max_length=200, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    saved_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'url']
        ordering = ['-saved_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title[:50]}..."

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    career_field = models.CharField(max_length=200, blank=True)
    experience_level = models.CharField(max_length=50, choices=[
        ('fresher', 'Fresher'),
        ('junior', 'Junior (1-2 years)'),
        ('mid', 'Mid-level (3-5 years)'),
        ('senior', 'Senior (5+ years)'),
        ('lead', 'Lead/Manager'),
    ], blank=True)
    skills = models.TextField(blank=True, help_text="Comma-separated skills")
    resume_uploaded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} Profile"