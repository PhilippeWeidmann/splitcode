<?php

namespace App\Models;

use Database\Factories\AttemptFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperAttempt
 */
class Attempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'exercise_id', 'answer', "completed_at", "time_spent_in_seconds"
    ];

    protected static function newFactory(): AttemptFactory
    {
        return AttemptFactory::new();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }

    public function attemptResult()
    {
        return $this->belongsTo(AttemptResult::class);
    }

    public function sandbox()
    {
        return $this->belongsTo(Sandbox::class);
    }
}
