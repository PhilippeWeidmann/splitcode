<?php

namespace App\Http\Controllers;

use App\Models\Sandbox;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SandboxController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param Sandbox $sandbox
     * @return JsonResponse|void
     */
    public function show(Request $request, Sandbox $sandbox)
    {
        $userId = $request->user()->id;
        if ($sandbox->attempt && $sandbox->attempt->user_id == $userId) {
            $sandbox->load('attempt.exercise');
            return response()->json($sandbox);
        } else {
            $groupAttempt = $sandbox->groupAttemptFirstUser()->first();
            if ($groupAttempt && ($groupAttempt->first_user_id == $userId || $groupAttempt->second_user_id == $userId)) {
                $sandbox->load('groupAttemptFirstUser.exercise');
                $sandbox->groupAttempt = $sandbox->groupAttemptFirstUser;
                unset($sandbox['groupAttemptFirstUser']);

                return response()->json($sandbox);
            }

            $groupAttempt = $sandbox->groupAttemptSecondUser()->first();
            if ($groupAttempt && ($groupAttempt->first_user_id == $userId || $groupAttempt->second_user_id == $userId)) {
                $sandbox->load('groupAttemptSecondUser.exercise');
                $sandbox->groupAttempt = $sandbox->groupAttemptSecondUser;
                unset($sandbox['groupAttemptSecondUser']);

                return response()->json($sandbox);
            }

            $groupAttempt = $sandbox->groupAttemptSharedSandbox()->first();
            if ($groupAttempt && ($groupAttempt->first_user_id == $userId || $groupAttempt->second_user_id == $userId)) {
                $sandbox->load('groupAttemptSharedSandbox.exercise');
                $sandbox->groupAttempt = $sandbox->groupAttemptSharedSandbox;
                unset($sandbox['groupAttemptSharedSandbox']);

                return response()->json($sandbox);
            }

            abort(403);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Sandbox $sandbox
     * @return JsonResponse|void
     */
    public function update(Request $request, Sandbox $sandbox)
    {
        $request->validate(['content' => ['nullable', 'string']]);

        $userId = $request->user()->id;
        if ($sandbox->attempt && $sandbox->attempt->user_id == $userId) {
            $sandbox->content = $request->input('content');
            $sandbox->save();
            return response()->json($sandbox);
        } else {
            // TODO: check if this is right, the idea is that the user can update the sandbox only he owns it or it's a shared sandbox
            $groupAttempt = $sandbox->groupAttemptFirstUser()->first();
            $authorized = false;
            if ($groupAttempt && $groupAttempt->first_user_id == $userId) {
                $authorized = true;
            }

            $groupAttempt = $sandbox->groupAttemptSecondUser()->first();
            if ($groupAttempt && $groupAttempt->second_user_id == $userId) {
                $authorized = true;
            }

            $groupAttempt = $sandbox->groupAttemptSharedSandbox()->first();
            if ($groupAttempt && ($groupAttempt->first_user_id == $userId || $groupAttempt->second_user_id == $userId)) {
                $authorized = true;
            }

            if ($authorized) {
                $sandbox->content = $request->input('content');
                $sandbox->save();
                return response()->json($sandbox);
            }

            abort(403);
        }
    }

}
