<?php

namespace App\Http\Controllers;

use App\Models\Attempt;
use App\Models\AttemptResult;
use App\Models\Course;
use App\Models\Exercise;
use App\Models\GroupAttempt;
use App\Models\Sandbox;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;

class AttemptController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index($course_id, $exercise_id)
    {
        $attempts = Attempt::with("attemptResult")->where("exercise_id", $exercise_id)->get();
        return response()->json($attempts);
    }

    /**
     * Display the specified resource.
     *
     * @param Attempt $attempt
     * @return JsonResponse
     */
    public function show(Attempt $attempt)
    {
        return response()->json($attempt);
    }

    public function getAttemptSandbox(Exercise $exercise, Attempt $attempt)
    {
        return response()->json(Attempt::find($attempt->id)->sandbox);
    }

    public function getGroupAttemptSandbox(Exercise $exercise, GroupAttempt $groupAttempt)
    {
        return response()->json(GroupAttempt::find($groupAttempt->id)->sharedSandbox);

    }

    public function getExercise(Sandbox $sandbox)
    {
        return response()->json(Attempt::where("sandbox_id", $sandbox->id)->first()->exercise);
    }

    public function finishAttempt(Request $request, Attempt $attempt)
    {
        $userId = $request->user()->id;
        if ($attempt->user_id != $userId) {
            abort(403);
        }
        $exercise = $attempt->exercise;
        $attempt->completed_at = Carbon::now()->toDateTimeString();
        $attempt->save();

        $groupAttempt = GroupAttempt::where("exercise_id", "=", $exercise->id)
            ->whereNull("second_user_id")
            ->where("first_user_id", "<>", $userId)
            ->first();
        $sandbox = new Sandbox();
        $sandbox->content = $attempt->sandbox->content;
        $sandbox->save();

        if ($groupAttempt) {
            $groupAttempt->second_user_id = $userId;
            $groupAttempt->second_user_sandbox_id = $sandbox->id;
        } else {
            $sharedSandbox = new Sandbox();
            $sharedSandbox->save();

            $groupAttempt = new GroupAttempt();
            $groupAttempt->exercise_id = $exercise->id;
            $groupAttempt->first_user_id = $userId;
            $groupAttempt->first_user_sandbox_id = $sandbox->id;
            $groupAttempt->shared_sandbox_id = $sharedSandbox->id;
        }
        $groupAttempt->save();

        return response()->json($attempt);
    }

    public function finishGroupAttempt(Request $request, GroupAttempt $groupAttempt)
    {
        $userId = $request->user()->id;
        if ($groupAttempt->first_user_id != $userId && $groupAttempt->second_user_id != $userId) {
            abort(403);
        }
        $groupAttempt->completed_at = Carbon::now()->toDateTimeString();
        $groupAttempt->save();

        return response()->json($groupAttempt);
    }

    public function createAttempt(Course $course, Exercise $exercise, Request $request): JsonResponse
    {
        //TODO: prevent creating multiple attempts
        $sandbox = new Sandbox();
        //TODO: add default sandbox content from exercise
        $sandbox->save();
        $attempt = new Attempt();
        $attempt->exercise_id = $exercise->id;
        $attempt->user_id = $request->user()->id;
        $attempt->sandbox_id = $sandbox->id;
        $attempt->save();
        $attempt->refresh();

        return response()->json($attempt);
    }

    public function showGroupAttempt(GroupAttempt $groupAttempt, Request $request)
    {
        $userId = $request->user()->id;
        $groupAttempt->load(['firstUser', 'secondUser']);
        $groupAttempt->makeHidden(['first_user_id', 'second_user_id', 'first_user_sandbox_id', 'second_user_sandbox_id', 'firstUser', 'secondUser']);

        if ($groupAttempt->first_user_id == $userId || $groupAttempt->second_user_id == $userId) {
            if ($groupAttempt->first_user_id == $userId) {
                $groupAttempt->user_sandbox_id = $groupAttempt->first_user_sandbox_id;
                $groupAttempt->remote_sandbox_id = $groupAttempt->second_user_sandbox_id;
                $groupAttempt->user = $groupAttempt->firstUser;
                $groupAttempt->remoteUser = $groupAttempt->secondUser;
            } else {
                $groupAttempt->user_sandbox_id = $groupAttempt->second_user_sandbox_id;
                $groupAttempt->remote_sandbox_id = $groupAttempt->first_user_sandbox_id;
                $groupAttempt->user = $groupAttempt->secondUser;
                $groupAttempt->remoteUser = $groupAttempt->firstUser;
            }
            return response()->json($groupAttempt);
        }
        abort(403);
    }

    public function checkInGroupAttempt(GroupAttempt $groupAttempt, Request $request)
    {
        $userId = $request->user()->id;
        if ($groupAttempt->first_user_id == $userId) {
            // Add 25 seconds to give some room for error
            if (Carbon::parse($groupAttempt->last_check_in_first_user)->addSeconds(25)->isPast()) {
                // Clock in 30 seconds
                $groupAttempt->time_spent_in_seconds_first_user += 30;
                $groupAttempt->last_check_in_first_user = Carbon::now()->toDateTimeString();
                $groupAttempt->save();
            }
            return response()->json('ok');
        } else if ($groupAttempt->second_user_id == $userId) {
            if (Carbon::parse($groupAttempt->last_check_in_second_User)->addSeconds(25)->isPast()) {
                // Clock in 30 seconds
                $groupAttempt->time_spent_in_seconds_second_user += 30;
                $groupAttempt->last_check_in_second_User = Carbon::now()->toDateTimeString();
                $groupAttempt->save();
            }
            return response()->json('ok');
        } else {
            abort(403);
        }
    }

    public function checkInAttempt(Attempt $attempt, Request $request)
    {
        $userId = $request->user()->id;
        if ($attempt->user_id == $userId) {
            // Add 25 seconds to give some room for error
            if (Carbon::parse($attempt->last_check_in)->addSeconds(25)->isPast()) {
                // Clock in 30 seconds
                $attempt->time_spent_in_seconds += 30;
                $attempt->last_check_in = Carbon::now()->toDateTimeString();
                $attempt->save();
            }
            return response()->json('ok');
        } else {
            abort(403);
        }
    }

    public function getLastGroupAttempt(Exercise $exercise, Request $request)
    {
        $userId = $request->user()->id;
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

        if ($groupAttempt) {
            $groupAttempt->load(['sharedSandbox']);
            return response()->json($groupAttempt);
        } else {
            return response()->json(null);
        }
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        //
    }

    public function updateAttemptResult(Request $request): JsonResponse
    {
        $attemptResult = AttemptResult::where("id", "=", $request->input("id"))->first();
        $attemptResult->update(array("result" => $request->input("result")));
        return response()->json($attemptResult);
    }


}
