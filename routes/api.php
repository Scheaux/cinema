<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\HallController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\SessionController;
use App\Models\Booking;
use App\Models\Hall;
use App\Models\Movie;
use App\Models\Session;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/get-all', function () {
    if (Hall::all()->contains('is_active', false)) {
        return response('No active halls', 404);
    }

    return [
        'movies' => Movie::all(),
        'halls' => Hall::all(),
        'sessions' => Session::all(),
    ];
});

Route::get('/hall-by-id', function (Request $request) {
    $id = $request->query('id');
    $hall = Hall::where('id', $id)->first();
    return $hall;
});

Route::get('/movie-by-id', function (Request $request) {
    $id = $request->query('id');
    $movie = Movie::where('id', $id)->first();
    return $movie;
});

Route::get('/session-by-time', function (Request $request) {
    $time = $request->query('time');
    $date = $request->query('date');
    $session = Session::where(['time' => $time, 'date' => $date])->first();
    return $session;
});

Route::get('/get-booking', function (Request $request) {
    $id = $request->query('hallId');
    $time = $request->query('time');
    $date = $request->query('date');
    $booking = Booking::where(['hallId' => $id, 'time' => $time, 'date' => $date])->first();
    return $booking;
});

Route::post('/create-ticket', function (Request $request) {
    $ticket = Ticket::makeNewTicket($request);
    return ['ticketId' => $ticket['uid']];
});

Route::get('/booking/{id}', function ($id) {
    $ticket = Ticket::where('uid', $id)->first();
    return $ticket;
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
