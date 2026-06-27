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
        Schema::table('system_settings', function (Blueprint $table) {
            $table->string('firebase_api_key')->nullable();
            $table->string('firebase_auth_domain')->nullable();
            $table->string('firebase_project_id')->nullable();
            $table->string('firebase_storage_bucket')->nullable();
            $table->string('firebase_messaging_sender_id')->nullable();
            $table->string('firebase_app_id')->nullable();
            $table->string('firebase_server_key')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('system_settings', function (Blueprint $table) {
            $table->dropColumn([
                'firebase_api_key',
                'firebase_auth_domain',
                'firebase_project_id',
                'firebase_storage_bucket',
                'firebase_messaging_sender_id',
                'firebase_app_id',
                'firebase_server_key'
            ]);
        });
    }
};
