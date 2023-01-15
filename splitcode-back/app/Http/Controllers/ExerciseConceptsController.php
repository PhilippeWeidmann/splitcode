<?php

namespace App\Http\Controllers;

use App\Models\ExerciseConcepts;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ExerciseConceptsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index($exercise_id)
    {
        $exerciseConcepts = ExerciseConcepts::where('exercise_id', $exercise_id)->get();
        return response()->json($exerciseConcepts);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'exercise_id' => ['required', 'integer', 'exists:exercises,id'],
            "concept" => ['required', 'string', 'max:255']
        ]);
        $exerciseConcepts = new ExerciseConcepts();
        $exerciseConcepts->exercise_id = $request->input('exercise_id');
        $exerciseConcepts->concept = $request->input('concept');
        $exerciseConcepts->save();
        return response()->json(['message' => 'ExerciseConcepts created']);
    }

    /**
     * Display the specified resource.
     *
     * @param ExerciseConcepts $exerciseConcepts
     * @return Response
     */
    public function show(ExerciseConcepts $exerciseConcepts)
    {
        //
    }

}
