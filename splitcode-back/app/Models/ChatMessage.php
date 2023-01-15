<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperChatMessage
 */
class ChatMessage extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function groupAttempt()
    {
        return $this->belongsTo(GroupAttempt::class);
    }
}
