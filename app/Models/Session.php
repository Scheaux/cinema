<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory;

    protected $fillable = [
        'hallId',
        'movieId',
        'date',
        'time'
    ];

    public static function makeNewSession($data)
    {
        $hall = Hall::where('id', $data['hallId'])->first();

        Session::create($data);

        Booking::create([
            'hallId' => $data['hallId'],
            'date' => $data['date'],
            'time' => $data['time'],
            'seats' => $hall['seats'],
        ]);
    }
}
