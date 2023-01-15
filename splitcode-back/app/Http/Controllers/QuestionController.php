<?php

namespace App\Http\Controllers;

use App\Models\Question;

class QuestionController extends Controller
{
    public function index()
    {
        $questions = Question::all();
        return response()->json($questions);
    }

}
