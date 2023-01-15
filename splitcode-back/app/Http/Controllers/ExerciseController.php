<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ExerciseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $exercises = Exercise::all();
        return response()->json($exercises);
    }

    public function getAllSandboxesSingleAttempts(Exercise $exercise): JsonResponse
    {
        $attempts = $exercise->attempts()->with('sandbox')->get();
        $sandboxes = $attempts->map(function ($attempt) {
            return $attempt->sandbox;
        });
        return response()->json($sandboxes);
    }

    public function getAllSandboxesGroupAttempts(Exercise $exercise): JsonResponse
    {
        $attempts = $exercise->groupAttempts()->with('sharedSandbox')->get();
        $sandboxes = $attempts->map(function ($attempt) {
            return $attempt->sharedSandbox;
        });
        return response()->json($sandboxes);
    }

    /**
     * Display the specified resource.
     *
     * @param Exercise $exercise
     * @return JsonResponse
     */
    public function show(Exercise $exercise): JsonResponse
    {
        return response()->json($exercise);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'start_time' => ['required', 'date'],
            'solo_end_time' => ['required', 'date'],
            'end_time' => ['required', 'date'],
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'notation' => ['required', 'integer'],
            "starting_code" => ["nullable", "string"]
        ]);

        $exercise = new Exercise();
        $exercise->title = $request->input('title');
        $exercise->description = $request->input('description');
        $exercise->start_time = $request->input('start_time');
        $exercise->solo_end_time = $request->input('solo_end_time');
        $exercise->end_time = $request->input('end_time');
        $exercise->course_id = $request->input('course_id');
        $exercise->notation = $request->input('notation');
        $exercise->starting_code = $request->input("starting_code", "");
        $exercise->save();
        return response()->json($exercise);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Exercise $exercise
     * @return Response
     */
    public function update(Request $request, Exercise $exercise)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Exercise $exercise
     * @return Response
     */
    public function destroy(Exercise $exercise)
    {
        //
    }
}
