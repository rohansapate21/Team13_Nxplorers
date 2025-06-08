from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import google.generativeai as genai
from django.conf import settings
import os

# Configure Gemini API
API_KEY = "AIzaSyBVVoT0sVmQm0fKK4s_XSTXzy5MwazMlVY"  # Move to environment variables
genai.configure(api_key=API_KEY)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_resume_advice(request):
    """
    API endpoint to get resume advice using Gemini AI
    """
    try:
        prompt = request.data.get('prompt', '')
        
        if not prompt:
            return Response(
                {'error': 'Prompt is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Initialize Gemini model
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Generate response
        response = model.generate_content(
            prompt,
            generation_config={"temperature": 0.3}
        )
        
        if response.text:
            return Response({
                'success': True,
                'response': response.text,
                'user': request.user.username
            })
        else:
            return Response(
                {'error': 'Could not generate response'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        return Response(
            {'error': f'Error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )