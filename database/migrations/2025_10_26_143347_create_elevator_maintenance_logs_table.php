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
        Schema::create('elevator_maintenance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('elevator_id')->constrained('elevators')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type');
            $table->text('description')->nullable();
            $table->decimal('cost', 12, 2)->nullable();
            $table->string('performed_by')->nullable();
            $table->timestamp('performed_at')->nullable();
            $table->timestamps();
            $table->index(['elevator_id', 'performed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('elevator_maintenance_logs');
    }
};
