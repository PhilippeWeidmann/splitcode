<?php

namespace App\Models;

use Database\Factories\AttemptResultFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperAttemptResult
 */
class AttemptResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'type', 'result'
    ];

    protected static function newFactory(): AttemptResultFactory
    {
        return new AttemptResultFactory();
    }

    public function attempt()
    {
        return $this->hasOne(Attempt::class);
    }
}
