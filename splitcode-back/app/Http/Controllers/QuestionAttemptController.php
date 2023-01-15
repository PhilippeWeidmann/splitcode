<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\QuestionAttempt;
use App\Models\User;
use Illuminate\Http\Request;

class QuestionAttemptController extends Controller
{
    public function store(Exercise $exercise, Request $request)
    {
        $validated = $request->validate([
            'question_id' => ['required', 'integer', 'exists:questions,id'],
            'attempt_id' => ['required', 'integer', 'exists:group_attempts,id'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'answer' => ['required', 'integer'],
        ]);

        $questionAttempt = new QuestionAttempt();
        $questionAttempt->question_id = $validated['question_id'];
        $questionAttempt->attempt_id = $validated['attempt_id'];
        $questionAttempt->user_id = $validated['user_id'];
        $questionAttempt->answer = $validated['answer'];
        $questionAttempt->exercise_id = $exercise->id;
        $questionAttempt->save();

        return response()->json($questionAttempt);
    }

    public function index(User $user)
    {
        $questionResults = QuestionAttempt::where('user_id', $user->id)->load('question')->get();
        return response()->json($questionResults);
    }
}
