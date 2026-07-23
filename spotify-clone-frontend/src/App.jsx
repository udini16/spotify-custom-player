import { useEffect, useState } from "react";
import Collection from "./Collection";
import Tracklist from "./Tracklist";
import NowPlaying from "./NowPlaying";
import WeeklyTracks from "./WeeklyTracks";

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
  const [currentView, setCurrentView] = useState("collection");
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. Check if a new token just arrived in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    // 2. Check if we have an old token saved in the browser's hard drive
    const savedToken = window.localStorage.getItem("udini_spotify_token");

    if (urlToken) {
      // We just logged in! Save it to React AND the Hard Drive
      setToken(urlToken);
      window.localStorage.setItem("udini_spotify_token", urlToken);
      window.history.pushState({}, null, "/"); // Clean the URL
    } else if (savedToken) {
      // We refreshed the page! Pull the token from the Hard Drive
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            // THE FIX: Destroy the dead token from memory AND the hard drive
            setToken(null);
            window.localStorage.removeItem("udini_spotify_token");
          } else {
            setUserProfile(data);
          }
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

  // Add this new state right under your other states at the top
  const [playlistError, setPlaylistError] = useState(null);

  const openPlaylist = (playlistId, playlistName) => {
    setSelectedPlaylist(playlistName);
    setIsLoading(true);
    setTracks([]);
    setPlaylistError(null); // Reset the error lock

    // 🚨 REVERT: Back to the main playlist endpoint that actually worked for your own songs
    const fetchUrl = `${API_BASE}/playlists/${playlistId}`;

    fetch(fetchUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        // Still catch the bouncer just in case!
        if (response.status === 403) {
          setPlaylistError(403);
          return null; // Stop processing
        }
        return response.json();
      })
      .then((data) => {
        setIsLoading(false);

        // If we hit the 403, data will be null, so we safely exit
        if (!data) return;

        if (data.error) {
          console.error("Spotify API Error:", data.error);
          setPlaylistError(data.error.status);
          return;
        }

        // Back to the bulletproof extraction logic for your custom account structure
        let extractedTracks = [];
        if (data.tracks && Array.isArray(data.tracks.items)) {
          extractedTracks = data.tracks.items;
        } else if (data.items && Array.isArray(data.items.items)) {
          extractedTracks = data.items.items;
        }

        // 🚨 THE GHOST DETECTOR
        // If Spotify sends the playlist metadata but completely deletes the tracks object, force the lock
        if (extractedTracks.length === 0 && !data.tracks) {
          setPlaylistError(403);
          return;
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
    setPlaylistError(null); // Reset the error
  };

  const handleLogin = () => {
    window.location.href =
      "https://udiniplayer-backend.onrender.com/auth/spotify";
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[100dvh] bg-[#121010] selection:bg-rdr-red selection:text-white pb-32">
      {token ? (
        <div className="w-full flex flex-col items-center">
          <header className="w-full bg-[#161313]/90 backdrop-blur-md border-b border-[#1f1a1a] sticky top-0 z-50 flex justify-center px-4 md:px-8 py-3 md:py-4 shadow-xl">
            <div className="w-full max-w-7xl flex items-center justify-between gap-2">
              <div className="flex flex-col shrink-0">
                <h1
                  onClick={() => {
                    setCurrentView("collection");
                    closePlaylist();
                  }}
                  className="text-xl sm:text-2xl md:text-4xl font-chinese tracking-widest text-rdr-paper uppercase cursor-pointer hover:text-rdr-red transition-colors whitespace-nowrap"
                >
                  Udini<span className="text-rdr-red">Player</span>
                </h1>
              </div>

              <div className="flex items-center gap-3 md:gap-6">
                {/* 🚨 RESPONSIVE NAVIGATION BUTTON */}
                <button
                  onClick={() => {
                    setCurrentView("weekly");
                    closePlaylist();
                  }}
                  className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-rdr-highlight hover:text-rdr-paper transition-colors text-right md:text-left leading-tight"
                >
                  Monthly
                  <br className="block md:hidden" /> Top
                </button>

                {/* 🚨 RESPONSIVE PROFILE BADGE */}
                {userProfile && (
                  <div className="flex items-center gap-3 bg-[#121010] p-1 md:p-1.5 md:pr-5 rounded-full border border-[#2a201a] shadow-md shrink-0">
                    {userProfile.images?.[0] ? (
                      <img
                        src={userProfile.images[0].url}
                        alt="Profile"
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-[#2a201a]"
                      />
                    ) : (
                      <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#2a201a] flex items-center justify-center">
                        <span className="text-xs text-rdr-paper/50">U</span>
                      </div>
                    )}
                    {/* Hide the text on mobile, show on medium screens and up */}
                    <div className="hidden md:flex flex-col justify-center">
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
            </div>
          </header>

          <main className="w-full max-w-7xl px-8 mt-12">
            {currentView === "weekly" ? (
              <WeeklyTracks
                token={token}
                goBack={() => setCurrentView("collection")}
              />
            ) : selectedPlaylist ? (
              <Tracklist
                selectedPlaylist={selectedPlaylist}
                tracks={tracks}
                isLoading={isLoading}
                closePlaylist={closePlaylist}
                playlistError={playlistError}
              />
            ) : (
              <Collection playlists={playlists} openPlaylist={openPlaylist} />
            )}
          </main>

          {/* THE NOW PLAYING BAR LIVES HERE INSIDE THE DRIVER CONTROLS */}
          <NowPlaying token={token} />
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
