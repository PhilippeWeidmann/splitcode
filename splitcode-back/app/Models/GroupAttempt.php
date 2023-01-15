<?php

namespace App\Models;

use Database\Factories\GroupAttemptFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperGroupAttempt
 */
class GroupAttempt extends Model
{
    use HasFactory;

    protected static function newFactory(): GroupAttemptFactory
    {
        return GroupAttemptFactory::new();
    }

    public function firstUser()
    {
        return $this->belongsTo(User::class);
    }

    public function secondUser()
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

    public function firstUserSandbox()
    {
        return $this->belongsTo(Sandbox::class);
    }

    public function secondUserSandbox()
    {
        return $this->belongsTo(Sandbox::class);
    }

    public function sharedSandbox()
    {
        return $this->belongsTo(Sandbox::class);
    }

    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class);
    }
}
