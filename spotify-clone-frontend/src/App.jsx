function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-bold mb-4">Udini's Custom Player</h1>
      <p className="text-xl text-rdr-highlight mb-8">
        Welcome to the frontier.
      </p>

      <button className="px-6 py-2 bg-rdr-red text-rdr-paper font-bold border-2 border-rdr-brown hover:bg-rdr-brown transition duration-300">
        Login with Spotify
      </button>
    </div>
  );
}

export default App;
