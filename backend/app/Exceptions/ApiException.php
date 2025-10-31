<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use App\Helpers\ApiResponse;

class ApiException extends Exception
{
    public function report(): ?bool
    {
        return false;
    }

    public function render(): JsonResponse
    {
        return ApiResponse::failed($this->getMessage());
    }
}
