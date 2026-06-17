export default function Tracklist({
  selectedPlaylist,
  tracks,
  isLoading,
  closePlaylist,
  playlistError,
}) {
  return (
    <div className="w-full animate-fade-in">
      <button
        onClick={closePlaylist}
        className="mb-10 px-6 py-2.5 rounded-full bg-[#1a1717] text-rdr-paper border border-[#2a201a] hover:border-rdr-red hover:bg-[#201c1c] transition-all duration-300 font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg cursor-pointer"
      >
        <span>←</span> Back to Collection
      </button>

      <div className="flex items-end gap-6 mb-12 border-b border-[#2a201a] pb-8">
        <h3 className="text-5xl font-bold text-rdr-paper tracking-tight">
          {selectedPlaylist}
        </h3>
      </div>

      <div className="flex flex-col bg-[#141212] rounded-xl border border-[#2a201a] overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="p-8 text-center text-rdr-highlight">
            <p className="text-xl font-bold animate-pulse">
              Cracking the vault...
            </p>
          </div>
        ) : playlistError === 403 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <span className="text-5xl mb-6 grayscale opacity-70">🔒</span>
            <p className="text-2xl font-bold text-rdr-red uppercase tracking-widest">
              Vault Locked By Spotify
            </p>
            <p className="text-sm mt-4 text-rdr-highlight max-w-md leading-relaxed">
              Spotify's API policy blocks third-party apps from reading
              playlists created by other users. Because you do not own this
              playlist, the API refuses to hand over the tracks.
            </p>
          </div>
        ) : tracks.length === 0 ? (
          <div className="p-8 text-center text-rdr-highlight">
            <p className="text-xl font-bold">This vault appears to be empty.</p>
            <p className="text-sm mt-2 opacity-70">
              No compatible tracks were found in this playlist.
            </p>
          </div>
        ) : (
          tracks.map((listItem, index) => {
            const track = listItem?.track || listItem?.item || listItem;
            if (!track || !track.id) return null;

            const trackName = track.name || "Unknown Track";
            const artistsArray = track.artists || [];
            const artistName =
              artistsArray.map((a) => a.name).join(", ") || "Unknown Artist";
            const albumObj = track.album;
            const albumName = albumObj?.name || "Unknown Album";
            const albumImage = albumObj?.images?.[0]?.url;

            return (
              <div
                key={track.id || index}
                className="flex items-center justify-between p-4 px-6 border-b border-[#1f1a1a] last:border-0 hover:bg-[#1f1a1a] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <span className="text-rdr-highlight/50 font-medium w-8 text-right group-hover:text-rdr-red transition-colors">
                    {index + 1}
                  </span>

                  {albumImage ? (
                    <img
                      src={albumImage}
                      className="w-14 h-14 object-cover rounded-md shadow-md grayscale group-hover:grayscale-0 transition-all duration-500"
                      alt="album cover"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-[#1a1717] rounded-md border border-[#2a201a] flex items-center justify-center overflow-hidden">
                      <span className="text-[10px] text-rdr-paper/30 text-center leading-tight px-1">
                        No Cover
                      </span>
                    </div>
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
