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

    public static function makeNewTicket($data)
    {
        $hall = Hall::where('id', $data['hallId'])->first();
        $booking = Booking::where(['hallId' => $data['hallId'], 'time' => $data['time'], 'date' => $data['date']])->first();
        if (!$booking || !$hall) {
            return response('Hall or booking does not exist', 404);
        }
        $seats = $booking['seats'];

        $totalPrice = 0;

        for ($idx = 0; $idx < count($data['seats']); $idx++) {
            for ($i = 0; $i < count($seats); $i++) {
                for ($x = 0; $x < count($seats[$i]); $x++) {
                    if ($i === $data['seats'][$idx]['col'] && $x === $data['seats'][$idx]['row']) {
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
            'hallId' => $data['hallId'],
            'movieId' => $data['movieId'],
            'totalPrice' => $totalPrice,
            'time' => $data['time'],
            'date' => $data['date'],
            'seats' => $data['seats'],
            'qr' => $imageString,
        ]);

        $booking->update(['seats' => $seats]);

        return $ticket;
    }
}
