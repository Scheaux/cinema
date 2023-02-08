<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\HallController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\SessionController;
use Illuminate\Support\Str;
use App\Models\Booking;
use App\Models\Hall;
use App\Models\Movie;
use App\Models\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/get-all', function() {

    if (Hall::all()->contains('is_active', false)) {
        return response('No active halls', 404);
    }

    return [
        'movies' => Movie::all(),
        'halls' => Hall::all(),
        'sessions' => Session::all(),
    ];
});

Route::get('/hall-by-id', function(Request $request) {
    $id = $request->query('id');
    $hall = Hall::where('id', $id)->first();
    return $hall;
});

Route::get('/movie-by-id', function(Request $request) {
    $id = $request->query('id');
    $movie = Movie::where('id', $id)->first();
    return $movie;
});

Route::get('/session-by-time', function(Request $request) {
    $time = $request->query('time');
    $session = Session::where('time', $time)->first();
    return $session;
});

Route::get('/booking-by-hallId', function(Request $request) {
    $id = $request->query('hallId');
    $booking = Booking::where('hallId', $id)->first();
    return $booking;
});

Route::post('/create-ticket', function(Request $request) {
    $request->validate([
        'hallId' => 'required',
        'seats' => 'required',
    ]);

    $booking = Booking::where('hallId', $request['hallId'])->first();
    if (!$booking) {
        return response('did not fing booking', 404);
    }
    $seats = $booking['seats'];

    for ($idx = 0; $idx < count($request['seats']); $idx++) {
        for ($i = 0; $i < count($seats); $i++) {
            for ($x = 0; $x < count($seats[$i]); $x++) {
                if ($i === $request['seats'][$idx]['col'] && $x === $request['seats'][$idx]['row']) {
                    $seats[$i][$x] = 3;
                }
            }
        }
    }

    // $booking->update(['seats' => $seats]);


    // return Str::random(60);
    ob_start();
    QRcode::png('text', null);
    $imageString = base64_encode( ob_get_contents() );
    ob_end_clean();
    return $imageString;
});

Route::apiResource('/bookings', BookingController::class);

// Protected routes
Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('/halls', HallController::class);
    Route::get('/activate-halls', [HallController::class, 'activateHalls']);
    Route::get('/deactivate-halls', [HallController::class, 'deactivateHalls']);
    Route::apiResource('/movies', MovieController::class);
    Route::apiResource('/sessions', SessionController::class);
});
