<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class SpotifyAuthController extends Controller
{
    /**
     * Redirect the user to the Spotify Authentication Page.
     */
    /**
     * Redirect the user to the Spotify Authentication Page.
     */
    public function redirect()
    {
        return Socialite::driver('spotify')
            ->scopes([
                'streaming', 
                'user-read-email', 
                'user-read-private', 
                'user-modify-playback-state',
                'playlist-read-private',
                'playlist-read-collaborative',
                'user-read-currently-playing',
                'user-top-read',
                'user-read-recently-played',
            ])
            ->with(['show_dialog' => 'true'])
            ->redirect();
    }

    /**
     * Catch the user when they return from Spotify.
     */
    public function callback()
    {
        try {
            $spotifyUser = Socialite::driver('spotify')->user();
            
            // Check if this user already exists in your database by their Spotify ID
            $user = User::updateOrCreate([
                'email' => $spotifyUser->getEmail(),
            ], [
                'name' => $spotifyUser->getName() ?? $spotifyUser->getNickname(),
                // We'll temporarily use a random password since they log in via Spotify
                'password' => bcrypt(str()->random(24)), 
            ]);

            // Log the user into your Laravel app session
            Auth::login($user);

            // Store the golden Spotify access token inside the session so your React frontend can grab it later
            session(['spotify_token' => $spotifyUser->token]);

            // Redirect to a placeholder dashboard page (we will build this UI next)
            // Grab the token from the Spotify user object
        $token = $spotifyUser->token;

        // Redirect back to our React frontend and attach the token to the URL!
        // Redirect back to our React frontend and attach the token to the URL!
        return redirect('https://spotify-custom-player-blond.vercel.app/?token=' . $token);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Authentication failed: ' . $e->getMessage()], 500);
        }
    }
}