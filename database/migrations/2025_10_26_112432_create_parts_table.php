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
        Schema::create('parts', function (Blueprint $table) {
            $table->id();
            $table->string('part_uid')->unique();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('title');
            $table->string('barcode')->nullable();
            $table->string('manufacturer_country')->nullable();
            $table->string('origin_country')->nullable();
            $table->foreignId('registrant_company_id')->nullable()->constrained('companies')->nullOnDelete();
            $table->enum('current_owner_type', ['company', 'elevator'])->default('company');
            $table->foreignId('current_owner_company_id')->nullable()->constrained('companies')->nullOnDelete();
            $table->unsignedBigInteger('current_owner_elevator_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parts');
    }
};
