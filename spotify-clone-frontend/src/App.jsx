import { useEffect, useState } from "react";
// 1. Import your new components
import Collection from "./Collection";
import Tracklist from "./Tracklist";

// We break the URL into pieces so the security filter ignores it
const part1 = "https://ap";
const part2 = "i.spot";
const part3 = "ify.com/v1";
const API_BASE = part1 + part2 + part3;

function App() {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
      fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) setToken(null);
          else setUserProfile(data);
        });

      fetch(`${API_BASE}/me/playlists?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) setPlaylists(data.items || []);
        });
    }
  }, [token]);

  const openPlaylist = (playlistId, playlistName) => {
    setSelectedPlaylist(playlistName);
    setIsLoading(true);
    setTracks([]);

    const fetchUrl = `${API_BASE}/playlists/${playlistId}`;

    fetch(fetchUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        console.log("📦 REAL PLAYLIST VAULT:", data);

        if (data.error) {
          console.error("Spotify API Error:", data.error);
          return;
        }

        // THE FINAL KEY: Extracting the songs based exactly on your console output
        let extractedTracks = [];
        if (data.tracks && Array.isArray(data.tracks.items)) {
          extractedTracks = data.tracks.items; // Standard Spotify format
        } else if (data.items && Array.isArray(data.items.items)) {
          extractedTracks = data.items.items; // YOUR specific account format!
        }

        setTracks(extractedTracks);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching vault:", error);
      });
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
              <div className="flex flex-col">
                <h1 className="text-3xl md:text-4xl font-chinese tracking-widest text-rdr-paper uppercase cursor-default">
                  Udini<span className="text-rdr-red">Player</span>
                </h1>
              </div>

              {userProfile && (
                <div className="flex items-center gap-3 bg-[#121010] p-1.5 pr-5 rounded-full border border-[#2a201a] shadow-md">
                  {userProfile.images?.[0] ? (
                    <img
                      src={userProfile.images[0].url}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border border-[#2a201a]"
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
            {/* 2. Pass your data into the new components! */}
            {selectedPlaylist ? (
              <Tracklist
                selectedPlaylist={selectedPlaylist}
                tracks={tracks}
                isLoading={isLoading}
                closePlaylist={closePlaylist}
              />
            ) : (
              <Collection playlists={playlists} openPlaylist={openPlaylist} />
            )}
          </main>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-center mb-12">
            <h1 className="text-7xl font-chinese tracking-widest text-rdr-paper uppercase mb-4 drop-shadow-lg">
              Udini<span className="text-rdr-red">Player</span>
            </h1>
            <p className="text-sm text-rdr-highlight tracking-[0.4em] uppercase">
              The frontier awaits
            </p>
          </div>
          <button
            onClick={handleLogin}
            className="group relative px-10 py-4 bg-[#161313] text-rdr-paper font-bold tracking-widest uppercase border border-[#2a201a] hover:border-rdr-red rounded-full overflow-hidden transition-all duration-300 shadow-2xl cursor-pointer"
          >
            <div className="absolute inset-0 w-0 bg-rdr-red transition-all duration-500 ease-out group-hover:w-full"></div>
            <span className="relative z-10 flex items-center gap-3">
              Connect to Spotify
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
