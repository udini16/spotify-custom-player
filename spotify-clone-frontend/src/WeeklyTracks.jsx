import { useEffect, useState } from "react";

const API_BASE = ["https://", "api.spoti", "fy.com/v1"].join("");

// ⏱️ Helper function to convert milliseconds to mm:ss
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

  return (
    <div className="w-full animate-fade-in">
      <button
        onClick={goBack}
        className="mb-8 md:mb-10 px-5 md:px-6 py-2 md:py-2.5 rounded-full bg-[#1a1717] text-rdr-paper border border-[#2a201a] hover:border-rdr-red hover:bg-[#201c1c] transition-all duration-300 font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2 shadow-lg cursor-pointer w-fit"
      >
        <span>←</span> Back to Collection
      </button>

      {/* 🚨 UPDATED HEADER: Stacks on mobile, sits side-by-side on desktop */}
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
              track.artists?.map((a) => a.name).join(", ") || "Unknown Artist";
            const albumName = track.album?.name || "Unknown Album";
            const albumImage = track.album?.images?.[0]?.url;

            const duration = track.duration_ms
              ? formatDuration(track.duration_ms)
              : "--:--";

            return (
              <div
                key={track.id || index}
                // 🚨 TIGHTER PADDING ON MOBILE
                className="flex items-center justify-between p-3 md:p-4 px-4 md:px-6 border-b border-[#1f1a1a] last:border-0 hover:bg-[#1f1a1a] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 md:gap-6 overflow-hidden">
                  {/* Smaller numbers on mobile */}
                  <span className="text-rdr-highlight/50 font-medium w-4 md:w-8 text-right group-hover:text-rdr-red transition-colors text-xs md:text-base shrink-0">
                    {index + 1}
                  </span>

                  {albumImage && (
                    <img
                      src={albumImage}
                      className="w-10 h-10 md:w-14 md:h-14 object-cover rounded-md shadow-md grayscale group-hover:grayscale-0 transition-all duration-500 shrink-0"
                      alt="album"
                    />
                  )}

                  <div className="flex flex-col justify-center overflow-hidden pr-2">
                    {/* Shrink text so it doesn't wrap awkwardly */}
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
                  {/* Adjusted width for duration so it fits cleanly */}
                  <div className="text-rdr-highlight/40 text-xs md:text-sm font-medium w-10 md:w-12 text-right group-hover:text-rdr-highlight/80 transition-colors">
                    {duration}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
