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
use App\Models\Ticket;
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
    $date = $request->query('date');
    $session = Session::where(['time' => $time, 'date' => $date])->first();
    return $session;
});

Route::get('/get-booking', function(Request $request) {
    $id = $request->query('hallId');
    $time = $request->query('time');
    $date = $request->query('date');
    $booking = Booking::where(['hallId' => $id, 'time' => $time, 'date' => $date])->first();
    return $booking;
});

Route::post('/create-ticket', function(Request $request) {
    $request->validate([
        'hallId' => 'required',
        'movieId' => 'required',
        'time' => 'required',
        'date' => 'required',
        'seats' => 'required',
    ]);

    $hall = Hall::where('id', $request['hallId'])->first();
    $booking = Booking::where(['hallId' => $request['hallId'], 'time' => $request['time'], 'date' => $request['date']])->first();
    if (!$booking || !$hall) {
        return response('Hall or booking does not exist', 404);
    }
    $seats = $booking['seats'];

    $totalPrice = 0;

    for ($idx = 0; $idx < count($request['seats']); $idx++) {
        for ($i = 0; $i < count($seats); $i++) {
            for ($x = 0; $x < count($seats[$i]); $x++) {
                if ($i === $request['seats'][$idx]['col'] && $x === $request['seats'][$idx]['row']) {
                    if ($seats[$i][$x] === 1) {
                        $totalPrice += $hall['standardPrice'];
                    } elseif ($seats[$i][$x] === 2) {
                        $totalPrice += $hall['vipPrice'];
                    }
                    $seats[$i][$x] = 3;
                }
            }
        }
    }

    $uid = Str::random(60);

    ob_start();
    QRcode::png($uid);
    $imageString = base64_encode(ob_get_contents());
    ob_end_clean();

    $ticket = Ticket::create([
        'uid' => $uid,
        'hallId' => $request['hallId'],
        'movieId' => $request['movieId'],
        'totalPrice' => $totalPrice,
        'time' => $request['time'],
        'date' => $request['date'],
        'seats' => $request['seats'],
        'qr' => $imageString,
    ]);

    $booking->update(['seats' => $seats]);

    return ['ticketId' => $ticket['uid']];
});

Route::get('/booking/{id}', function(Request $request, $id) {
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
