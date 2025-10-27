<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('sms_provider')->default('mock');
            $table->json('sms_config')->nullable();
            $table->string('payment_provider')->default('mock');
            $table->json('payment_config')->nullable();
            $table->boolean('system_maintenance')->default(false);
            $table->boolean('registration_enabled')->default(true);
            $table->timestamps();
        });

        DB::table('system_settings')->insert([
            'sms_provider' => 'mock',
            'sms_config' => json_encode(['sender' => 'sandbox']),
            'payment_provider' => 'mock',
            'payment_config' => json_encode(['callback_url' => null]),
            'system_maintenance' => false,
            'registration_enabled' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
