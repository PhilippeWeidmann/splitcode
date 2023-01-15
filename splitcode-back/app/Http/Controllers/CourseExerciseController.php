<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseExerciseController extends Controller
{
    public function index($course_id): JsonResponse
    {
        $exercises = Course::find($course_id)->exercises;
        return response()->json($exercises);
    }

    public function store(Request $request, $course_id): JsonResponse
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'result' => ['required', 'string', 'max:100'],
            'start_time' => ['required', 'date'],
            'solo_end_time' => ['required', 'date'],
            'end_time' => ['required', 'date'],
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'notation' => ['required', 'integer']
        ]);

        $course = Course::find($course_id);
        $course->exercises()->create($request->all());
        return response()->json(['message' => 'Exercise created']);
    }

}
