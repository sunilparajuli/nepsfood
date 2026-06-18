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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique();
            $table->boolean('can_view_dashboard')->default(true);
            $table->boolean('can_manage_templates')->default(false);
            $table->boolean('can_manage_forms')->default(false);
            $table->boolean('can_manage_users')->default(false);
            $table->boolean('can_manage_roles')->default(false);
            $table->boolean('can_manage_files')->default(false);
            $table->boolean('can_view_reports')->default(false);
            $table->boolean('is_admin_override')->default(false)->comment('If true, bypasses all permission checks');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
