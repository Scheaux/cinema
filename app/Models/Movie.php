<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'country',
        'duration',
        'poster',
    ];

    public static function makeNewMovie($data)
    {
        Movie::create($data);
    }
}
