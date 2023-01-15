<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use Illuminate\Http\JsonResponse;

class TeacherExercise extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param Exercise $exercise
     * @return JsonResponse
     */
    public function show(Exercise $exercise): JsonResponse
    {
        $exercise->load([
            "attempts",
            "attempts.attemptResult",
            "attempts.user",
            "groupAttempts",
            "groupAttempts.attemptResult",
            "groupAttempts.firstUser",
            "groupAttempts.secondUser",
            "course"
        ]);
        return response()->json($exercise);

    }
}
