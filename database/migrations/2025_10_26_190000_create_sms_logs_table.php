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
        Schema::create('sms_logs', function (Blueprint $table) {
            $table->id();
            $table->string('phone', 20);
            $table->string('ip_address', 45)->nullable();
            $table->string('purpose', 50)->default('otp');
            $table->string('provider', 50)->nullable();
            $table->string('status', 20);
            $table->text('message')->nullable();
            $table->string('message_hash', 64)->nullable();
            $table->string('provider_message_id', 100)->nullable();
            $table->string('error_code', 100)->nullable();
            $table->text('error_message')->nullable();
            $table->json('meta')->nullable();
            $table->timestamp('requested_at')->useCurrent();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->index(['phone', 'purpose']);
            $table->index(['purpose', 'status']);
            $table->index('requested_at');
            $table->index('sent_at');
            $table->index('ip_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sms_logs');
    }
};

