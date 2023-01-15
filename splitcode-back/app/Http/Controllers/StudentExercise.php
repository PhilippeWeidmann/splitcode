<?php

namespace App\Http\Controllers;

use App\Models\Attempt;
use App\Models\Course;
use App\Models\Exercise;
use App\Models\GroupAttempt;
use App\Models\QuestionAttempt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentExercise extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param Course $course
     * @param Exercise $exercise
     * @param Request $request
     * @return JsonResponse
     */
    public function show(Course $course, Exercise $exercise, Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $attempt = Attempt::where('user_id', $userId)
            ->where('exercise_id', $exercise->id)
            ->first();
        $exercise->attempt = $attempt;
        $groupAttempt = GroupAttempt::with(['firstUser', 'secondUser'])
            ->where("exercise_id", "=", $exercise->id)
            ->where(function ($query) use ($userId) {
                $query->where('first_user_id', '=', $userId)
                    ->orWhere('second_user_id', '=', $userId);
            })->first();
        $exercise->groupAttempt = $groupAttempt;

        $answeredQuestions = false;
        if ($groupAttempt) {
            $answeredQuestions = QuestionAttempt::where('user_id', $userId)
                    ->where('exercise_id', $exercise->id)
                    ->count() > 0;

            // Maybe the user there is not other group for the user
            if (!$answeredQuestions) {
                $groupAttempt = GroupAttempt::where("exercise_id", "=", $exercise->id)
                    ->where('completed_at', '<>', null)
                    ->where('first_user_id', '!=', $userId)
                    ->where(function ($query) use ($userId) {
                        $query->where('second_user_id', '!=', $userId)
                            ->orWhereNull('second_user_id');
                    })
                    ->orderBy('completed_at', 'desc')
                    ->get()
                    ->first();
                if (!$groupAttempt) {
                    $answeredQuestions = true;
                }
            }
        }
        $exercise->answeredQuestions = $answeredQuestions;

        return response()->json($exercise);
    }

}
