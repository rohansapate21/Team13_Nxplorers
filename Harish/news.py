import streamlit as st
import requests
from datetime import datetime

# UI Configuration
st.set_page_config(page_title="💼 Tech Career News", layout="wide")
st.title("📰 Tech News")


NEWS_API_KEY = "5447104d9f464b4fae5de0c60b3ee59a"  


SEARCH_TERMS = [
    "software development", "artificial intelligence", "data science",
    "machine learning", "web development", "tech hiring", "developer careers"
]


BLACKLIST_TERMS = [
    "bjp", "trump", "modi", "pakistan", "election", "israel", "gaza", "ukraine", "russia",
    "netflix", "series", "movie", "actor", "actress", "celebrity", "football", "cricket",
    "instagram", "tiktok", "reels", "scandal", "politics", "entertainment", "mayor", "drama"
]


def is_relevant(text):
    if not text:
        return False
    text = text.lower()
    return not any(bad_word in text for bad_word in BLACKLIST_TERMS)

# Fetch and filter articles
def fetch_filtered_news(api_key, queries):
    articles = []
    seen_titles = set()
    for term in queries:
        url = f"https://newsapi.org/v2/everything?q={term}&language=en&sortBy=publishedAt&pageSize=30&apiKey={api_key}"
        response = requests.get(url)
        if response.status_code == 200:
            for a in response.json().get("articles", []):
                title = a["title"]
                desc = a["description"] or ""
                if title not in seen_titles and is_relevant(title) and is_relevant(desc):
                    seen_titles.add(title)
                    try:
                        published_at = datetime.fromisoformat(a["publishedAt"].replace("Z", "+00:00"))
                    except:
                        published_at = datetime.min
                    articles.append({
                        "title": title,
                        "author": a["author"] or "Unknown",
                        "source": a["source"]["name"],
                        "published_at": published_at,
                        "description": desc,
                        "url": a["url"]
                    })
    return sorted(articles, key=lambda x: x["published_at"], reverse=True)

# Main Execution
if not NEWS_API_KEY:
    st.error("⚠️ Please provide your NewsAPI key.")
else:
    articles = fetch_filtered_news(NEWS_API_KEY, SEARCH_TERMS)

    if not articles:
        st.warning("⚠️ No relevant articles found. Try again later.")
    else:
        for article in articles:
            st.subheader(f"📌 {article['title']}")
            st.write(f"📅 {article['published_at'].strftime('%Y-%m-%d %H:%M')} | 📰 {article['source']} | 👤 {article['author']}")
            if article["description"]:
                st.write(f"💬 {article['description']}")
            st.markdown(f"[🔗 Read Full Article]({article['url']})")
            st.markdown("---")

