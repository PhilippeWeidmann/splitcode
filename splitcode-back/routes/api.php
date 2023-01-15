<?php

use App\Http\Controllers\AttemptController;
use App\Http\Controllers\ChatMessageController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseExerciseController;
use App\Http\Controllers\ExerciseConceptsController;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\QuestionAttemptController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SandboxController;
use App\Http\Controllers\ScalaCompilerController;
use App\Http\Controllers\StudentExercise;
use App\Http\Controllers\TeacherExercise;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserCourses;
use App\Http\Controllers\WebSocketController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', [UserController::class, 'displayCurrentUser']);

    Route::apiResource("exercises", ExerciseController::class);
    Route::apiResource("courses", CourseController::class);
    Route::apiResource("courses.exercises", CourseExerciseController::class);
    Route::apiResource("courses.exercises.attempt", AttemptController::class);
    Route::apiResource("courses.exercises.exercise-concepts", ExerciseConceptsController::class);

    Route::get("teacher/me/courses", [UserCourses::class, 'indexTeacher']);
    Route::post("teacher/me/courses", [UserCourses::class, 'createCourse']);
    Route::delete("teacher/me/courses/{course}", [UserCourses::class, 'removeTeacherCourse']);
    Route::get("student/me/courses", [UserCourses::class, 'indexStudent']);
    Route::post("student/me/courses", [UserCourses::class, 'addStudentCourse']);
    Route::delete("student/me/courses/{course}", [UserCourses::class, 'removeStudentCourse']);
    Route::get("teacher/me/exercises/{exercise}", [TeacherExercise::class, 'show']);
    Route::post("teacher/me/course/create", [CourseController::class, 'store']);
    Route::post("teacher/me/exercise/create", [ExerciseController::class, 'store']);


    Route::get("student/me/courses/{course}/exercises/{exercise}", [StudentExercise::class, 'show']);
    Route::post("student/me/courses/{course}/exercises/{exercise}/attempts", [AttemptController::class, 'createAttempt']);
    Route::put("student/me/attempts/{attempt}", [AttemptController::class, 'finishAttempt']);
    Route::get("student/me/groupattempts/{groupAttempt}", [AttemptController::class, 'showGroupAttempt']);
    Route::put("student/me/groupattempts/{groupAttempt}", [AttemptController::class, 'finishGroupAttempt']);

    Route::get("student/me/sandboxes/{sandbox}/attempt/exercise", [AttemptController::class, 'getExercise']);
    Route::get("student/me/sandboxes/{sandbox}", [SandboxController::class, 'show']);
    Route::put("student/me/sandboxes/{sandbox}", [SandboxController::class, 'update']);
    Route::get("student/me/groupattempts/{groupAttempt}/messages", [ChatMessageController::class, 'index']);
    Route::put("student/me/attempts/{attempt}/checkin", [AttemptController::class, 'checkInAttempt']);
    Route::put("student/me/groupattempts/{groupAttempt}/checkin", [AttemptController::class, 'checkInGroupAttempt']);

    Route::get("teacher/me/exercises/{exercise}/attempts/{attempt}", [AttemptController::class, 'getAttemptSandbox']);
    Route::get("teacher/me/exercises/{exercise}/groupAttempts/{groupAttempt}", [AttemptController::class, 'getGroupAttemptSandbox']);
    Route::get("websocket/token", [WebSocketController::class, 'token']);

    Route::post("scala/compile", [ScalaCompilerController::class, 'compile']);

    Route::get("teacher/me/course/{course}/students", [UserCourses::class, 'getAllStudents']);
    Route::get("teacher/me/exercises/{exercise}/concepts", [ExerciseConceptsController::class, 'index']);
    Route::get("teacher/me/exercises/{exercise}/sandboxes/single", [ExerciseController::class, 'getAllSandboxesSingleAttempts']);
    Route::get("teacher/me/exercises/{exercise}/sandboxes/group", [ExerciseController::class, 'getAllSandboxesGroupAttempts']);

    Route::get("student/me/groupattempts/{groupAttempt}/questions", [QuestionController::class, 'index']);
    Route::get("student/me/exercises/{exercise}/question/attempt", [AttemptController::class, "getLastGroupAttempt"]);
    Route::post("student/me/exercises/{exercise}/question/create", [QuestionAttemptController::class, 'store']);

    Route::put("teacher/me/grade/update", [AttemptController::class, "updateAttemptResult"]);
});
