<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserCourses extends Controller
{
    /**
     * List all the courses owned by a teacher
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function indexTeacher(Request $request): JsonResponse
    {
        $user = $request->user();
        $courses = $user->load('ownedCourses')->ownedCourses;
        return response()->json($courses);
    }

    /**
     * List all the courses enrolled by a student
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function indexStudent(Request $request): JsonResponse
    {
        $user = $request->user();
        $courses = $user->load('courses')->courses;

        return response()->json($courses);
    }

    /**
     * Enroll a student in a course
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function addStudentCourse(Request $request): JsonResponse
    {
        $request->validate([
            'course_id' => ['required', 'integer', 'exists:courses,id'],
        ]);
        $user = $request->user();
        $user->courses()->attach($request->course_id);
        return response()->json($request->course_id);
    }

    /**
     * Create a course as a teacher
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function createCourse(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'category_id' => ['required', 'integer'],
            'semester_id' => ['required', 'integer'],
            'ects' => ['required', 'integer']
        ]);

        $user = $request->user();
        $course = new Course();
        $course->name = $request->input('name');
        $course->description = $request->input('description');
        $course->teacher_id = $user->id;
        $course->category_id = $request->input('category_id');
        $course->semester_id = $request->input('semester_id');
        $course->ects = $request->input('ects');
        $course->save();
        return response()->json($course);
    }

    /**
     * Student leave course
     *
     * @param Request $request
     * @param Course $course
     * @return JsonResponse
     */
    public function removeStudentCourse(Request $request, Course $course): JsonResponse
    {
        $user = $request->user();
        $user->courses()->detach($course->id);

        return response()->json($course);
    }

    /**
     * Teacher delete course
     *
     * @param Request $request
     * @param Course $course
     * @return JsonResponse
     */
    public function removeTeacherCourse(Request $request, Course $course): JsonResponse
    {
        $user = $request->user();
        //TODO: method body

        return response()->json($course);
    }

    /**
     * Get all students for a course
     */
    public function getAllStudents(Course $course): JsonResponse
    {
        $users = $course->load('users')->users;

        return response()->json($users);
    }
}
