import google.generativeai as genai
from django.conf import settings
import os
from typing import Dict, Any

class ResumeAssistantService:
    def __init__(self):
        # Configure Gemini API
        self.api_key = os.getenv('GEMINI_API_KEY', 'AIzaSyBVVoT0sVmQm0fKK4s_XSTXzy5MwazMlVY')
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    def get_resume_advice(self, prompt: str) -> Dict[str, Any]:
        """
        Generate resume advice using Gemini AI
        """
        try:
            # Add context to make responses more focused on resume/career advice
            enhanced_prompt = f"""
            You are an expert career counselor and resume specialist. 
            Please provide helpful advice for the following question about resumes, cover letters, or job hunting:
            
            {prompt}
            
            Please provide practical, actionable advice.
            """
            
            response = self.model.generate_content(
                enhanced_prompt,
                generation_config={"temperature": 0.3}
            )
            
            if response.text:
                return {
                    'success': True,
                    'response': response.text,
                    'error': None
                }
            else:
                return {
                    'success': False,
                    'response': None,
                    'error': 'No response generated'
                }
                
        except Exception as e:
            return {
                'success': False,
                'response': None,
                'error': str(e)
            }
    
    def analyze_resume_content(self, resume_text: str, job_description: str = None) -> Dict[str, Any]:
        """
        Analyze resume content and provide improvement suggestions
        """
        try:
            analysis_prompt = f"""
            Please analyze the following resume and provide detailed feedback:
            
            Resume Content:
            {resume_text}
            
            {"Job Description: " + job_description if job_description else ""}
            
            Please provide:
            1. Strengths of the resume
            2. Areas for improvement
            3. Missing key elements
            4. Formatting suggestions
            5. Content optimization tips
            {"6. How well it matches the job description" if job_description else ""}
            """
            
            response = self.model.generate_content(
                analysis_prompt,
                generation_config={"temperature": 0.3}
            )
            
            if response.text:
                return {
                    'success': True,
                    'analysis': response.text,
                    'error': None
                }
            else:
                return {
                    'success': False,
                    'analysis': None,
                    'error': 'No analysis generated'
                }
                
        except Exception as e:
            return {
                'success': False,
                'analysis': None,
                'error': str(e)
            }