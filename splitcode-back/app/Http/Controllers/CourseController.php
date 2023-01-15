<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $courses = Course::all();
        return response()->json($courses);
    }

    /**
     * Display the specified resource.
     *
     * @param Course $course
     * @return JsonResponse
     */
    public function show(Course $course, Request $request): JsonResponse
    {
        $validatedData = validator($request->query(), [
            'with' => ['string', 'in:exercises'],
        ])->validated();

        if ($validatedData && $validatedData['with'] === 'exercises') {
            $course->load('exercises');
        }

        return response()->json($course);
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'teacher_id' => ['required', 'integer'],
            'semester_id' => ['required', 'integer'],
            'ects' => ['required', 'integer']
        ]);

        $course = new Course();
        $course->name = $request->input('name');
        $course->description = $request->input('description');
        $course->teacher_id = $request->input('teacher_id');
        $course->semester_id = $request->input('semester_id');
        $course->ects = $request->input('ects');
        $course->save();
        return response()->json($course);
    }
}
