<?php

namespace App\Models;

use Database\Factories\CourseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperCourse
 */
class Course extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', "teacher_id", 'semester_id', 'ects'];

    protected static function newFactory(): CourseFactory
    {
        return CourseFactory::new();
    }

    public function exercises()
    {
        return $this->hasMany(Exercise::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function teacher()
    {
        //TODO: test if this works
        return $this->belongsTo(User::class, 'id', 'teacher_id');
    }
}
