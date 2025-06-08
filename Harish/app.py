import streamlit as st
import google.generativeai as genai


API_KEY = "AIzaSyBVVoT0sVmQm0fKK4s_XSTXzy5MwazMlVY"
genai.configure(api_key=API_KEY)

st.set_page_config(page_title="Resume Assistant", layout="centered")
st.title("📝 AI Resume Helper")
st.markdown("Ask any question about resumes, cover letters, or job hunting!")


DEFAULT_MODEL = "gemini-1.5-flash"


if "messages" not in st.session_state:
    st.session_state.messages = []
    
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Accept user input
if prompt := st.chat_input("Example: How can I improve my resume for tech jobs?"):
    
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    
    with st.chat_message("user"):
        st.markdown(prompt)
    
    
    with st.chat_message("assistant"):
        with st.spinner("Analyzing your question..."):
            try:
                model = genai.GenerativeModel(DEFAULT_MODEL)
                response = model.generate_content(
                    prompt,
                    generation_config={"temperature": 0.3}  
                )
                
                
                if response.text:
                    st.markdown(response.text)
                    st.session_state.messages.append({"role": "assistant", "content": response.text})
                else:
                    st.error("Sorry, I couldn't generate a response. Please try again.")
                    
            except Exception as e:
                st.error(f"Error: {str(e)}")
                st.info("Please check your internet connection and try again.")
