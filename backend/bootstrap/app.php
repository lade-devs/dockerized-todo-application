<?php

use App\Helpers\ApiResponse;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ValidationException $e, Request $request) {
            return ApiResponse::validationError($e->errors());
        });

        $exceptions->render(function (HttpException $e, Request $request) {
            return ApiResponse::notFound();
        });

        $exceptions->render(function (Throwable $e, Request $request) {
            return ApiResponse::failed($e->getMessage(), [
                'trace' => $e->getTrace(),
                'code' => $e->getCode(),
                'file' => $e->getFile(),
            ]);
        });
    })->create();
