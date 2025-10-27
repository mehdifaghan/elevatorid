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
        Schema::table('profile_requests', function (Blueprint $table) {
            $table->json('meta')->nullable()->after('note');
        });

        Schema::table('complaints', function (Blueprint $table) {
            $table->json('meta')->nullable()->after('admin_notes');
        });

        Schema::table('elevators', function (Blueprint $table) {
            $table->json('meta')->nullable()->after('next_inspection_due_at');
        });

        Schema::table('elevator_part', function (Blueprint $table) {
            $table->json('meta')->nullable()->after('removed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profile_requests', function (Blueprint $table) {
            $table->dropColumn('meta');
        });

        Schema::table('complaints', function (Blueprint $table) {
            $table->dropColumn('meta');
        });

        Schema::table('elevators', function (Blueprint $table) {
            $table->dropColumn('meta');
        });

        Schema::table('elevator_part', function (Blueprint $table) {
            $table->dropColumn('meta');
        });
    }
};
