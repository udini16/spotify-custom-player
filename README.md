# 🎵 Udini Player 🤠

> A custom, full-stack Spotify dashboard built with a sleek, dark *Red Dead Redemption* inspired theme. 

Intern by day, music tech builder by night. I built Udini Player to combine my passion for music with a challenge to master full-stack architecture and complex third-party API integrations.

![Udini Player Demo](link-to-your-screenshot-or-gif-here.gif)

## ✨ Features

* **Secure OAuth Authentication:** Safe and seamless Spotify login using Laravel Socialite.
* **Full Collection Access:** Bypassed Spotify's nested API structures to cleanly extract and display entire saved playlists (even those with 60+ tracks).
* **Live "Now Playing" Visualizer:** A custom UI component that silently polls the Spotify API to display the currently playing track in real-time, complete with animated equalizer bars.
* **Custom RDR-Themed UI:** A beautifully dark, responsive frontend built entirely with Tailwind CSS.

## 🛠️ Tech Stack

**Frontend (The Muscle)**
* **React:** Component-based architecture for the UI (split into Collection, Tracklist, and NowPlaying modules).
* **Tailwind CSS:** For custom styling, animations, and the RDR aesthetic.

**Backend (The Brain)**
* **Laravel:** Handles secure routing, API token management, and OAuth.
* **Laravel Socialite:** For bulletproof Spotify authentication.
* **Spotify Web API:** The official developer endpoint for fetching profile data, playlists, tracks, and live playback states.

## 🧠 The Technical Challenge: Cracking the Vault

Building this was more than just fetching a URL. The official Spotify API has strict rate limits and complex data structures. 

* **The `403 Forbidden` Bouncer:** Direct calls to the `/tracks` endpoint often blocked third-party apps. I engineered a backdoor by fetching the *Full Playlist Object* and extracting the songs from within the parent payload.
* **The Disguised Data:** Depending on the account or playlist type, Spotify wraps track data differently (sometimes `data.tracks.items`, sometimes `data.items.items`). I built a dynamic extraction engine that safely drops missing/local files and maps the correct nested properties to the React UI without crashing.

## 🚀 Installation & Setup

*(If you want others to be able to run it, you can add brief instructions here, like:)*
1. Clone the repo.
2. Run `composer install` for the Laravel backend.
3. Run `npm install` for the React frontend.
4. Set up your Spotify Developer App and add your `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` to your `.env` file.
5. Boot up the servers: `php artisan serve` and `npm run dev`.

## 🚧 Roadmap (Next Up)
- [ ] Custom database logging to track my weekly listening history.
- [ ] Top tracks and artist analytics dashboard.
- [ ] Play/Pause/Skip controls directly from the web app.

---
*Built for fun, music, and learning.*
