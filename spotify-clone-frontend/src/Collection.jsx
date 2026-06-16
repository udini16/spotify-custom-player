export default function Collection({ playlists, openPlaylist }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-10">
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
            // THE FIX: Just pass the ID and Name! App.jsx will handle the URL now.
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
                {playlist.tracks?.total ?? playlist.items?.total ?? 0} Tracks
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
