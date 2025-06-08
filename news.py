import streamlit as st
import requests

st.set_page_config(page_title="Career News", layout="centered")
st.title("📰 Career & Resume News")
st.markdown("Stay updated with resume tips, job updates, and placement news!")

API_KEY = "5447104d9f464b4fae5de0c60b3ee59a"  # Replace with your key

params = {
    "q": "resume OR interview OR job hunting OR placement",
    "language": "en",
    "sortBy": "publishedAt",
    "pageSize": 20,  # Max per page
    "apiKey": API_KEY
}

# Load multiple pages
articles = []
for page in range(1, 6):  # 5 pages × 20 = 100 articles max
    params["page"] = page
    response = requests.get("https://newsapi.org/v2/everything", params=params)
    data = response.json()
    if data["status"] == "ok":
        articles.extend(data["articles"])
    else:
        st.error("Error fetching news")
        break

# Show the articles
if articles:
    for article in articles:
        st.subheader(article["title"])
        if article["description"]:
            st.write(article["description"])
        st.markdown(f"[🔗 Read more]({article['url']})")
        st.markdown("---")
else:
    st.info("No news articles found.")
