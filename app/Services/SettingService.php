<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingService
{
    private const CACHE_KEY = 'edumanager.settings';

    public function all(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            try {
                if (! \Illuminate\Support\Facades\Schema::hasTable('settings')) {
                    return [];
                }

                return Setting::pluck('value', 'key')->all();
            } catch (\Throwable $e) {
                return [];
            }
        });
    }

    public function get(string $key, $default = null)
    {
        $value = $this->all()[$key] ?? null;

        return ($value === null || $value === '') ? $default : $value;
    }

    public function set(string $key, $value): void
    {
        Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget(self::CACHE_KEY);
    }

    public function setMany(array $values): void
    {
        foreach ($values as $key => $value) {
            if ($key === '_token' || $key === '_method') {
                continue;
            }
            $this->set($key, $value);
        }
        Cache::forget(self::CACHE_KEY);
    }
}
