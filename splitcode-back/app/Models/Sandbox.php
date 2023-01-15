<?php

namespace App\Models;

use Database\Factories\SandboxFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperSandbox
 */
class Sandbox extends Model
{
    use HasFactory;

    protected static function newFactory(): SandboxFactory
    {
        return SandboxFactory::new();
    }

    public function attempt()
    {
        return $this->hasOne(Attempt::class);
    }

    public function groupAttemptFirstUser()
    {
        return $this->hasOne(GroupAttempt::class, 'first_user_sandbox_id');
    }

    public function groupAttemptSecondUser()
    {
        return $this->hasOne(GroupAttempt::class, 'second_user_sandbox_id');
    }

    public function groupAttemptSharedSandbox()
    {
        return $this->hasOne(GroupAttempt::class, 'shared_sandbox_id');
    }
}
