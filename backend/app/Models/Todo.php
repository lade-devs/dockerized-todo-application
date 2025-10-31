<?php

namespace App\Models;

use App\Constants\TodoConstant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Todo extends Model
{
    /** @use HasFactory<\Database\Factories\TodoFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'title',
        'position',
        'description',
        'status',
        'started_at',
        'completed_at',
    ];

    public static function boot()
    {
        parent::boot();

        self::creating(function ($model) {
            $lastPosition = self::max('position');
            $model->uuid = str()->uuid();
            $model->status = TodoConstant::ACTIVE;
            $model->position = is_null($lastPosition) ? 1 : $lastPosition + 1;
            $model->started_at = now();
        });
    }
}
