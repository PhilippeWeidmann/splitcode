<?php

namespace App\Models;

use Database\Factories\ExerciseFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperExercise
 */
class Exercise extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'start_time', 'end_time', 'course_id', 'notation', "starting_code"
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'solo_end_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    /**
     * Create a new factory instance for the model.
     *
     * @return Factory
     */
    protected static function newFactory()
    {
        return ExerciseFactory::new();
    }

    public function attempts()
    {
        return $this->hasMany(Attempt::class);
    }

    public function groupAttempts()
    {
        return $this->hasMany(GroupAttempt::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function concepts()
    {
        return $this->hasMany(ExerciseConcepts::class);
    }
}
