from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import yt_dlp
import requests

app = FastAPI()

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 Hardcoded YouTube API key for testing
YOUTUBE_API_KEY = "AIzaSyA0LSaBM6aVhvenVq4u-KFSpnXOZHfcwck"  # <<< Replace this

@app.get("/api/search")
def search_youtube(q: str = Query(...)):
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "key": YOUTUBE_API_KEY,
        "q": q,
        "part": "snippet",
        "maxResults": 10,
        "type": "video"
    }

    response = requests.get(url, params=params)

    # 🔍 Debug output
    print("🔗 Request URL:", response.url)
    print("📦 Status:", response.status_code)
    print("🧾 Response Body:", response.text)

    if response.status_code != 200:
        return {
            "error": "YouTube API call failed",
            "status_code": response.status_code,
            "response": response.text
        }

    data = response.json()
    items = data.get("items", [])

    tracks = [
        {
            "title": item["snippet"]["title"],
            "artist": item["snippet"]["channelTitle"],
            "videoId": item["id"]["videoId"]
        }
        for item in items
        if item["id"]["kind"] == "youtube#video"
    ]

    return {"tracks": tracks}


@app.get("/api/stream")
def stream_audio(videoId: str = Query(...)):
    url = f"https://www.youtube.com/watch?v={videoId}"

    ydl_opts = {
        'format': 'bestaudio/best',
        'quiet': True,
        'noplaylist': True,
        'extract_flat': False
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        audio_url = next(
            (f['url'] for f in info['formats'] if f['ext'] in ['m4a', 'webm']),
            None
        )

    if not audio_url:
        return {"error": "Audio stream not found"}

    return StreamingResponse(
        requests.get(audio_url, stream=True).raw,
        media_type="audio/mpeg"
    )
