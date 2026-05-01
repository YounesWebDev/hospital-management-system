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
        Schema::table('users', function (Blueprint $table) {
            // Hospital account fields shared by all roles.
            $table->string('first_name')->nullable()->after('name');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('username')->nullable()->unique()->after('email');
            $table->string('role')->default('patient')->after('password');
            $table->string('phone')->nullable()->after('role');
            $table->string('status')->default('active')->after('phone');
            $table->string('preferred_language')->default('en')->after('status');
            $table->boolean('must_change_password')->default(false)->after('preferred_language');
            $table->foreignId('created_by')
                ->nullable()
                ->after('must_change_password')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn([
                'first_name',
                'last_name',
                'username',
                'role',
                'phone',
                'status',
                'preferred_language',
                'must_change_password',
                'created_by',
            ]);
        });
    }
};
