<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use QRcode;
use Illuminate\Support\Str;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'uid',
        'hallId',
        'movieId',
        'time',
        'date',
        'totalPrice',
        'seats',
        'qr',
    ];

    protected $casts = [
        'seats' => 'array',
    ];

    public static function makeNewTicket($request)
    {
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

        return $ticket;
    }
}
