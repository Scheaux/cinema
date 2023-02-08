<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hall extends Model
{
    use HasFactory;

    protected $fillable = [
        'is_active',
        'name',
        'size',
        'seats',
        'standardPrice',
        'vipPrice'
    ];

    protected $casts = [
        'size' => 'object',
        'seats' => 'array',
    ];
}
