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
            $table->foreignId('payer_profile_id')->constrained('profiles')->cascadeOnDelete();
            $table->unsignedBigInteger('amount');
            $table->string('currency', 10)->default('IRR');
            $table->string('description')->nullable();
            $table->string('gateway', 50)->default('mock');
            $table->string('ref_num')->nullable();
            $table->enum('status', ['initiated', 'success', 'failed', 'canceled'])->default('initiated');
            $table->json('meta')->nullable();
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
