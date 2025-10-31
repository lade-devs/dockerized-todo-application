<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\TodoResource;
use App\Services\TodoService;
use Illuminate\Http\JsonResponse;

class TodosController 
{
    public function __construct(private TodoService $todoService){}

    public function index(): JsonResponse
    {
        return ApiResponse::success($this->todoService->index());
    }

    public function store(): JsonResponse
    {
        return ApiResponse::success($this->todoService->store(request()->all()));
    }

    public function update(): JsonResponse
    {
        return ApiResponse::success($this->todoService->update(request()->all()));
    }

    public function show(string $uuid): JsonResponse
    {
        return ApiResponse::success(TodoResource::make($this->todoService->getModel($uuid)));
    }

    public function delete(string $uuid): JsonResponse
    {
        return ApiResponse::success($this->todoService->delete($uuid));
    }

    public function toggleCompleted(string $uuid): JsonResponse
    {
        return ApiResponse::success($this->todoService->toggleCompleted($uuid));
    }

    public function clearCompleted(): JsonResponse
    {
        return ApiResponse::success($this->todoService->clearCompleted());
    }

    public function reorderPosition(): JsonResponse
    {
        return ApiResponse::success($this->todoService->reorderPosition(request()->all()));
    }
}