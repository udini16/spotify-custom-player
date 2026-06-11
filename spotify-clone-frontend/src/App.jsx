import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // 1. Catch the token from the URL when we bounce back from Laravel
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const spotifyToken = urlParams.get("token");

    if (spotifyToken) {
      setToken(spotifyToken);
      window.history.pushState({}, null, "/");
    }
  }, []);

  // 2. NEW: Use the token to fetch your actual Spotify profile data
  useEffect(() => {
    if (token) {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Spotify Data:", data); // Check your browser console to see the raw data!
          setUserProfile(data);
        })
        .catch((error) => console.error("Error fetching profile:", error));
    }
  }, [token]);

  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/auth/spotify";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-bold mb-4 text-center">
        Udini's Custom Player
      </h1>

      {token ? (
        <div className="text-center flex flex-col items-center mt-4">
          <p className="text-2xl text-rdr-highlight mb-8">
            You have successfully crossed the frontier.
          </p>

          {/* NEW: Render your Spotify Profile ID Card */}
          {userProfile ? (
            <div className="p-8 border-2 border-rdr-brown bg-[#1a1818]/80 rounded-sm flex flex-col items-center shadow-2xl max-w-sm w-full relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 w-full h-2 bg-rdr-red/50"></div>

              {userProfile.images && userProfile.images.length > 0 ? (
                <img
                  src={userProfile.images[0].url}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-rdr-highlight mb-4 shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-rdr-highlight mb-4 bg-rdr-brown flex items-center justify-center">
                  <span className="text-rdr-paper font-bold">No Image</span>
                </div>
              )}

              <h2 className="text-3xl font-bold text-rdr-paper mb-2">
                {userProfile.display_name}
              </h2>

              <div className="flex gap-4 mt-2">
                <div className="text-center">
                  <p className="text-rdr-highlight text-sm uppercase tracking-widest">
                    Followers
                  </p>
                  <p className="text-xl font-bold text-rdr-paper">
                    {userProfile.followers?.total}
                  </p>
                </div>
                <div className="text-center border-l border-rdr-brown pl-4">
                  <p className="text-rdr-highlight text-sm uppercase tracking-widest">
                    Plan
                  </p>
                  <p className="text-xl font-bold text-rdr-paper capitalize">
                    {userProfile.product}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-rdr-paper opacity-75 animate-pulse text-lg">
              Fetching your credentials from Spotify...
            </p>
          )}
        </div>
      ) : (
        <>
          <p className="text-xl text-rdr-highlight mb-8">
            Welcome to the frontier.
          </p>
          <button
            onClick={handleLogin}
            className="px-8 py-3 text-lg bg-rdr-red text-rdr-paper font-bold border-2 border-rdr-brown hover:bg-rdr-brown hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg"
          >
            Login with Spotify
          </button>
        </>
      )}
    </div>
  );
}

export default App;
