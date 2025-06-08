import streamlit as st
import requests


API_KEY = "5447104d9f464b4fae5de0c60b3ee59a"  

st.set_page_config(page_title="📰 Tech & Job News", layout="wide")
st.title("📰 Latest Technical & Job-Oriented News")
st.markdown("This dashboard shows the latest **technology and career-related** news articles from around the world.")

# News API setup
url = "https://newsapi.org/v2/everything"
query = "technology AND (developer OR jobs OR placement OR internship OR upskilling OR hiring OR fresher OR resume)"

articles = []

for page in range(1, 6): 
    params = {
        "q": query,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": 20,
        "page": page,
        "apiKey": API_KEY
    }

    try:
        response = requests.get(url, params=params)
        data = response.json()

        if data.get("status") == "ok":
            articles.extend(data["articles"])
        else:
            st.error(f"NewsAPI Error: {data.get('message', 'Unknown error')}")
            break

    except Exception as e:
        st.error(f"Error fetching news: {e}")
        break


if articles:
    for article in articles:
        with st.container():
            st.subheader(article.get("title", "No Title"))
            st.write(article.get("description", "No Description"))
            st.markdown(f"[🔗 Read more]({article.get('url')})")
            st.markdown("---")
else:
    st.warning("No news articles available at the moment.")
