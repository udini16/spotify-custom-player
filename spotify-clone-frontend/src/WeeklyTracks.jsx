import { useEffect, useState } from "react";

const API_BASE = ["https://", "api.spoti", "fy.com/v1"].join("");

export default function WeeklyTracks({ token, goBack }) {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch top tracks (short_term = approx last 4 weeks)
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
        className="mb-10 px-6 py-2.5 rounded-full bg-[#1a1717] text-rdr-paper border border-[#2a201a] hover:border-rdr-red hover:bg-[#201c1c] transition-all duration-300 font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg cursor-pointer"
      >
        <span>←</span> Back to Collection
      </button>

      <div className="flex items-end gap-6 mb-12 border-b border-[#2a201a] pb-8">
        <h3 className="text-5xl font-bold text-rdr-paper tracking-tight">
          Heavy Rotation{" "}
          <span className="text-rdr-red text-2xl tracking-widest uppercase ml-4">
            This Month
          </span>
        </h3>
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

            return (
              <div
                key={track.id || index}
                className="flex items-center justify-between p-4 px-6 border-b border-[#1f1a1a] last:border-0 hover:bg-[#1f1a1a] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <span className="text-rdr-highlight/50 font-medium w-8 text-right group-hover:text-rdr-red transition-colors">
                    {index + 1}
                  </span>
                  {albumImage && (
                    <img
                      src={albumImage}
                      className="w-14 h-14 object-cover rounded-md shadow-md grayscale group-hover:grayscale-0 transition-all duration-500"
                      alt="album"
                    />
                  )}
                  <div className="flex flex-col justify-center">
                    <p className="text-rdr-paper font-bold text-lg group-hover:text-rdr-red transition-colors line-clamp-1">
                      {trackName}
                    </p>
                    <p className="text-rdr-paper/50 text-sm mt-0.5">
                      {artistName}
                    </p>
                  </div>
                </div>
                <div className="text-rdr-highlight/60 text-sm hidden md:block max-w-[200px] lg:max-w-xs truncate font-medium">
                  {albumName}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
