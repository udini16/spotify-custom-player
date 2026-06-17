import { useEffect, useState } from "react";

const API_BASE = ["https://", "api.spotify.com", "/v1"].join("");

export default function NowPlaying({ token }) {
  const [nowPlaying, setNowPlaying] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchNowPlaying = () => {
      fetch(`${API_BASE}/me/player/currently-playing`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          // Spotify returns 204 if music is completely stopped/closed
          if (response.status === 204 || response.status > 400) {
            return null;
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.item) {
            setNowPlaying(data);
          } else {
            setNowPlaying(null);
          }
        })
        .catch((error) => console.error("Error fetching now playing:", error));
    };

    // Fetch immediately on load
    fetchNowPlaying();

    // Poll Spotify every 10 seconds to update the song
    const interval = setInterval(fetchNowPlaying, 10000);
    return () => clearInterval(interval);
  }, [token]);

  // If nothing is playing, don't show the bar at all
  if (!nowPlaying || !nowPlaying.item) return null;

  const track = nowPlaying.item;
  const albumImage = track.album?.images?.[0]?.url;
  const artistName =
    track.artists?.map((a) => a.name).join(", ") || "Unknown Artist";
  const isPlaying = nowPlaying.is_playing;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#161313] border-t border-[#2a201a] p-4 px-8 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] animate-fade-in flex items-center justify-between">
      <div className="flex items-center gap-4">
        {albumImage ? (
          <img
            src={albumImage}
            alt="Now Playing Cover"
            className={`w-14 h-14 object-cover rounded shadow-md border border-[#2a201a] ${isPlaying ? "animate-pulse" : "grayscale opacity-50"}`}
          />
        ) : (
          <div className="w-14 h-14 bg-[#1a1717] rounded border border-[#2a201a] flex items-center justify-center">
            <span className="text-[10px] text-rdr-paper/30">No Cover</span>
          </div>
        )}

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            {isPlaying && (
              <span className="flex gap-0.5 h-3 items-end">
                <span className="w-1 bg-rdr-red h-full animate-[bounce_1s_infinite]"></span>
                <span className="w-1 bg-rdr-red h-2/3 animate-[bounce_1.2s_infinite]"></span>
                <span className="w-1 bg-rdr-red h-full animate-[bounce_0.8s_infinite]"></span>
              </span>
            )}
            <p className="text-rdr-paper font-bold text-lg leading-none line-clamp-1">
              {track.name}
            </p>
          </div>
          <p className="text-rdr-paper/50 text-sm mt-1 leading-none line-clamp-1">
            {artistName}
          </p>
        </div>
      </div>

      <div className="text-xs font-bold text-rdr-highlight/40 uppercase tracking-widest hidden md:block">
        {isPlaying ? "Now Playing" : "Paused"}
      </div>
    </div>
  );
}
