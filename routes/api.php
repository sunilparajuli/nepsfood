<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\FormTemplateController;
use App\Http\Controllers\FormSubmissionController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\SharedFileController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\JwtMiddleware;

// Auth Routes
Route::post('/token', [AuthController::class, 'login']);
Route::post('/token/refresh', [AuthController::class, 'refresh']);

Route::middleware([JwtMiddleware::class])->group(function () {
    // Current User
    Route::get('/forms/users/me', [UserController::class, 'current_user']);
    Route::put('/forms/users/me', [UserController::class, 'current_user_update']);
    Route::patch('/forms/users/me', [UserController::class, 'current_user_update']);
    
    // Forms API
    Route::apiResource('/forms/roles', RoleController::class);
    Route::apiResource('/forms/templates', FormTemplateController::class);
    Route::apiResource('/forms/submissions', FormSubmissionController::class);
    Route::apiResource('/forms/users', UserController::class);
    Route::apiResource('/forms/folders', FolderController::class);
    Route::apiResource('/forms/files', SharedFileController::class);
    
    Route::get('/forms/submissions/{submission}/export_pdf', [FormSubmissionController::class, 'export_pdf']);
});
