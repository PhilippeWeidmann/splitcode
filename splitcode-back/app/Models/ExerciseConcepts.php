<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperExerciseConcepts
 */
class ExerciseConcepts extends Model
{
    use HasFactory;

    protected $fillable = [
        'concept', 'exercise_id'
    ];

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}
