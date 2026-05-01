<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lab_technician_profiles', function (Blueprint $table) {
            $table->id();
            // Lab technician-only data linked to the user account.
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('department')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lab_technician_profiles');
    }
};
