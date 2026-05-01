<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request)
    {
        // Tell the page whether the user still needs email verification and pass along flash status.
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        // Fill the user model with already-validated input from the form request.
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            // Reset email verification when the email address changes.
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        // Flash a success message for the Inertia settings page.
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        // Log the user out before deleting the account.
        Auth::logout();

        $user->delete();

        // Clear the old session after account deletion.
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
