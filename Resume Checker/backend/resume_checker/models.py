from django.db import models
from django.contrib.auth.models import User

class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='resumes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    parsed_data = models.JSONField(null=True, blank=True)
    
    def __str__(self):
        return f"Resume of {self.user.username}"

class ResumeMatch(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    match_score = models.FloatField()
    skills_match = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Match for {self.resume} ({self.match_score}%)" 