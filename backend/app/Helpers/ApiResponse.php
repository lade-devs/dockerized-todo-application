<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    const VALIDATION_ERROR = '422';

    const SUCCESS = '200';

    const FAILED = '400';

    const NOT_FOUND = '302';

    private static function returnResponse(string $status, string $message, $data = [], $statusCode = 200): JsonResponse
    {
        $response = [
            'status' => $status,
            'data' => $data,
            'message' => $message,
        ];

        if ($statusCode !== 200) {
            $response = [
                'status' => $status,
                'errors' => $data,
                'message' => $message,
            ];
        }

        return response()->json($response, $statusCode);
    }

    public static function validationError(array $data, string $message = 'Validation error'): JsonResponse
    {
        return self::returnResponse(status: self::VALIDATION_ERROR, message: $message, data: $data, statusCode: 422);
    }

    public static function success($data = [], string $message = 'Request processed successfully'): JsonResponse
    {
        return self::returnResponse(self::SUCCESS, $message, $data ?? []);
    }

    public static function failed(string $message = 'Failed to process request', array $data = []): JsonResponse
    {
        return self::returnResponse(self::FAILED, $message, $data ?? [], 400);
    }

    public static function notFound(string $message = 'Does not exists', ?array $data = null): JsonResponse
    {
        return self::returnResponse(status: self::NOT_FOUND, message: $message, data: $data ?? null, statusCode: 404);
    }
}
