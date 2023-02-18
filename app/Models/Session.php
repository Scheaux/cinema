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

    public static function makeNewSession($request)
    {
        $request->validate([
            'hallId' => 'required',
            'movieId' => 'required',
            'date' => 'required',
            'time' => 'required'
        ]);

        $hall = Hall::where('id', $request['hallId'])->first();

        Session::create($request->all());

        Booking::create([
            'hallId' => $request['hallId'],
            'date' => $request['date'],
            'time' => $request['time'],
            'seats' => $hall['seats'],
        ]);
    }
}
