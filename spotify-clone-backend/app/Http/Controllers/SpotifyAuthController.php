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
    public function redirect()
    {
        // We request specific scopes so we can stream music later using the Web Playback SDK
        return Socialite::driver('spotify')
            ->scopes(['streaming', 'user-read-email', 'user-read-private', 'user-modify-playback-state'])
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
            return response()->json([
                'message' => 'Successfully logged in with Spotify!',
                'user' => $user,
                'token' => session('spotify_token')
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Authentication failed: ' . $e->getMessage()], 500);
        }
    }
}