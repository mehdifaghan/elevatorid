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
        Schema::create('elevators', function (Blueprint $table) {
            $table->id();
            $table->string('elevator_uid')->unique();
            $table->string('municipality_zone')->nullable();
            $table->string('build_permit_no')->nullable();
            $table->string('registry_plate')->nullable();
            $table->string('province')->nullable();
            $table->string('city')->nullable();
            $table->string('address')->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->foreignId('installer_company_id')->nullable()->constrained('companies')->nullOnDelete();
            $table->enum('status', ['active', 'maintenance', 'out_of_order', 'suspended'])->default('active');
            $table->timestamp('last_inspection_at')->nullable();
            $table->timestamp('next_inspection_due_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('elevators');
    }
};
