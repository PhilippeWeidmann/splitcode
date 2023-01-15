<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperQuestion
 */
class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'question'
    ];

    public function questionAttempts()
    {
        return $this->hasMany(QuestionAttempt::class);
    }

}
