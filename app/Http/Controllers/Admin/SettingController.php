<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Show system settings.
     */
    public function index()
    {
        // Load all saved key/value settings for the admin settings screen.
        return $this->hospitalPage('admin/settings/index', 'System Settings', SystemSetting::query()->get(), [
            'store' => route('admin.settings.store'),
        ]);
    }

    /**
     * Store or update a setting.
     */
    public function store(Request $request)
    {
        // Validate the setting before writing it to the database.
        $data = $request->validate([
            'setting_key' => ['required', 'string', 'max:191'],
            'setting_value' => ['nullable', 'string'],
        ]);

        // Update the existing setting when the key already exists, otherwise create it.
        $setting = SystemSetting::query()->updateOrCreate(
            ['setting_key' => $data['setting_key']],
            ['setting_value' => $data['setting_value'] ?? null],
        );

        // Keep a simple audit trail of configuration changes.
        $this->audit('updated_setting', 'system_settings', $setting->id, $setting->setting_key);

        return response()->noContent();
    }
}
