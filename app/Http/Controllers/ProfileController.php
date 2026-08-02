<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Update the user's profile photo.
     */
    public function updatePhoto(Request $request): RedirectResponse
    {
        try {
            $request->validate([
                'photo' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            ]);

            $user = $request->user();

            if ($user->photo_profil) {
                Storage::disk('public')->delete($user->photo_profil);
            }

            $path = $request->file('photo')->store('avatars', 'public');

            $user->update(['photo_profil' => $path]);

            return Redirect::route('profile.edit')->with('success', 'Photo de profil mise à jour.');
        } catch (\Exception $e) {
            return Redirect::route('profile.edit')->with('error', 'Erreur lors du téléchargement de la photo.');
        }
    }

    /**
     * Delete the user's profile photo.
     */
    public function deletePhoto(Request $request): RedirectResponse
    {
        try {
            $user = $request->user();

            if ($user->photo_profil) {
                Storage::disk('public')->delete($user->photo_profil);
                $user->update(['photo_profil' => null]);
            }

            return Redirect::route('profile.edit')->with('success', 'Photo de profil supprimée.');
        } catch (\Exception $e) {
            return Redirect::route('profile.edit')->with('error', 'Erreur lors de la suppression de la photo.');
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
