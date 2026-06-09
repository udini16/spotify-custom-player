<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SpotifyAuthController;
Route::get('/', function () {
    return view('welcome');
});
// The link the user clicks to log in
Route::get('/auth/spotify', [SpotifyAuthController::class, 'redirect']);

// The callback URL that catches the user back from Spotify
Route::get('/auth/spotify/callback', [SpotifyAuthController::class, 'callback']);