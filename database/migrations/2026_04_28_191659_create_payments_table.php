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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            // Accountants record payments against billing records.
            $table->foreignId('billing_record_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained('patient_profiles')->cascadeOnDelete();
            $table->foreignId('accountant_id')->constrained('staff_profiles')->cascadeOnDelete();
            $table->decimal('amount_paid', 10, 2);
            $table->string('payment_method')->default('cash');
            $table->string('receipt_number')->unique();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
