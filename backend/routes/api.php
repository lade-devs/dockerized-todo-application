<?php

use App\Http\Controllers\TodosController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1/todo')->group(function(){
    Route::get('/', [TodosController::class, 'index']);
    Route::get('{uuid}', [TodosController::class, 'show']);
    Route::post('/', [TodosController::class, 'store']);
    Route::post('update', [TodosController::class, 'update']);
    Route::delete('{uuid}', [TodosController::class, 'delete']);
    Route::post('{uuid}/toggleCompleted', [TodosController::class, 'toggleCompleted']);
    Route::post('clearCompleted', [TodosController::class, 'clearCompleted']);
    Route::post('reorderPosition', [TodosController::class, 'reorderPosition']);
});
