<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Keep the main seeder small and call the project demo data seeder.
        $this->call(DemoUserSeeder::class);
    }
}
