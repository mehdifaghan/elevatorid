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
        Schema::table('part_transfers', function (Blueprint $table) {
            $table->enum('direction', ['incoming', 'outgoing'])->default('outgoing')->after('buyer_company_id');
            $table->string('other_company_name')->nullable()->after('direction');
            $table->text('reason')->nullable()->after('other_company_name');
            $table->text('notes')->nullable()->after('reason');
            $table->timestamp('transfer_date')->nullable()->after('notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('part_transfers', function (Blueprint $table) {
            $table->dropColumn(['direction', 'other_company_name', 'reason', 'notes', 'transfer_date']);
        });
    }
};
