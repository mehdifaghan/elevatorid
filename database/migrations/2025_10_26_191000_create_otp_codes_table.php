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
        Schema::create('otp_codes', function (Blueprint $table) {
            $table->id();
            $table->string('phone', 20)->unique();
            $table->string('code_hash', 64);
            $table->unsignedTinyInteger('attempts_remaining')->default(0);
            $table->timestamp('expires_at');
            $table->timestamp('last_attempt_at')->nullable();
            $table->timestamp('last_sent_at')->useCurrent();
            $table->foreignId('sms_log_id')->nullable()->constrained('sms_logs')->nullOnDelete();
            $table->timestamps();

            $table->index('expires_at');
            $table->index('last_sent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('otp_codes');
    }
};

