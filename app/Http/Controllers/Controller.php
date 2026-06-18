<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *      version="1.0.0",
 *      title="Nepsfood API",
 *      description="API Documentation for Nepsfood Application",
 * )
 *
 * @OA\Server(
 *      url="http://nepsfood.nepstrading.com.au",
 *      description="Production API Server"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
abstract class Controller
{
    //
}
