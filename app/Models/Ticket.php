<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
