from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.db import playlist_collection
import yt_dlp
import os
import zipfile
import uuid

router = APIRouter()

@router.post("/search")
async def search(query: str):
    # Dummy search (replace with YouTube API or scrape later)
    return [
        {"title": f"{query} Song 1", "videoId": "abc123", "thumbnail": "https://picsum.photos/200"},
        {"title": f"{query} Song 2", "videoId": "def456", "thumbnail": "https://picsum.photos/200"},
    ]

@router.post("/save_playlist")
async def save_playlist(data: dict):
    name = data.get("name")
    songs = data.get("songs")
    if not name or not songs:
        raise HTTPException(status_code=400, detail="Invalid data")
    playlist = {"name": name, "songs": songs}
    await playlist_collection.insert_one(playlist)
    return {"message": "Playlist saved"}

@router.get("/playlists")
async def get_playlists():
    playlists = []
    async for playlist in playlist_collection.find():
        playlist["_id"] = str(playlist["_id"])
        playlists.append(playlist)
    return playlists

@router.post("/download_playlist")
async def download_playlist(video_ids: list[str]):
    if not video_ids:
        raise HTTPException(status_code=400, detail="No videos provided")

    temp_folder = f"temp_{uuid.uuid4()}"
    os.makedirs(temp_folder, exist_ok=True)

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f'{temp_folder}/%(title)s.%(ext)s',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        for vid in video_ids:
            url = f"https://www.youtube.com/watch?v={vid}"
            ydl.download([url])

    zip_filename = f"{temp_folder}.zip"
    with zipfile.ZipFile(zip_filename, 'w') as zipf:
        for root, _, files in os.walk(temp_folder):
            for file in files:
                filepath = os.path.join(root, file)
                zipf.write(filepath, arcname=file)

    for file in os.listdir(temp_folder):
        os.remove(os.path.join(temp_folder, file))
    os.rmdir(temp_folder)

    return FileResponse(zip_filename, media_type='application/zip', filename="playlist.zip")
