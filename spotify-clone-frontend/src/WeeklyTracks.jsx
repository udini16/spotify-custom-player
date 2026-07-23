import { useEffect, useState, useRef } from "react";
import { toPng } from "html-to-image";

const API_BASE = ["https://", "api.spoti", "fy.com/v1"].join("");

const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return seconds == 60
    ? minutes + 1 + ":00"
    : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

export default function WeeklyTracks({ token, goBack }) {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);

  // 📸 1. Setup the camera focus point
  const posterRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/me/top/tracks?time_range=short_term&limit=20`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        if (data.items) {
          setTracks(data.items);
        }
      })
      .catch((error) => {
        console.error("Error fetching top tracks:", error);
        setIsLoading(false);
      });
  }, [token]);

  const takeSnapshot = async () => {
    if (!posterRef.current) return;

    setIsCapturing(true);

    try {
      // toPng handles modern CSS, oklab, and CORS automatically much better
      const dataUrl = await toPng(posterRef.current, {
        backgroundColor: "#121010",
        pixelRatio: 2, // Keeps it high-res for mobile screens
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "UdiniPlayer_HeavyRotation.png";
      link.click();
    } catch (err) {
      console.error("Snapshot failed:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex justify-between items-center mb-8 md:mb-10">
        <button
          onClick={goBack}
          className="px-5 md:px-6 py-2 md:py-2.5 rounded-full bg-[#1a1717] text-rdr-paper border border-[#2a201a] hover:border-rdr-red hover:bg-[#201c1c] transition-all duration-300 font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <span>←</span> Back to Collection
        </button>

        {/* 📸 3. The Share Button */}
        {!isLoading && tracks.length > 0 && (
          <button
            onClick={takeSnapshot}
            disabled={isCapturing}
            className="px-5 md:px-6 py-2 md:py-2.5 rounded-full bg-rdr-red text-white border border-rdr-red hover:bg-rdr-red/80 transition-all duration-300 font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(204,0,0,0.4)] cursor-pointer disabled:opacity-50"
          >
            {isCapturing ? "Exporting..." : "📷 Export Poster"}
          </button>
        )}
      </div>

      {/* 📸 4. Everything inside this div gets captured by the camera */}
      <div
        ref={posterRef}
        className="p-4 md:p-8 bg-[#121010] rounded-2xl border border-transparent"
      >
        <div className="flex flex-col md:flex-row md:items-end gap-1 md:gap-6 mb-8 md:mb-12 border-b border-[#2a201a] pb-6 md:pb-8">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-rdr-paper tracking-tight leading-none">
            Heavy Rotation
          </h3>
          <span className="text-rdr-red text-sm sm:text-base md:text-2xl tracking-widest uppercase font-bold mt-1 md:mt-0">
            This Month
          </span>
        </div>

        <div className="flex flex-col bg-[#141212] rounded-xl border border-[#2a201a] overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="p-8 text-center text-rdr-highlight font-bold animate-pulse">
              Analyzing your listening history...
            </div>
          ) : tracks.length === 0 ? (
            <div className="p-8 text-center text-rdr-highlight font-bold">
              No listening history found yet.
            </div>
          ) : (
            tracks.map((track, index) => {
              const trackName = track.name || "Unknown Track";
              const artistName =
                track.artists?.map((a) => a.name).join(", ") ||
                "Unknown Artist";
              const albumName = track.album?.name || "Unknown Album";
              const albumImage = track.album?.images?.[0]?.url;

              const duration = track.duration_ms
                ? formatDuration(track.duration_ms)
                : "--:--";

              return (
                <div
                  key={track.id || index}
                  className="flex items-center justify-between p-3 md:p-4 px-4 md:px-6 border-b border-[#1f1a1a] last:border-0 hover:bg-[#1f1a1a] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 md:gap-6 overflow-hidden">
                    <span className="text-rdr-highlight/50 font-medium w-4 md:w-8 text-right group-hover:text-rdr-red transition-colors text-xs md:text-base shrink-0">
                      {index + 1}
                    </span>

                    {albumImage && (
                      <img
                        src={albumImage}
                        className="w-10 h-10 md:w-14 md:h-14 object-cover rounded-md shadow-md grayscale group-hover:grayscale-0 transition-all duration-500 shrink-0"
                        alt="album"
                        crossOrigin="anonymous" // 🚨 Extra security bypass for HTML2Canvas
                      />
                    )}

                    <div className="flex flex-col justify-center overflow-hidden pr-2">
                      <p className="text-rdr-paper font-bold text-sm md:text-lg group-hover:text-rdr-red transition-colors truncate">
                        {trackName}
                      </p>
                      <p className="text-rdr-paper/50 text-xs md:text-sm mt-0.5 truncate">
                        {artistName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-8 shrink-0">
                    <div className="text-rdr-highlight/60 text-sm hidden md:block max-w-[200px] lg:max-w-xs truncate font-medium">
                      {albumName}
                    </div>
                    <div className="text-rdr-highlight/40 text-xs md:text-sm font-medium w-10 md:w-12 text-right group-hover:text-rdr-highlight/80 transition-colors">
                      {duration}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="mt-6 text-center text-rdr-highlight/30 text-[10px] tracking-[0.3em] uppercase font-bold">
          Generated by UdiniPlayer
        </div>
      </div>
    </div>
  );
}
