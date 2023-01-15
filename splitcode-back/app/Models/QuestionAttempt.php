<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperQuestionAttempt
 */
class QuestionAttempt extends Model
{
    use HasFactory;

    protected $table = 'question_attempt';

    protected $fillable = [
        'question_id', 'attempt_id', 'user_id', 'answer'
    ];

    public function question()
    {
        return $this->hasOne(Question::class);
    }


    public function attempt()
    {
        return $this->belongsTo(GroupAttempt::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
