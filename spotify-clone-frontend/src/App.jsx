import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const spotifyToken = urlParams.get("token");

    if (spotifyToken) {
      setToken(spotifyToken);
      window.history.pushState({}, null, "/");
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error("Spotify API Error (Profile):", data.error);
            setToken(null);
          } else {
            setUserProfile(data);
          }
        })
        .catch((error) => console.error("Error fetching profile:", error));

      fetch("https://api.spotify.com/v1/me/playlists", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error("Spotify API Error (Playlists):", data.error);
          } else {
            // NEW: Print the very first playlist to the console so we can inspect it!
            console.log("🔍 INSPECT THIS PLAYLIST:", data.items[0]);

            setPlaylists(data.items || []);
          }
        })
        .catch((error) => console.error("Error fetching playlists:", error));
    }
  }, [token]);

  const openPlaylist = (playlistId, playlistName) => {
    setSelectedPlaylist(playlistName);

    fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setTracks(data.items || []);
      })
      .catch((error) => console.error("Error fetching tracks:", error));
  };

  const closePlaylist = () => {
    setSelectedPlaylist(null);
    setTracks([]);
  };

  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/auth/spotify";
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#121010] selection:bg-rdr-red selection:text-white pb-32">
      {token ? (
        <div className="w-full flex flex-col items-center">
          <header className="w-full bg-[#161313]/90 backdrop-blur-md border-b border-[#1f1a1a] sticky top-0 z-50 flex justify-center px-8 py-4 shadow-xl">
            <div className="w-full max-w-7xl flex items-center justify-between">
              {/* UPDATED: Nav Logo */}
              <div className="flex flex-col">
                <h1 className="text-3xl md:text-4xl font-chinese tracking-widest text-rdr-paper uppercase cursor-default">
                  Udini<span className="text-rdr-red">Player</span>
                </h1>
              </div>

              {userProfile && (
                <div className="flex items-center gap-3 bg-[#121010] p-1.5 pr-5 rounded-full border border-[#2a201a] hover:border-rdr-red/40 hover:bg-[#1a1717] transition-all cursor-pointer shadow-md group">
                  {userProfile.images && userProfile.images.length > 0 ? (
                    <img
                      src={userProfile.images[0].url}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border border-[#2a201a] group-hover:border-rdr-red/50 transition-colors"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#2a201a] flex items-center justify-center">
                      <span className="text-xs text-rdr-paper/50">U</span>
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    <span className="text-sm font-bold text-rdr-paper tracking-wide leading-tight">
                      {userProfile.display_name}
                    </span>
                    <span className="text-[10px] text-rdr-highlight/70 uppercase tracking-widest leading-tight">
                      {userProfile.product} Plan
                    </span>
                  </div>
                </div>
              )}
            </div>
          </header>

          <main className="w-full max-w-7xl px-8 mt-12">
            {selectedPlaylist ? (
              <div className="w-full animate-fade-in">
                <button
                  onClick={closePlaylist}
                  className="mb-10 px-6 py-2.5 rounded-full bg-[#1a1717] text-rdr-paper border border-[#2a201a] hover:border-rdr-red hover:bg-[#201c1c] transition-all duration-300 font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg"
                >
                  <span>←</span> Back to Collection
                </button>

                <div className="flex items-end gap-6 mb-12 border-b border-[#2a201a] pb-8">
                  <h3 className="text-5xl font-bold text-rdr-paper tracking-tight">
                    {selectedPlaylist}
                  </h3>
                </div>

                <div className="flex flex-col bg-[#141212] rounded-xl border border-[#2a201a] overflow-hidden shadow-2xl">
                  {tracks?.map((item, index) => {
                    const track = item.track;
                    if (!track) return null;

                    return (
                      <div
                        key={track.id || index}
                        className="flex items-center justify-between p-4 px-6 border-b border-[#1f1a1a] last:border-0 hover:bg-[#1f1a1a] transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-6">
                          <span className="text-rdr-highlight/50 font-medium w-8 text-right group-hover:text-rdr-red transition-colors">
                            {index + 1}
                          </span>

                          {track.album?.images?.[0] ? (
                            <img
                              src={track.album.images[0].url}
                              className="w-14 h-14 object-cover rounded-md shadow-md grayscale group-hover:grayscale-0 transition-all duration-500"
                              alt="album cover"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-[#1a1717] rounded-md border border-[#2a201a] flex items-center justify-center">
                              <span className="text-[10px] text-rdr-paper/30">
                                No Cover
                              </span>
                            </div>
                          )}

                          <div className="flex flex-col justify-center">
                            <p className="text-rdr-paper font-bold text-lg group-hover:text-rdr-red transition-colors line-clamp-1">
                              {track.name}
                            </p>
                            <p className="text-rdr-paper/50 text-sm mt-0.5">
                              {track.artists?.map((a) => a.name).join(", ") ||
                                "Unknown Artist"}
                            </p>
                          </div>
                        </div>

                        <div className="text-rdr-highlight/60 text-sm hidden md:block max-w-[200px] lg:max-w-xs truncate font-medium">
                          {track.album?.name || "Unknown Album"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-between mb-10">
                  {/* UPDATED: Your Collection Text */}
                  <h3 className="text-4xl font-chinese text-rdr-paper tracking-wide">
                    Your <span className="text-rdr-red">Collection</span>
                  </h3>
                  <span className="text-sm font-bold tracking-widest text-rdr-highlight/50 uppercase">
                    {playlists?.length || 0} Saved
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                  {playlists?.map((playlist, index) => (
                    <div
                      key={playlist.id || index}
                      onClick={() => openPlaylist(playlist.id, playlist.name)}
                      className="bg-[#161313] rounded-xl border border-[#231d1d] hover:border-rdr-red/40 hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden shadow-xl group flex flex-col h-full"
                    >
                      <div className="relative w-full aspect-square overflow-hidden bg-[#1f1a1a]">
                        {playlist.images && playlist.images.length > 0 ? (
                          <>
                            <img
                              src={playlist.images[0].url}
                              alt={playlist.name}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#161313] via-transparent to-transparent opacity-90"></div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-rdr-paper/20 font-medium">
                              No Cover
                            </span>
                          </div>
                        )}

                        <div className="absolute bottom-4 right-4 w-12 h-12 bg-rdr-red rounded-full flex items-center justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_15px_rgba(113,16,16,0.6)]">
                          <svg
                            className="w-5 h-5 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow justify-between">
                        <p className="font-bold text-rdr-paper text-lg line-clamp-1 group-hover:text-rdr-red transition-colors mb-2">
                          {playlist.name}
                        </p>
                        <p className="text-xs font-bold text-rdr-highlight/70 uppercase tracking-widest">
                          {playlist.tracks?.total || playlist.items?.total || 0}{" "}
                          Tracks
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-center mb-12">
            {/* UPDATED: Login Screen Logo */}
            <h1 className="text-7xl font-chinese tracking-widest text-rdr-paper uppercase mb-4 drop-shadow-lg">
              Udini<span className="text-rdr-red">Player</span>
            </h1>
            <p className="text-sm text-rdr-highlight tracking-[0.4em] uppercase">
              The frontier awaits
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="group relative px-10 py-4 bg-[#161313] text-rdr-paper font-bold tracking-widest uppercase border border-[#2a201a] hover:border-rdr-red rounded-full overflow-hidden transition-all duration-300 shadow-2xl"
          >
            <div className="absolute inset-0 w-0 bg-rdr-red transition-all duration-500 ease-out group-hover:w-full"></div>
            <span className="relative z-10 flex items-center gap-3">
              Connect to Spotify
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
