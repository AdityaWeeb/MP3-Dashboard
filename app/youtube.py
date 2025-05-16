# app/youtube.py

import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"

def search_youtube(query):
    params = {
        "part": "snippet",
        "q": query,
        "key": YOUTUBE_API_KEY,
        "maxResults": 10,
        "type": "video",
    }
    response = requests.get(SEARCH_URL, params=params)
    data = response.json()

    results = []
    for item in data.get("items", []):
        video = {
            "title": item["snippet"]["title"],
            "videoId": item["id"]["videoId"],
            "thumbnail": item["snippet"]["thumbnails"]["default"]["url"]
        }
        results.append(video)
    return results
